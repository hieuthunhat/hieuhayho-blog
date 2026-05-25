import type { Context } from 'koa';
import { AuthService } from '../services/auth.service.js';
import { clearAuthCookie, setAuthCookie } from '../lib/cookies.js';
import { httpError } from '../lib/http-error.js';
import { COOKIE_NAME } from '../lib/jwt.js';

export const AuthController = {
  login(ctx: Context) {
    const body = ctx.request.body as { email?: string; password?: string };
    const email = body?.email?.trim();
    const password = body?.password ?? '';
    if (!email || !password) {
      throw httpError(400, 'Email and password are required');
    }
    const token = AuthService.login(email, password);
    setAuthCookie(ctx, token);
    ctx.body = { ok: true };
  },

  me(ctx: Context) {
    AuthService.verify(ctx.cookies.get(COOKIE_NAME));
    ctx.body = { admin: true };
  },

  logout(ctx: Context) {
    clearAuthCookie(ctx);
    ctx.body = { ok: true };
  },
};
