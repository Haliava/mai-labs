import { createSession, deleteSession } from '../services/sessionService.js';
import { generateToken, invalidateToken, storeToken } from '../services/authService.js';

import { userRepository } from '../repository/user.js';

/**
 * Контроллер для авторизации пользователя
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }
    
    // Получаем пользователей и ищем совпадение по email и паролю
    const users = await userRepository.findAll();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    
    // Создаем токен для пользователя
    const token = generateToken(user);
    
    // Сохраняем токен в Redis
    await storeToken(user.id, token);
    
    // Создаем сессию
    const sessionId = await createSession(user.id, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    
    // Отправляем данные пользователю
    res.status(200).json({
      message: 'Авторизация успешна',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
      sessionId,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка сервера при авторизации' });
  }
};

/**
 * Контроллер для выхода пользователя из системы
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @returns {Promise<void>}
 */
export const logout = async (req, res) => {
  try {
    const { userId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const { sessionId } = req.body;
    
    if (!token || !userId) {
      return res.status(400).json({ message: 'Не указан токен или ID пользователя' });
    }
    
    // Инвалидируем токен
    await invalidateToken(userId, token);
    
    // Удаляем сессию
    if (sessionId) {
      await deleteSession(sessionId);
    }
    
    res.status(200).json({ message: 'Выход выполнен успешно' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Ошибка сервера при выходе из системы' });
  }
}; 