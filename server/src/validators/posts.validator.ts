import { httpError } from '../lib/http-error.js';
import type { PostInput, PostStatus } from '../types.js';

export function parsePostInput(body: unknown): PostInput {
  const b = (body ?? {}) as Partial<PostInput>;
  const required = ['title', 'slug', 'excerpt', 'content', 'tags', 'status'] as const;
  for (const k of required) {
    if (b[k] === undefined || b[k] === null) {
      throw httpError(400, `Missing field: ${k}`);
    }
  }
  if (b.status !== 'draft' && b.status !== 'published') {
    throw httpError(400, 'status must be "draft" or "published"');
  }
  if (!Array.isArray(b.tags)) {
    throw httpError(400, 'tags must be an array');
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
