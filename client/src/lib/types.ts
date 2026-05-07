export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
};

export type PostSummary = Omit<Post, 'content'>;

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ApiError = {
  message: string;
  status: number;
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
