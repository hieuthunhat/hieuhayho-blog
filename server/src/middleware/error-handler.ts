import type { Context, Next } from 'koa';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    const e = err as { status?: number; message?: string };
    ctx.status = e.status ?? 500;
    ctx.body = { message: e.message ?? 'Internal error' };
  }
}