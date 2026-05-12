import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Post } from '@/lib/types';

type Props = {
  posts: Post[];
  onDelete: (slug: string) => void;
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export default function DashboardTable({ posts, onDelete }: Props) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No posts yet — create your first one.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {posts.map((p) => (
            <li key={p.slug} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-blue-950">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  /{p.slug} · updated {fmt(p.updatedAt)}
                </p>
              </div>
              <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>
                {p.status}
              </Badge>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/posts/${p.slug}/edit`}>edit</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(p.slug)}>
                  delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
