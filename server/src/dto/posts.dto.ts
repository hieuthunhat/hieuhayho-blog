import { Timestamp } from 'firebase-admin/firestore';
import type { PostDoc } from '../types.js';

export function toIso(ts: Timestamp | null): string | null {
  return ts ? ts.toDate().toISOString() : null;
}

export type ApiPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  status: PostDoc['status'];
  readingMinutes: number;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiPostFull = ApiPostSummary & { content: string };

export function toApiSummary(doc: PostDoc): ApiPostSummary {
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

export function toApiFull(doc: PostDoc): ApiPostFull {
  return { ...toApiSummary(doc), content: doc.content };
}
