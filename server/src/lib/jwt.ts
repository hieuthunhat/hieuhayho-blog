import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types.js';

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 chars long');
  }
  return s;
}

export function signAdminToken(): string {
  return jwt.sign({ sub: 'admin' }, getSecret(), {
    algorithm: 'HS256',
    expiresIn: SEVEN_DAYS_SECONDS,
  });
}

export function verifyAdminToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getSecret(), { algorithms: ['HS256'] });
  if (typeof decoded === 'string' || decoded.sub !== 'admin') {
    throw new Error('Invalid token payload');
  }
  return decoded as JwtPayload;
}

export const COOKIE_NAME = 'token';
export const COOKIE_MAX_AGE_MS = SEVEN_DAYS_SECONDS * 1000;