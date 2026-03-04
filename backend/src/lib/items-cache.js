const prisma = require('./prisma');
const cache = require('./cache');
const cacheKeys = require('./cache-keys');
const { toItemsListDTO, toStatsDTO } = require('../dto/items-dto');

const { DEFAULT_TTL_SECONDS } = cache;

const warmStatsAndAllItemsCache = async () => {
  const [total, aggregate, items] = await Promise.all([
    prisma.item.count(),
    prisma.item.aggregate({
      _avg: {
        price: true
      }
    }),
    prisma.item.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  ]);

  const statsPayload = toStatsDTO({
    total,
    averagePrice: aggregate._avg.price ?? 0
  });
  const listPayload = toItemsListDTO({
    items,
    page: 1,
    limit: Math.max(total, 1),
    total,
    totalPages: 1
  });

  await Promise.all([
    cache.setJSON(cacheKeys.stats(), statsPayload, DEFAULT_TTL_SECONDS),
    cache.setJSON(cacheKeys.itemsList({}), listPayload, DEFAULT_TTL_SECONDS)
  ]);
};

const invalidateItemsAndStatsCache = async () => {
  await Promise.all([
    cache.del(cacheKeys.stats()),
    cache.deleteByPrefix(cacheKeys.prefixes.list),
    cache.deleteByPrefix(cacheKeys.prefixes.detail)
  ]);
};

module.exports = {
  warmStatsAndAllItemsCache,
  invalidateItemsAndStatsCache
};
