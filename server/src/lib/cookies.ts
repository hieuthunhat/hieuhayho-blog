import type { Context } from 'koa';
import { COOKIE_MAX_AGE_MS, COOKIE_NAME } from './jwt.js';

export function setAuthCookie(ctx: Context, token: string) {
  ctx.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
    overwrite: true,
  });
}

export function clearAuthCookie(ctx: Context) {
  ctx.cookies.set(COOKIE_NAME, null, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    path: '/',
    overwrite: true,
  });
}
