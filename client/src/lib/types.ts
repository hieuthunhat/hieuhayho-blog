export type PostStatus = 'draft' | 'published';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string | null;
  readingMinutes: number;
  tags: string[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  coverImageUrl: string | null;
};

export type PostSummary = Omit<Post, 'content'>;

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  coverImageUrl: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ApiError = {
  message: string;
  status: number;
};

export type UploadResponse = {
  url: string;
  publicId: string;
};

export type Project = {
  name: string;
  type: string;
  year: string;
  bg: string;
  accent: string;
  shape: 'square' | 'circle' | 'parallelogram';
  tags: string[];
};
