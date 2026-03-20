import fs from 'fs';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';

const logFile = path.resolve('log.txt');

function sanitize(value: string): string {
  return value.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

export function logMiddleware(req: Request, _res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const headers = Object.entries(req.headers)
    .map(([k, v]) => `  ${sanitize(k)}: ${sanitize(Array.isArray(v) ? v.join(', ') : v ?? '')}`)
    .join('\n');

  const entry = `[${timestamp}] ${req.method} ${sanitize(req.url)}\n${headers}\n\n`;

  fs.appendFile(logFile, entry, () => {});
  next();
}
