import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

export function buildApp(): Koa {
  const app = new Koa();
  // Trust the keys for cookie signing in dev (we use unsigned cookies; this is just to silence Koa's warning).
  app.keys = [process.env.JWT_SECRET ?? 'dev-key'];

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(bodyParser());

  const root = new Router();
  root.get('/api/health', (ctx) => {
    ctx.body = { ok: true };
  });

  app.use(root.routes()).use(root.allowedMethods());

  return app;
}
