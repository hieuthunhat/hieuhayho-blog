import { describe, expect, it } from 'vitest';
import request from 'supertest';
import Koa from 'koa';
import Router from '@koa/router';
import { requireAdmin } from '../middleware/require-admin.js';
import { signAdminToken, COOKIE_NAME } from '../lib/jwt.js';
import { errorHandler } from '../middleware/error-handler.js';

function buildAppWithGuard() {
  const app = new Koa();
  app.keys = [process.env.JWT_SECRET!];
  app.use(errorHandler);
  const r = new Router();
  r.get('/protected', requireAdmin, (ctx) => {
    ctx.body = { ok: true, user: ctx.state.user };
  });
  app.use(r.routes());
  return app.callback();
}

describe('requireAdmin', () => {
  it('rejects with 401 when no cookie', async () => {
    const res = await request(buildAppWithGuard()).get('/protected');
    expect(res.status).toBe(401);
  });

  it('rejects with 401 when cookie is malformed', async () => {
    const res = await request(buildAppWithGuard())
      .get('/protected')
      .set('Cookie', `${COOKIE_NAME}=not-a-jwt`);
    expect(res.status).toBe(401);
  });

  it('passes through with a valid cookie and sets ctx.state.user', async () => {
    const token = signAdminToken();
    const res = await request(buildAppWithGuard())
      .get('/protected')
      .set('Cookie', `${COOKIE_NAME}=${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, user: 'admin' });
  });
});