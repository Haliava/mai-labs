import * as authController from '../controllers/authController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';

export const authRoutes = express.Router();

// Маршрут для авторизации пользователя
authRoutes.post('/login', authController.login);

// Маршрут для выхода из системы (требует авторизации)
authRoutes.post('/logout', authMiddleware, authController.logout); 