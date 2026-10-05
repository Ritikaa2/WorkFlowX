const { createClient } = require("redis");

// 1. Create Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

// Fallback Memory Cache (if Redis is not running)
const memoryCache = new Map();
let isConnected = false;

// 2. Event Listeners
redisClient.on("connect", () => {
  isConnected = true;
  console.log("Redis connected successfully!");
});

redisClient.on("error", (err) => {
  isConnected = false;
});

// 3. Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    isConnected = false;
    console.log("Redis offline - using in-memory cache");
  }
})();

// 4. Get Data from Cache
const getCache = async (key) => {
  try {
    if (isConnected) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
    return memoryCache.get(key) || null;
  } catch (err) {
    return null;
  }
};

// 5. Save Data in Cache (TTL in seconds)
const setCache = async (key, value, ttl = 300) => {
  try {
    if (isConnected) {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } else {
      memoryCache.set(key, value);
    }
  } catch (err) {
    console.log("Cache set error:", err.message);
  }
};

// 6. Delete a Single Cache Key
const delCache = async (key) => {
  try {
    if (isConnected) {
      await redisClient.del(key);
    }
    memoryCache.delete(key);
  } catch (err) {
    console.log("Cache delete error:", err.message);
  }
};

// 7. Delete Multiple Keys by Pattern (e.g. "tasks:*")
const delPattern = async (pattern) => {
  try {
    if (isConnected) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }
    memoryCache.clear();
  } catch (err) {
    console.log("Cache pattern delete error:", err.message);
  }
};

module.exports = {
  redisClient,
  getCache,
  setCache,
  delCache,
  delPattern
};
