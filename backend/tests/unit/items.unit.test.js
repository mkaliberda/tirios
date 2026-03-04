const request = require('supertest');

describe('items routes', () => {
  let app;
  let prismaMock;
  let cacheMock;
  let invalidateItemsAndStatsCache;

  beforeEach(() => {
    jest.resetModules();

    prismaMock = {
      item: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn()
      }
    };

    cacheMock = {
      DEFAULT_TTL_SECONDS: 300,
      getJSON: jest.fn(),
      setJSON: jest.fn(),
      del: jest.fn(),
      deleteByPrefix: jest.fn(),
      disconnect: jest.fn()
    };

    invalidateItemsAndStatsCache = jest.fn();

    jest.doMock('../../src/lib/prisma', () => prismaMock);
    jest.doMock('../../src/lib/cache', () => cacheMock);
    jest.doMock('../../src/lib/items-cache', () => ({
      invalidateItemsAndStatsCache,
      warmStatsAndAllItemsCache: jest.fn()
    }));

    app = require('../../src/app');
  });

  test('returns cached list response when present', async () => {
    const payload = {
      items: [{ id: 1, name: 'Cached item', category: 'Hardware', price: 100 }],
      pagination: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1
      }
    };

    cacheMock.getJSON.mockResolvedValue(payload);

    const response = await request(app).get('/api/items?limit=1&page=1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(payload);
    expect(prismaMock.item.count).not.toHaveBeenCalled();
    expect(prismaMock.item.findMany).not.toHaveBeenCalled();
  });

  test('returns paginated list response and stores it in cache', async () => {
    cacheMock.getJSON.mockResolvedValue(null);
    cacheMock.setJSON.mockResolvedValue();

    prismaMock.item.count.mockResolvedValue(3);
    prismaMock.item.findMany.mockResolvedValue([
      { id: 3, name: 'Item 3', category: 'A', price: 30 }
    ]);

    const response = await request(app).get('/api/items?limit=2&page=2');

    expect(response.status).toBe(200);
    expect(prismaMock.item.findMany).toHaveBeenCalledWith({
      where: undefined,
      take: 2,
      skip: 2,
      orderBy: {
        id: 'asc'
      }
    });
    expect(response.body).toEqual({
      items: [{ id: 3, name: 'Item 3', category: 'A', price: 30 }],
      pagination: {
        page: 2,
        limit: 2,
        total: 3,
        totalPages: 2
      }
    });
    expect(cacheMock.setJSON).toHaveBeenCalledTimes(1);
    expect(cacheMock.setJSON).toHaveBeenCalledWith(
      expect.any(String),
      response.body,
      cacheMock.DEFAULT_TTL_SECONDS
    );
  });

  test('returns 404 for invalid detail id', async () => {
    const response = await request(app).get('/api/items/not-a-number');

    expect(response.status).toBe(404);
  });

  test('returns item detail and stores it in cache on miss', async () => {
    const item = { id: 42, name: 'Keyboard', category: 'Peripherals', price: 99 };

    cacheMock.getJSON.mockResolvedValue(null);
    cacheMock.setJSON.mockResolvedValue();
    prismaMock.item.findUnique.mockResolvedValue(item);

    const response = await request(app).get('/api/items/42');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(item);
    expect(cacheMock.setJSON).toHaveBeenCalledWith(
      expect.any(String),
      item,
      cacheMock.DEFAULT_TTL_SECONDS
    );
  });

  test('creates an item and invalidates cached data', async () => {
    const created = { id: 101, name: 'Mouse', category: 'Peripherals', price: 60 };

    prismaMock.item.create.mockResolvedValue(created);
    invalidateItemsAndStatsCache.mockResolvedValue();

    const response = await request(app)
      .post('/api/items')
      .send({
        name: 'Mouse',
        category: 'Peripherals',
        price: 60
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(created);
    expect(invalidateItemsAndStatsCache).toHaveBeenCalledTimes(1);
  });
});
