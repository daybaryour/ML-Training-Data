import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Hard cap limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
    res.status(429).json({
      success: false,
      error: 'Too many requests, please slow down.',
      retryAfter: '15 minutes'
    });
  }
});

// Progressive delay limiter
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 min
  delayAfter: 50, // 50 requests at full speed
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500; // progressively add delay
  },
  maxDelayMs: 5000
});

// Log when slowdown engages
export function logSpeedLimit(req: Request, res: Response, next: NextFunction) {
  const slow = (res as any).slowDown;
  if (slow && slow.current > slow.limit) {
    logger.info('Speed limit threshold reached', { ip: req.ip, path: req.path });
  }
  next();
}

// Chat limiter
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'You are sending messages too quickly. Please wait a moment.',
      retryAfter: '1 minute'
    });
  }
});
