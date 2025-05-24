import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

await redisClient.connect();

export default redisClient; 