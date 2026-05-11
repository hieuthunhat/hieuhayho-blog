import type { ContactPayload, Post, PostSummary, ApiError, PostStatus } from '@/lib/types';
import { seedPosts } from '@/content/seed-posts';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function fillDefaults(p: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
}): Post {
  return {
    ...p,
    publishedAt: p.publishedAt,
    status: 'published' as PostStatus,
    createdAt: p.publishedAt,
    updatedAt: p.publishedAt,
    coverImageUrl: null,
  };
}

const toSummary = (post: Post): PostSummary => {
  const { content: _content, ...rest } = post;
  return rest;
};

export const mockApi = {
  posts: {
    async list(): Promise<PostSummary[]> {
      await delay();
      return [...seedPosts]
        .map(fillDefaults)
        .sort((a, b) => ((a.publishedAt ?? '') < (b.publishedAt ?? '') ? 1 : -1))
        .map(toSummary);
    },
    async get(slug: string): Promise<Post | null> {
      await delay();
      const found = seedPosts.find((p) => p.slug === slug);
      return found ? fillDefaults(found) : null;
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
