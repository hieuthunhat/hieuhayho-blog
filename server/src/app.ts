import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { errorHandler } from './middleware/error-handler.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

export function buildApp(): Koa {
  const app = new Koa();
  app.keys = [process.env.JWT_SECRET ?? 'dev-key'];

  app.use(errorHandler);
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
  app.use(authRouter.routes()).use(authRouter.allowedMethods());
  app.use(postsRouter.routes()).use(postsRouter.allowedMethods());

  return app;
}