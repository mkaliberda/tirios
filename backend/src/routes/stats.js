const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const [total, aggregate] = await Promise.all([
      prisma.item.count(),
      prisma.item.aggregate({
        _avg: {
          price: true
        }
      })
    ]);

    const stats = {
      total,
      averagePrice: aggregate._avg.price ?? 0
    };

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
