import Router from '@koa/router';
import { Timestamp } from 'firebase-admin/firestore';
import { postsCol } from '../lib/firestore.js';
import type { PostDoc, PostSummary } from '../types.js';

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

export default router;