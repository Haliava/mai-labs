import jwt from 'jsonwebtoken';
import redisClient from '../../redis.js';

const JWT_SECRET = 'secret-key';
const TOKEN_EXPIRY = 60 * 60;

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const storeToken = async (userId, token) => {
  await redisClient.set(`auth:token:${userId}`, token, { EX: TOKEN_EXPIRY });
  await redisClient.set(`auth:user:${token}`, userId, { EX: TOKEN_EXPIRY });
};

export const verifyToken = async (token) => {
  try {
    const userId = await redisClient.get(`auth:user:${token}`);
    
    if (!userId) {
      return null;
    }
    
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export const invalidateToken = async (userId, token) => {
  await redisClient.del(`auth:token:${userId}`);
  await redisClient.del(`auth:user:${token}`);
};

export const getUserToken = async (userId) => {
  return await redisClient.get(`auth:token:${userId}`);
}; 