import { Socket, io } from 'socket.io-client';

import { toast } from '@/shared/hooks/use-toast';

interface Notification {
  type: string;
  data: {
    type: string;
    title?: string;
    message?: string;
    flagId?: number;
    flagName?: string;
    enabled?: boolean;
    organizationId?: number;
    timestamp: string;
    [key: string]: any;
  };
}

class NotificationService {
  private socket: Socket | null = null;
  private connected: boolean = false;

  public initialize(serverUrl: string = 'http://localhost:3000'): void {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(serverUrl);

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Connected to notification server');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Disconnected from notification server');
    });

    this.socket.on('notification', (notification: Notification) => {
      this.handleNotification(notification);
    });
  }

  private handleNotification(notification: Notification): void {
    console.log('Received notification:', notification);
    
    const { type, data } = notification;
    
    switch (type) {
      case 'feature_flag_change':
        this.handleFeatureFlagNotification(data);
        break;
      default:
        toast({
          title: `Новое уведомление: ${type}`,
          description: JSON.stringify(data),
        })
    }
  }

  private handleFeatureFlagNotification(data: any): void {
    const { title, message, flagName, enabled } = data;
    
    toast({
      title: title || 'Изменение Feature Flag',
      description: message || `Флаг "${flagName}" был ${enabled ? 'включен' : 'выключен'}`,
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Disconnected notification service');
    }
  }
}

export const notificationService = new NotificationService(); 