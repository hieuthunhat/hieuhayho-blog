import type { ContactPayload, Post, PostSummary, ApiError } from '@/lib/types';
import { seedPosts } from '@/content/seed-posts';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const toSummary = (post: Post): PostSummary => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  publishedAt: post.publishedAt,
  readingMinutes: post.readingMinutes,
  tags: post.tags,
});

export const mockApi = {
  posts: {
    async list(): Promise<PostSummary[]> {
      await delay();
      return [...seedPosts]
        .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
        .map(toSummary);
    },

    async get(slug: string): Promise<Post | null> {
      await delay();
      const found = seedPosts.find((p) => p.slug === slug);
      return found ?? null;
    },
  },

  contact: {
    async send(payload: ContactPayload): Promise<{ ok: true }> {
      await delay();
      if (!payload.email.trim()) {
        const err: ApiError = { message: 'Email is required', status: 400 };
        throw err;
      }
      if (payload.message.trim().length < 10) {
        const err: ApiError = { message: 'Message must be at least 10 characters', status: 400 };
        throw err;
      }
      return { ok: true };
    },
  },
};
