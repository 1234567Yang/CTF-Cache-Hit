import type { Request, Response, NextFunction } from 'express';

const ALLOWED_SUFFIXES = ['.html', '.css', '.js', '.png', '.jpg'];

interface CacheEntry {
  content: Buffer;
  headers: Record<string, string | string[]>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 30 * 1000; // 30 seconds

export function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.url;
  if (!ALLOWED_SUFFIXES.some(ext => key.endsWith(ext))) {
    res.set('X-Cache', 'NOT-ALLOWED-TO-CACHE');
    return next();
  }

  const entry = cache.get(key);

  if (entry && entry.expiresAt > Date.now()) {
    res.set(entry.headers);
    res.set('X-Cache', 'HIT');
    res.send(entry.content);
    return;
  }

  // Cache miss: intercept res.send to store the response
  const originalSend = res.send.bind(res);
  res.send = function (body: any): Response {
    res.set('X-Cache', 'MISS');
    const result = originalSend(body);
    cache.set(key, {
      content: Buffer.isBuffer(body) ? body : Buffer.from(body),
      headers: res.getHeaders() as Record<string, string | string[]>,
      expiresAt: Date.now() + TTL,
    });
    return result;
  };

  next();
}
