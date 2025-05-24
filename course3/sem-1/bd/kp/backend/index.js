// Инициализируем Redis для уведомлений
import './src/services/notificationService.js'

import { accessControlRoutes } from './src/routes/accesControl.js'
import { authRoutes } from './src/routes/auth.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { featureFlagRoutes } from './src/routes/featureFlag.js'
import http from 'http'
import { initWebSocketServer } from './src/websocket.js'
import { logsRoutes } from './src/routes/logs.js'
import { orgRoutes } from './src/routes/organization.js'
import { orgSettingsRoutes } from './src/routes/organizationSettings.js'
// Импортируем редис-клиент
import redisClient from './redis.js'
import { userOrganizationRoutes } from './src/routes/userOrganization.js'
import { userRoutes } from './src/routes/user.js'

const app = express()
const port = 3000
// postgres is listening to 5432
app.use(express.json())
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
  }),
);

// Маршруты без авторизации
app.use('/api/auth', authRoutes);

// Остальные маршруты
app.use('/api/users', userRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/accessControl', accessControlRoutes);
app.use('/api/feature-flags', featureFlagRoutes);
app.use('/api/organization-settings', orgSettingsRoutes);
app.use('/api/user-organization', userOrganizationRoutes);
app.use('/api/logs', logsRoutes)

const startApp = async () => {
  try {
    // Проверяем подключение к Redis
    redisClient.on('connect', () => {
      console.log('Connected to Redis server');
    });

    // Создаем HTTP сервер из приложения Express
    const server = http.createServer(app);
    
    // Инициализируем WebSocket сервер
    const io = initWebSocketServer(server);
    
    // Запускаем HTTP сервер
    server.listen(port, () => {
      console.log(`Server listening on port ${port} with WebSocket support`);
    });
  } catch (e) {
    console.log(e);
  }
}  

startApp()