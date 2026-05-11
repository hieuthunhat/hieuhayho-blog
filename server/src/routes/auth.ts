import Router from '@koa/router';
import { COOKIE_MAX_AGE_MS, COOKIE_NAME, signAdminToken, verifyAdminToken } from '../lib/jwt.js';

const router = new Router({ prefix: '/api/auth' });

function setAuthCookie(ctx: import('koa').Context, token: string) {
  ctx.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
    overwrite: true,
  });
}

function clearAuthCookie(ctx: import('koa').Context) {
  ctx.cookies.set(COOKIE_NAME, null, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    path: '/',
    overwrite: true,
  });
}

router.post('/login', (ctx) => {
  const body = ctx.request.body as { email?: string; password?: string };
  const email = body?.email?.trim();
  const password = body?.password ?? '';

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Email and password are required' };
    return;
  }

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid credentials' };
    return;
  }

  setAuthCookie(ctx, signAdminToken());
  ctx.body = { ok: true };
});

router.get('/me', (ctx) => {
  const token = ctx.cookies.get(COOKIE_NAME);
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Not authenticated' };
    return;
  }
  try {
    verifyAdminToken(token);
    ctx.body = { admin: true };
  } catch {
    ctx.status = 401;
    ctx.body = { message: 'Invalid or expired token' };
  }
});

router.post('/logout', (ctx) => {
  clearAuthCookie(ctx);
  ctx.body = { ok: true };
});

export default router;