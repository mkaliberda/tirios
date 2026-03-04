const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DEFAULT_TTL_SECONDS = 300;

const client = createClient({
  url: REDIS_URL
});

client.on('error', (error) => {
  console.error('[cache] redis error', error.message);
});

let connectionPromise;

const ensureConnected = async () => {
  if (client.isOpen) {
    return client;
  }

  if (!connectionPromise) {
    connectionPromise = client.connect().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
  return client;
};

const getJSON = async (key) => {
  try {
    const redis = await ensureConnected();
    const value = await redis.get(key);
    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error('[cache] get failed', key, error.message);
    return null;
  }
};

const setJSON = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  try {
    const redis = await ensureConnected();
    const payload = JSON.stringify(value);
    await redis.setEx(key, ttlSeconds, payload);
  } catch (error) {
    console.error('[cache] set failed', key, error.message);
  }
};

const del = async (keys) => {
  const values = Array.isArray(keys) ? keys : [keys];
  const filteredValues = values.filter(Boolean);
  if (filteredValues.length === 0) {
    return;
  }

  try {
    const redis = await ensureConnected();
    await redis.del(filteredValues);
  } catch (error) {
    console.error('[cache] delete failed', filteredValues.join(','), error.message);
  }
};

const deleteByPrefix = async (prefix) => {
  try {
    const redis = await ensureConnected();
    const keys = [];
    for await (const key of redis.scanIterator({
      MATCH: `${prefix}*`,
      COUNT: 100
    })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('[cache] prefix delete failed', prefix, error.message);
  }
};

const disconnect = async () => {
  if (!client.isOpen) {
    return;
  }

  await client.quit();
};

module.exports = {
  DEFAULT_TTL_SECONDS,
  getJSON,
  setJSON,
  del,
  deleteByPrefix,
  disconnect
};
