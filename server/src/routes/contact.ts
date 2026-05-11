import Router from '@koa/router';
import { Timestamp } from 'firebase-admin/firestore';
import { contactCol } from '../lib/firestore.js';
import { requireAdmin } from '../middleware/require-admin.js';
import type { ContactDoc, ContactPayload } from '../types.js';

const router = new Router();

router.post('/api/contact', async (ctx) => {
  const body = ctx.request.body as Partial<ContactPayload>;
  const name = body?.name?.trim() ?? '';
  const email = body?.email?.trim() ?? '';
  const message = body?.message?.trim() ?? '';

  if (!name || !email || message.length < 10) {
    ctx.status = 400;
    ctx.body = { message: 'Name, email, and a message of 10+ chars are required' };
    return;
  }

  const ip = ctx.request.ip ?? null;
  await contactCol().add({
    name,
    email,
    message,
    createdAt: Timestamp.now(),
    ip,
  });

  ctx.body = { ok: true };
});

router.get('/api/admin/contact-submissions', requireAdmin, async (ctx) => {
  const snap = await contactCol().orderBy('createdAt', 'desc').get();
  ctx.body = snap.docs.map((d) => {
    const v = d.data() as ContactDoc;
    return {
      id: d.id,
      name: v.name,
      email: v.email,
      message: v.message,
      createdAt: v.createdAt.toDate().toISOString(),
      ip: v.ip,
    };
  });
});

export default router;
