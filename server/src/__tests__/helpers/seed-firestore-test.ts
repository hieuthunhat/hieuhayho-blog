import { Timestamp } from 'firebase-admin/firestore';
import { postsCol } from '../../lib/firestore.js';
import type { PostDoc, PostStatus } from '../../types.js';

type Override = Partial<PostDoc> & { slug: string };

export async function seedPost(o: Override): Promise<PostDoc> {
  const now = Timestamp.now();
  const status: PostStatus = o.status ?? 'published';
  const doc: PostDoc = {
    slug: o.slug,
    title: o.title ?? 'Title ' + o.slug,
    excerpt: o.excerpt ?? 'Excerpt ' + o.slug,
    content: o.content ?? `# ${o.slug}\n\nbody`,
    tags: o.tags ?? ['tag-a'],
    status,
    publishedAt: o.publishedAt ?? (status === 'published' ? now : null),
    createdAt: o.createdAt ?? now,
    updatedAt: o.updatedAt ?? now,
    readingMinutes: o.readingMinutes ?? 1,
    coverImageUrl: o.coverImageUrl ?? null,
  };
  await postsCol().doc(o.slug).set(doc);
  return doc;
}