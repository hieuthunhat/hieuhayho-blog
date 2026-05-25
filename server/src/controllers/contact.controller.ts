import type { Context } from 'koa';
import { ContactService } from '../services/contact.service.js';
import { parseContactPayload } from '../validators/contact.validator.js';

export const ContactController = {
  async submit(ctx: Context) {
    const payload = parseContactPayload(ctx.request.body);
    await ContactService.submit(payload, ctx.request.ip ?? null);
    ctx.body = { ok: true };
  },

  async listAdmin(ctx: Context) {
    const records = await ContactService.list();
    ctx.body = records.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      message: r.message,
      createdAt: r.createdAt.toDate().toISOString(),
      ip: r.ip,
    }));
  },
};
