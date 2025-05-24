import { invalidateCache, invalidateCacheByPattern, withCache } from './cacheService.js';

// Простая версия без кэширования
const _createUser = async (userRepository, userData) => {
  return await userRepository.create(userData);
};

// Простая версия без кэширования
const _getAllUsers = async (userRepository) => {
  return await userRepository.findAll();
};

// Простая версия без кэширования
const _getUserById = async (userRepository, id) => {
  return await userRepository.findById(id);
};

// Простая версия без кэширования
const _updateUser = async (userRepository, id, userData) => {
  return await userRepository.update(id, userData);
};

// Простая версия без кэширования
const _deleteUser = async (userRepository, id) => {
  return await userRepository.delete(id);
};

// Версия с кэшированием
export const createUser = async (userRepository, userData) => {
  const user = await _createUser(userRepository, userData);
  // Инвалидируем кэш списка всех пользователей
  await invalidateCache('users:all');
  return user;
};

// Версия с кэшированием
export const getAllUsers = withCache(
  _getAllUsers,
  () => 'users:all',
  60 * 10 // TTL 10 минут
);

// Версия с кэшированием
export const getUserById = withCache(
  _getUserById,
  (userRepository, id) => `user:${id}`,
  60 * 5 // TTL 5 минут
);

// Версия с кэшированием
export const updateUser = async (userRepository, id, userData) => {
  const updatedUser = await _updateUser(userRepository, id, userData);
  
  if (updatedUser) {
    // Инвалидируем кэш конкретного пользователя
    await invalidateCache(`user:${id}`);
    // Инвалидируем кэш списка всех пользователей
    await invalidateCache('users:all');
  }
  
  return updatedUser;
};

// Версия с кэшированием
export const deleteUser = async (userRepository, id) => {
  const deletedUser = await _deleteUser(userRepository, id);
  
  if (deletedUser) {
    // Инвалидируем кэш конкретного пользователя
    await invalidateCache(`user:${id}`);
    // Инвалидируем кэш списка всех пользователей
    await invalidateCache('users:all');
  }
  
  return deletedUser;
};
