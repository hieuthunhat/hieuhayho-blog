import type { Context, Next } from 'koa';
import { COOKIE_NAME, verifyAdminToken } from '../lib/jwt.js';

export async function requireAdmin(ctx: Context, next: Next) {
  const token = ctx.cookies.get(COOKIE_NAME);
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Not authenticated' };
    return;
  }
  try {
    verifyAdminToken(token);
  } catch {
    ctx.status = 401;
    ctx.body = { message: 'Invalid or expired token' };
    return;
  }
  ctx.state.user = 'admin';
  await next();
}