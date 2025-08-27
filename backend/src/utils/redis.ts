import Redis from 'ioredis';
import { redisConfig, cacheConfig } from '@/config';
import { logger } from './logger';

let redisClient: Redis | null = null;

export const initializeRedis = async (): Promise<void> => {
  try {
    redisClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    throw error;
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

// Cache operations
export const setCache = async (key: string, value: any, ttl: number = cacheConfig.ttl): Promise<void> => {
  try {
    const client = getRedisClient();
    const serializedValue = JSON.stringify(value);
    await client.setex(key, ttl, serializedValue);
  } catch (error) {
    logger.error('Failed to set cache:', error);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  } catch (error) {
    logger.error('Failed to get cache:', error);
    return null;
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error('Failed to delete cache:', error);
  }
};

export const clearCache = async (pattern: string = '*'): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      logger.info(`Cleared ${keys.length} cache keys matching pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error('Failed to clear cache:', error);
  }
};

// Session operations
export const setSession = async (sessionId: string, data: any, ttl: number = 3600): Promise<void> => {
  try {
    const client = getRedisClient();
    const key = `session:${sessionId}`;
    const serializedData = JSON.stringify(data);
    await client.setex(key, ttl, serializedData);
  } catch (error) {
    logger.error('Failed to set session:', error);
  }
};

export const getSession = async <T>(sessionId: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const key = `session:${sessionId}`;
    const value = await client.get(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  } catch (error) {
    logger.error('Failed to get session:', error);
    return null;
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const key = `session:${sessionId}`;
    await client.del(key);
  } catch (error) {
    logger.error('Failed to delete session:', error);
  }
};

// Rate limiting
export const incrementRateLimit = async (key: string, windowMs: number): Promise<number> => {
  try {
    const client = getRedisClient();
    const current = await client.incr(key);
    if (current === 1) {
      await client.expire(key, Math.floor(windowMs / 1000));
    }
    return current;
  } catch (error) {
    logger.error('Failed to increment rate limit:', error);
    return 0;
  }
};

export const getRateLimit = async (key: string): Promise<number> => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    logger.error('Failed to get rate limit:', error);
    return 0;
  }
};

// Job search cache
export const cacheJobSearch = async (query: string, filters: any, results: any): Promise<void> => {
  try {
    const cacheKey = `job_search:${Buffer.from(JSON.stringify({ query, filters })).toString('base64')}`;
    await setCache(cacheKey, results, 1800); // 30 minutes
  } catch (error) {
    logger.error('Failed to cache job search:', error);
  }
};

export const getCachedJobSearch = async (query: string, filters: any): Promise<any | null> => {
  try {
    const cacheKey = `job_search:${Buffer.from(JSON.stringify({ query, filters })).toString('base64')}`;
    return await getCache(cacheKey);
  } catch (error) {
    logger.error('Failed to get cached job search:', error);
    return null;
  }
};

// User analytics cache
export const cacheUserAnalytics = async (userId: string, analytics: any): Promise<void> => {
  try {
    const cacheKey = `user_analytics:${userId}`;
    await setCache(cacheKey, analytics, 3600); // 1 hour
  } catch (error) {
    logger.error('Failed to cache user analytics:', error);
  }
};

export const getCachedUserAnalytics = async (userId: string): Promise<any | null> => {
  try {
    const cacheKey = `user_analytics:${userId}`;
    return await getCache(cacheKey);
  } catch (error) {
    logger.error('Failed to get cached user analytics:', error);
    return null;
  }
};

// Close Redis connection
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
};

export default {
  initializeRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  clearCache,
  setSession,
  getSession,
  deleteSession,
  incrementRateLimit,
  getRateLimit,
  cacheJobSearch,
  getCachedJobSearch,
  cacheUserAnalytics,
  getCachedUserAnalytics,
  closeRedis,
};
