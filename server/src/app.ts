import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import authRouter from './routes/auth.routes.js';
import postsRouter from './routes/posts.routes.js';
import uploadsRouter from './routes/uploads.routes.js';
import contactRouter from './routes/contact.routes.js';

export function buildApp(): Koa {
  const app = new Koa();
  app.keys = [process.env.JWT_SECRET ?? 'dev-key'];

  app.use(requestLogger);
  app.use(errorHandler);
  if (process.env.CORS_ORIGIN) {
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );
  }
  app.use(bodyParser());

  const root = new Router();
  root.get('/api/health', (ctx) => {
    ctx.body = { ok: true };
  });

  app.use(root.routes()).use(root.allowedMethods());
  app.use(authRouter.routes()).use(authRouter.allowedMethods());
  app.use(postsRouter.routes()).use(postsRouter.allowedMethods());
  app.use(uploadsRouter.routes()).use(uploadsRouter.allowedMethods());
  app.use(contactRouter.routes()).use(contactRouter.allowedMethods());

  return app;
}