const axios = require('axios');

const BASE_URL = process.env.FUNCTIONAL_BASE_URL || 'http://backend:3001';
const REQUEST_TIMEOUT_MS = 15000;

jest.setTimeout(120000);

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const waitForBackendReady = async () => {
  const maxAttempts = 60;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await axios.get(`${BASE_URL}/api/items`, {
        timeout: REQUEST_TIMEOUT_MS,
        validateStatus: () => true
      });

      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
    }

    await sleep(1000);
  }

  throw new Error('Backend did not become ready in time');
};

describe('functional api tests', () => {
  beforeAll(async () => {
    await waitForBackendReady();
  });

  test('GET /api/items returns list with pagination', async () => {
    const response = await axios.get(`${BASE_URL}/api/items?limit=5&page=1`, {
      timeout: REQUEST_TIMEOUT_MS
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.items)).toBe(true);
    expect(response.data.pagination).toEqual(expect.objectContaining({
      page: 1,
      limit: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number)
    }));
  });

  test('GET /api/stats returns stats payload', async () => {
    const response = await axios.get(`${BASE_URL}/api/stats`, {
      timeout: REQUEST_TIMEOUT_MS
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(expect.objectContaining({
      total: expect.any(Number),
      averagePrice: expect.any(Number)
    }));
  });

  test('POST /api/items creates item and GET /api/items/:id returns it', async () => {
    const uniqueSuffix = Date.now();
    const payload = {
      name: `Functional Item ${uniqueSuffix}`,
      category: 'Functional',
      price: 123
    };

    const createResponse = await axios.post(`${BASE_URL}/api/items`, payload, {
      timeout: REQUEST_TIMEOUT_MS
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.data).toEqual(expect.objectContaining(payload));
    expect(createResponse.data.id).toEqual(expect.any(Number));

    const detailResponse = await axios.get(`${BASE_URL}/api/items/${createResponse.data.id}`, {
      timeout: REQUEST_TIMEOUT_MS
    });

    expect(detailResponse.status).toBe(200);
    expect(detailResponse.data).toEqual(createResponse.data);
  });
});
