import type { Timestamp } from 'firebase-admin/firestore';

export type PostStatus = 'draft' | 'published';

export type PostDoc = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readingMinutes: number;
  coverImageUrl: string | null;
};

export type PostSummary = Omit<PostDoc, 'content'>;

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  coverImageUrl: string | null;
};

export type ContactDoc = {
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  ip: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type JwtPayload = {
  sub: 'admin';
  iat: number;
  exp: number;
};
