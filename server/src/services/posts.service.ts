import { Timestamp } from 'firebase-admin/firestore';
import { PostsRepository } from '../repositories/posts.repository.js';
import { readingMinutes } from '../lib/reading-time.js';
import { httpError } from '../lib/http-error.js';
import type { PostDoc, PostInput } from '../types.js';

export const PostsService = {
  listPublished: () => PostsRepository.findPublished(),

  listAll: () => PostsRepository.findAll(),

  async getPublishedBySlug(slug: string): Promise<PostDoc> {
    const doc = await PostsRepository.findBySlug(slug);
    if (!doc || doc.status !== 'published') {
      throw httpError(404, 'Post not found');
    }
    return doc;
  },

  async getBySlug(slug: string): Promise<PostDoc> {
    const doc = await PostsRepository.findBySlug(slug);
    if (!doc) {
      throw httpError(404, 'Post not found');
    }
    return doc;
  },

  async create(input: PostInput): Promise<PostDoc> {
    const now = Timestamp.now();
    const doc: PostDoc = {
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
    await PostsRepository.createUnique(doc);
    return doc;
  },

  async update(oldSlug: string, input: PostInput): Promise<PostDoc> {
    const now = Timestamp.now();
    return PostsRepository.updateInTransaction(oldSlug, (prev) => {
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
      return { next, newSlug: input.slug };
    });
  },

  remove: (slug: string) => PostsRepository.deleteBySlug(slug),
};
