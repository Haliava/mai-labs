import redisClient from '../../redis.js';
import { v4 as uuidv4 } from 'uuid';

// Время жизни сессии по умолчанию (1 день в секундах)
const DEFAULT_SESSION_TTL = 60 * 60 * 24;

/**
 * Создает новую сессию для пользователя
 * @param {Number} userId - ID пользователя
 * @param {Object} sessionData - Данные сессии
 * @param {Number} ttl - Время жизни сессии в секундах
 * @returns {Promise<String>} - ID сессии
 */
export const createSession = async (userId, sessionData = {}, ttl = DEFAULT_SESSION_TTL) => {
  // Генерируем уникальный ID сессии
  const sessionId = uuidv4();
  
  // Формируем объект данных сессии
  const session = {
    id: sessionId,
    userId,
    createdAt: new Date().toISOString(),
    ...sessionData,
  };
  
  // Сохраняем сессию в Redis с указанным TTL
  await redisClient.set(`session:${sessionId}`, JSON.stringify(session), { EX: ttl });
  
  // Добавляем маппинг userId -> sessionId для быстрого поиска активных сессий пользователя
  await redisClient.sAdd(`user:${userId}:sessions`, sessionId);
  
  return sessionId;
};

/**
 * Получает данные сессии по ID
 * @param {String} sessionId - ID сессии
 * @returns {Promise<Object|null>} - Данные сессии или null, если сессия не найдена
 */
export const getSession = async (sessionId) => {
  const session = await redisClient.get(`session:${sessionId}`);
  return session ? JSON.parse(session) : null;
};

/**
 * Обновляет данные сессии и продлевает время жизни
 * @param {String} sessionId - ID сессии
 * @param {Object} sessionData - Новые данные сессии
 * @param {Number} ttl - Время жизни сессии в секундах
 * @returns {Promise<Boolean>} - true, если сессия успешно обновлена
 */
export const updateSession = async (sessionId, sessionData = {}, ttl = DEFAULT_SESSION_TTL) => {
  // Получаем текущие данные сессии
  const currentSession = await getSession(sessionId);
  
  if (!currentSession) {
    return false;
  }
  
  // Обновляем данные сессии
  const updatedSession = {
    ...currentSession,
    ...sessionData,
    updatedAt: new Date().toISOString(),
  };
  
  // Сохраняем обновленную сессию с новым TTL
  await redisClient.set(`session:${sessionId}`, JSON.stringify(updatedSession), { EX: ttl });
  
  return true;
};

/**
 * Удаляет сессию
 * @param {String} sessionId - ID сессии
 * @returns {Promise<Boolean>} - true, если сессия успешно удалена
 */
export const deleteSession = async (sessionId) => {
  // Получаем данные сессии для определения userId
  const session = await getSession(sessionId);
  
  if (!session) {
    return false;
  }
  
  // Удаляем сессию из Redis
  await redisClient.del(`session:${sessionId}`);
  
  // Удаляем sessionId из набора сессий пользователя
  await redisClient.sRem(`user:${session.userId}:sessions`, sessionId);
  
  return true;
};

/**
 * Получает все активные сессии пользователя
 * @param {Number} userId - ID пользователя
 * @returns {Promise<Array>} - Массив активных сессий
 */
export const getUserSessions = async (userId) => {
  // Получаем все ID сессий пользователя
  const sessionIds = await redisClient.sMembers(`user:${userId}:sessions`);
  
  if (!sessionIds.length) {
    return [];
  }
  
  // Получаем данные для каждой сессии
  const sessionsData = await Promise.all(
    sessionIds.map(async (sessionId) => {
      const session = await getSession(sessionId);
      return session; // Может быть null, если сессия истекла
    })
  );
  
  // Фильтруем null значения (истекшие сессии)
  return sessionsData.filter(Boolean);
};

/**
 * Удаляет все сессии пользователя
 * @param {Number} userId - ID пользователя
 * @returns {Promise<Number>} - Количество удаленных сессий
 */
export const deleteUserSessions = async (userId) => {
  // Получаем все ID сессий пользователя
  const sessionIds = await redisClient.sMembers(`user:${userId}:sessions`);
  
  if (!sessionIds.length) {
    return 0;
  }
  
  // Удаляем каждую сессию
  await Promise.all(
    sessionIds.map(async (sessionId) => {
      await redisClient.del(`session:${sessionId}`);
    })
  );
  
  // Очищаем набор сессий пользователя
  await redisClient.del(`user:${userId}:sessions`);
  
  return sessionIds.length;
}; 