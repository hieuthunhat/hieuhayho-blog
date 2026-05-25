import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { ApiError, PostSummary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/blog/post-card';

type State =
  | { status: 'loading' }
  | { status: 'ok'; posts: PostSummary[] }
  | { status: 'error'; message: string };

export default function Blogs() {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = () => {
    setState({ status: 'loading' });
    api.posts
      .list()
      .then((posts) => setState({ status: 'ok', posts }))
      .catch((e: ApiError) =>
        setState({ status: 'error', message: e.message ?? 'Failed to load posts' })
      );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between px-1">
        <h2 className="text-lg font-medium text-blue-950">writing</h2>
        <span className="text-xs text-muted-foreground">2026</span>
      </div>

      {state.status === 'loading' && (
        <div data-testid="blogs-loading" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="mb-2 h-5 w-2/3" />
                <Skeleton className="mb-4 h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {state.status === 'error' && (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 p-5">
            <p className="text-sm text-muted-foreground">{state.message}</p>
            <Button variant="outline" onClick={load}>
              retry
            </Button>
          </CardContent>
        </Card>
      )}

      {state.status === 'ok' && state.posts.length === 0 && (
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              No posts yet — check back soon.
            </p>
          </CardContent>
        </Card>
      )}

      {state.status === 'ok' && state.posts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {state.posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
