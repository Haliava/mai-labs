import { NOTIFICATION_CHANNELS, subscribeToNotifications } from './services/notificationService.js';

import { Server } from 'socket.io';

export const initWebSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  subscribeToNotifications(NOTIFICATION_CHANNELS.FEATURE_FLAG_CHANGE, (message) => {
    if (message.organizationId) {
      io.to(`org:${message.organizationId}`).emit('notification', {
        type: 'feature_flag_change',
        data: message
      });
    }
    
    io.emit('notification', {
      type: 'feature_flag_change',
      data: message
    });
  });

  return io;
}; 