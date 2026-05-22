/**
 * A simple caching utility using sessionStorage/localStorage.
 */

const CACHE_PREFIX = 'ska_cache_';
const DEFAULT_TTL_MS = 1000 * 60 * 5; // 5 minutes

export const setCache = (key, data, ttlMs = DEFAULT_TTL_MS) => {
  try {
    const cacheItem = {
      data,
      expiry: Date.now() + ttlMs,
    };
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
  } catch (e) {
    console.warn('Failed to set cache', e);
  }
};

export const getCache = (key) => {
  try {
    const cachedStr = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cachedStr) return null;

    const cacheItem = JSON.parse(cachedStr);
    if (Date.now() > cacheItem.expiry) {
      // Cache expired
      sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return cacheItem.data;
  } catch (e) {
    console.warn('Failed to get cache', e);
    return null;
  }
};

export const clearCache = (key) => {
  try {
    if (key) {
      sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } else {
      // Clear all ska_cache
      Object.keys(sessionStorage).forEach(k => {
        if (k.startsWith(CACHE_PREFIX)) {
          sessionStorage.removeItem(k);
        }
      });
    }
  } catch (e) {
    console.warn('Failed to clear cache', e);
  }
};
