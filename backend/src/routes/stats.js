const express = require('express');
const prisma = require('../lib/prisma');
const cache = require('../lib/cache');
const cacheKeys = require('../lib/cache-keys');
const router = express.Router();

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const cacheKey = cacheKeys.stats();
    const cachedResponse = await cache.getJSON(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

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

    await cache.setJSON(cacheKey, stats, cache.DEFAULT_TTL_SECONDS);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
