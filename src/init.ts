// init.ts
import type { Express, Response } from 'express';
import helmet from 'helmet';
import validator from 'validator';
import { query, validationResult, matchedData } from 'express-validator';

// ========== App 初始化 ==========
export function initializeSecurity(app: Express) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "blob:"],
          frameAncestors: ["'self'"],
          formAction: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
    })
  );
  app.disable('x-powered-by');
  app.set('query parser', 'simple');
}

// ========== 导出工具 ==========
export const evQuery = query;
export const evValidationResult = validationResult;
export const evMatchedData = matchedData;

export const notArrayOrObject = (value: any) => {
  if (Array.isArray(value) || typeof value === 'object') {
    throw new Error('Invalid type');
  }
  return true;
};

function sanitizeForJson(str: string): string {
  return validator.escape(str);
}

function sanitizeSingleError(error: Error): string {
  return error instanceof Error
    ? sanitizeForJson(String(error))
    : 'An error occurred';
}

export function badRequest(res: Response, errors: any, status: number = 400) {
  let errStr: string[];
  if (Array.isArray(errors)) {
    errStr = errors
      .filter((e: any) => e instanceof Error)
      .map((e: Error) => sanitizeSingleError(e));
  } else if (errors instanceof Error) {
    errStr = [sanitizeSingleError(errors)];
  } else {
    errStr = ['unknown'];
  }
  return res.status(status).json({ msg: 'Bad request', err: errStr });
}