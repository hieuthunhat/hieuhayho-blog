import Router from '@koa/router';
import { Timestamp } from 'firebase-admin/firestore';
import { db, postsCol } from '../lib/firestore.js';
import { requireAdmin } from '../middleware/require-admin.js';
import { readingMinutes } from '../lib/reading-time.js';
import type { PostDoc, PostInput, PostStatus, PostSummary } from '../types.js';

const router = new Router();

function toIso(ts: Timestamp | null): string | null {
  return ts ? ts.toDate().toISOString() : null;
}

function toApiSummary(doc: PostDoc): Omit<PostSummary, 'publishedAt' | 'createdAt' | 'updatedAt'> & {
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
} {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    tags: doc.tags,
    status: doc.status,
    readingMinutes: doc.readingMinutes,
    coverImageUrl: doc.coverImageUrl,
    publishedAt: toIso(doc.publishedAt),
    createdAt: toIso(doc.createdAt)!,
    updatedAt: toIso(doc.updatedAt)!,
  };
}

function toApiFull(doc: PostDoc) {
  return { ...toApiSummary(doc), content: doc.content };
}

router.get('/api/posts', async (ctx) => {
  const snap = await postsCol()
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .get();
  ctx.body = snap.docs.map((d) => toApiSummary(d.data() as PostDoc));
});

router.get('/api/posts/:slug', async (ctx) => {
  const slug = ctx.params.slug;
  const snap = await postsCol().doc(slug).get();
  if (!snap.exists) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }
  const data = snap.data() as PostDoc;
  if (data.status !== 'published') {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }
  ctx.body = toApiFull(data);
});

function validateInput(body: unknown): PostInput {
  const b = body as Partial<PostInput>;
  const required = ['title', 'slug', 'excerpt', 'content', 'tags', 'status'] as const;
  for (const k of required) {
    if (b[k] === undefined || b[k] === null) {
      const err = new Error(`Missing field: ${k}`);
      (err as Error & { status?: number }).status = 400;
      throw err;
    }
  }
  if (b.status !== 'draft' && b.status !== 'published') {
    const err = new Error('status must be "draft" or "published"');
    (err as Error & { status?: number }).status = 400;
    throw err;
  }
  if (!Array.isArray(b.tags)) {
    const err = new Error('tags must be an array');
    (err as Error & { status?: number }).status = 400;
    throw err;
  }
  return {
    title: b.title!,
    slug: b.slug!,
    excerpt: b.excerpt!,
    content: b.content!,
    tags: b.tags!,
    status: b.status as PostStatus,
    coverImageUrl: b.coverImageUrl ?? null,
  };
}

router.get('/api/admin/posts', requireAdmin, async (ctx) => {
  const snap = await postsCol().orderBy('updatedAt', 'desc').get();
  ctx.body = snap.docs.map((d) => toApiFull(d.data() as PostDoc));
});

router.get('/api/admin/posts/:slug', requireAdmin, async (ctx) => {
  const snap = await postsCol().doc(ctx.params.slug).get();
  if (!snap.exists) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }
  ctx.body = toApiFull(snap.data() as PostDoc);
});

router.post('/api/admin/posts', requireAdmin, async (ctx) => {
  const input = validateInput(ctx.request.body);
  const now = Timestamp.now();
  const created: PostDoc = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    tags: input.tags,
    status: input.status,
    publishedAt: input.status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
    readingMinutes: readingMinutes(input.content),
    coverImageUrl: input.coverImageUrl,
  };

  const ref = postsCol().doc(input.slug);
  await db.runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists) {
      const err = new Error('Slug already used');
      (err as Error & { status?: number }).status = 409;
      throw err;
    }
    tx.set(ref, created);
  });

  ctx.status = 201;
  ctx.body = toApiFull(created);
});

router.put('/api/admin/posts/:slug', requireAdmin, async (ctx) => {
  const oldSlug = ctx.params.slug;
  const input = validateInput(ctx.request.body);
  const now = Timestamp.now();

  const updated = await db.runTransaction(async (tx) => {
    const oldRef = postsCol().doc(oldSlug);
    const oldSnap = await tx.get(oldRef);
    if (!oldSnap.exists) {
      const err = new Error('Post not found');
      (err as Error & { status?: number }).status = 404;
      throw err;
    }
    const prev = oldSnap.data() as PostDoc;

    // Slug renaming path.
    if (input.slug !== oldSlug) {
      const newRef = postsCol().doc(input.slug);
      const newSnap = await tx.get(newRef);
      if (newSnap.exists) {
        const err = new Error('Slug already used');
        (err as Error & { status?: number }).status = 409;
        throw err;
      }
      const next: PostDoc = {
        ...prev,
        ...input,
        publishedAt:
          prev.status !== 'published' && input.status === 'published'
            ? now
            : prev.publishedAt,
        updatedAt: now,
        readingMinutes: readingMinutes(input.content),
      };
      tx.set(newRef, next);
      tx.delete(oldRef);
      return next;
    }

    // Same slug — just update.
    const next: PostDoc = {
      ...prev,
      ...input,
      publishedAt:
        prev.status !== 'published' && input.status === 'published' ? now : prev.publishedAt,
      updatedAt: now,
      readingMinutes: readingMinutes(input.content),
    };
    tx.set(oldRef, next);
    return next;
  });

  ctx.body = toApiFull(updated);
});

router.delete('/api/admin/posts/:slug', requireAdmin, async (ctx) => {
  const ref = postsCol().doc(ctx.params.slug);
  await ref.delete();
  ctx.body = { ok: true };
});

export default router;