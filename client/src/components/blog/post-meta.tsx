import type { PostSummary } from '@/lib/types';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export function PostMeta({ post }: { post: Pick<PostSummary, 'publishedAt' | 'readingMinutes'> }) {
  return (
    <p className="text-xs text-muted-foreground">
      {fmtDate(post.publishedAt)} · {post.readingMinutes} min read
    </p>
  );
}
