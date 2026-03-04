const request = require('supertest');

describe('stats route', () => {
  let app;
  let prismaMock;
  let cacheMock;

  beforeEach(() => {
    jest.resetModules();

    prismaMock = {
      item: {
        count: jest.fn(),
        aggregate: jest.fn()
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

    jest.doMock('../../src/lib/prisma', () => prismaMock);
    jest.doMock('../../src/lib/cache', () => cacheMock);

    app = require('../../src/app');
  });

  test('returns cached stats response when present', async () => {
    const payload = { total: 12, averagePrice: 34.5 };
    cacheMock.getJSON.mockResolvedValue(payload);

    const response = await request(app).get('/api/stats');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(payload);
    expect(prismaMock.item.count).not.toHaveBeenCalled();
    expect(prismaMock.item.aggregate).not.toHaveBeenCalled();
  });

  test('returns computed stats and stores result in cache on miss', async () => {
    cacheMock.getJSON.mockResolvedValue(null);
    cacheMock.setJSON.mockResolvedValue();
    prismaMock.item.count.mockResolvedValue(3);
    prismaMock.item.aggregate.mockResolvedValue({
      _avg: {
        price: 150
      }
    });

    const response = await request(app).get('/api/stats');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      total: 3,
      averagePrice: 150
    });
    expect(cacheMock.setJSON).toHaveBeenCalledWith(
      expect.any(String),
      {
        total: 3,
        averagePrice: 150
      },
      cacheMock.DEFAULT_TTL_SECONDS
    );
  });
});
