import type { Context, Next } from 'koa';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    const e = err as { status?: number; code?: string; message?: string };
    if (e.code === 'LIMIT_FILE_SIZE') {
      ctx.status = 400;
      ctx.body = { message: 'File too large' };
      return;
    }
    ctx.status = e.status ?? 500;
    ctx.body = { message: e.message ?? 'Internal error' };
  }
}