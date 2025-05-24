import { createClient } from 'redis';

// Redis требует отдельные соединения - 1 для Pub и 1 для Sub
const publisher = createClient({
  url: 'redis://localhost:6379',
});

const subscriber = createClient({
  url: 'redis://localhost:6379',
});

publisher.on('error', (err) => {
  console.error('Redis publisher client error:', err);
});

subscriber.on('error', (err) => {
  console.error('Redis subscriber client error:', err);
});

(async () => {
  await publisher.connect();
  await subscriber.connect();
  console.log('Redis PubSub clients connected');
})();

export const NOTIFICATION_CHANNELS = {
  FEATURE_FLAG_CHANGE: 'notifications:feature_flag_change',
};

export const publishNotification = async (channel, message) => {
  await publisher.publish(channel, JSON.stringify(message));
};

export const subscribeToNotifications = async (channel, callback) => {
  await subscriber.subscribe(channel, (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      callback(parsedMessage);
    } catch (error) {
      console.error(`Error processing message from ${channel}:`, error);
    }
  });
  
  console.log(`Subscribed to channel: ${channel}`);
};

export const unsubscribeFromNotifications = async (channel) => {
  await subscriber.unsubscribe(channel);
  console.log(`Unsubscribed from channel: ${channel}`);
};

export const notifyFeatureFlagChange = async (flagId, flagName, enabled, organizationId = null, description = '') => {
  await publishNotification(NOTIFICATION_CHANNELS.FEATURE_FLAG_CHANGE, {
    type: 'feature_flag_change',
    flagId,
    flagName,
    enabled,
    timestamp: new Date().toISOString(),
    title: `Feature Flag ${enabled ? 'активирован' : 'деактивирован'}`,
    message: `${flagName} был ${enabled ? 'включен' : 'выключен'}${description ? ': ' + description : ''}`,
  });
};
