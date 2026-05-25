import type { Context, Next } from 'koa';

export async function requestLogger(ctx: Context, next: Next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const source = ctx.request.header.origin ?? ctx.request.ip ?? 'unknown';
  // eslint-disable-next-line no-console
  console.log(
    `[${new Date().toISOString()}] ${ctx.method} ${ctx.url} -> ${ctx.status} ${ms}ms (from ${source})`
  );
}
