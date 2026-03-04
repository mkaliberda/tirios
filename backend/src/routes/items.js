const express = require('express');
const prisma = require('../lib/prisma');
const cache = require('../lib/cache');
const cacheKeys = require('../lib/cache-keys');
const { invalidateItemsAndStatsCache } = require('../lib/items-cache');
const { toCreateItemInputDTO, toItemDTO, toItemsListDTO } = require('../dto/items-dto');
const router = express.Router();

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const { limit, page, q } = req.query;
    const parsedLimit = Number.parseInt(limit, 10);
    const parsedPage = Number.parseInt(page, 10);
    const normalizedQuery = {};

    const take = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? undefined : parsedLimit;
    const currentPage = Number.isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
    const skip = take ? (currentPage - 1) * take : undefined;

    if (take) {
      normalizedQuery.limit = take;
    }
    if (currentPage > 1) {
      normalizedQuery.page = currentPage;
    }

    const where = q
      ? {
          OR: [
            {
              name: {
                contains: String(q)
              }
            },
            {
              category: {
                contains: String(q)
              }
            }
          ]
        }
      : undefined;

    if (q) {
      normalizedQuery.q = String(q);
    }

    const cacheKey = cacheKeys.itemsList(normalizedQuery);
    const cachedResponse = await cache.getJSON(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const [total, items] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        take,
        skip,
        orderBy: {
          id: 'asc'
        }
      })
    ]);

    const effectiveLimit = take || Math.max(total, 1);
    const totalPages = Math.max(1, Math.ceil(total / effectiveLimit));

    const response = toItemsListDTO({
      items,
      page: currentPage,
      limit: effectiveLimit,
      total,
      totalPages
    });

    await cache.setJSON(cacheKey, response, cache.DEFAULT_TTL_SECONDS);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }

    const cacheKey = cacheKeys.itemDetail(id);
    const cachedResponse = await cache.getJSON(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const item = await prisma.item.findUnique({
      where: { id }
    });

    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    const response = toItemDTO(item);
    await cache.setJSON(cacheKey, response, cache.DEFAULT_TTL_SECONDS);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const data = toCreateItemInputDTO(req.body);

    const item = await prisma.item.create({
      data
    });

    await invalidateItemsAndStatsCache();

    res.status(201).json(toItemDTO(item));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
