import redisClient from '../../redis.js';

// Значение TTL для кэша по умолчанию (5 минут)
const DEFAULT_CACHE_TTL = 60 * 5;

/**
 * Получает данные из кэша Redis
 * @param {String} key - Ключ кэша
 * @returns {Promise<Object|null>} - Закэшированные данные или null, если данных нет
 */
export const getCachedData = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Сохраняет данные в кэш Redis
 * @param {String} key - Ключ кэша
 * @param {Object} data - Данные для кэширования
 * @param {Number} ttl - Время жизни кэша в секундах (по умолчанию 5 минут)
 * @returns {Promise<void>}
 */
export const setCachedData = async (key, data, ttl = DEFAULT_CACHE_TTL) => {
  await redisClient.set(key, JSON.stringify(data), { EX: ttl });
};

/**
 * Удаляет данные из кэша Redis
 * @param {String} key - Ключ кэша
 * @returns {Promise<void>}
 */
export const invalidateCache = async (key) => {
  await redisClient.del(key);
};

/**
 * Удаляет кэш по шаблону ключа (используя подстановочные знаки)
 * @param {String} pattern - Шаблон ключа, например 'users:*'
 * @returns {Promise<void>}
 */
export const invalidateCacheByPattern = async (pattern) => {
  // Поиск ключей по шаблону
  let cursor = 0;
  do {
    const { cursor: newCursor, keys } = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });
    cursor = newCursor;
    
    // Удаляем найденные ключи
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } while (cursor !== 0);
};

/**
 * Полностью очищает весь кэш в Redis
 * @returns {Promise<void>}
 */
export const flushAllCache = async () => {
  try {
    await redisClient.flushAll();
    console.log('All cache has been flushed successfully');
  } catch (error) {
    console.error('Error flushing cache:', error);
    throw error;
  }
};

/**
 * Декоратор для кэширования результатов функций
 * @param {Function} fn - Функция, результаты которой нужно кэшировать
 * @param {Function} keyGenerator - Функция для генерации ключа кэша на основе аргументов
 * @param {Number} ttl - Время жизни кэша в секундах
 * @returns {Function} - Обернутая функция с кэшированием
 */
export const withCache = (fn, keyGenerator, ttl = DEFAULT_CACHE_TTL) => {
  return async (...args) => {
    // Генерируем ключ кэша на основе аргументов функции
    const cacheKey = keyGenerator(...args);
    
    // Пытаемся получить данные из кэша
    const cachedResult = await getCachedData(cacheKey);
    
    if (cachedResult) {
      // Возвращаем данные из кэша, если они есть
      return cachedResult;
    }
    
    // Если данных в кэше нет, вызываем оригинальную функцию
    const result = await fn(...args);
    
    // Сохраняем результат в кэш
    await setCachedData(cacheKey, result, ttl);
    
    // Возвращаем результат
    return result;
  };
}; 