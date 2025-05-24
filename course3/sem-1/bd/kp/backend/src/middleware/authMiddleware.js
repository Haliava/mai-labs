import { verifyToken } from '../services/authService.js';

/**
 * Middleware для проверки авторизации
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Проверяем наличие токена в заголовке Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Отсутствует или некорректный токен авторизации' 
      });
    }
    
    // Извлекаем токен из заголовка (Bearer <token>)
    const token = authHeader.split(' ')[1];
    
    // Проверяем валидность токена
    const user = await verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Токен недействителен или просрочен' 
      });
    }
    
    // Добавляем данные пользователя к объекту запроса
    req.user = user;
    
    // Передаем управление следующему middleware или обработчику
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Ошибка сервера при аутентификации' });
  }
}; 