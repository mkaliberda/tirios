const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const { limit, q } = req.query;
    const parsedLimit = Number.parseInt(limit, 10);
    const take = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? undefined : parsedLimit;
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

    const results = await prisma.item.findMany({
      where,
      take,
      orderBy: {
        id: 'asc'
      }
    });

    res.json(results);
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
