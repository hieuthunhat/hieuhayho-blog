import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostMeta } from '@/components/blog/post-meta';
import type { PostSummary } from '@/lib/types';

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link to={`/blogs/${post.slug}`} className="block">
      <Card className="cursor-pointer transition-colors hover:border-blue-300">
        <CardContent className="p-5">
          <h3 className="mb-1 text-base font-medium text-blue-950">{post.title}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <PostMeta post={post} />
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Badge key={t} variant="outline" className="text-xs font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
