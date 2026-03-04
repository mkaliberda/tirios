const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const { limit, page, q } = req.query;
    const parsedLimit = Number.parseInt(limit, 10);
    const parsedPage = Number.parseInt(page, 10);
    const take = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? undefined : parsedLimit;
    const currentPage = Number.isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
    const skip = take ? (currentPage - 1) * take : undefined;
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

    res.json({
      items,
      pagination: {
        page: currentPage,
        limit: effectiveLimit,
        total,
        totalPages
      }
    });
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

    const item = await prisma.item.findUnique({
      where: { id }
    });

    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const { name, category, price } = req.body;

    const item = await prisma.item.create({
      data: {
        name,
        category,
        price
      }
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
