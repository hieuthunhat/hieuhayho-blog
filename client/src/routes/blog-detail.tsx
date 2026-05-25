import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import type { ApiError, Post } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { PostMeta } from '@/components/blog/post-meta';

type State =
  | { status: 'loading' }
  | { status: 'ok'; post: Post }
  | { status: 'not-found' }
  | { status: 'error'; message: string };

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!slug) {
      setState({ status: 'not-found' });
      return;
    }
    setState({ status: 'loading' });
    api.posts
      .get(slug)
      .then((post) =>
        post ? setState({ status: 'ok', post }) : setState({ status: 'not-found' })
      )
      .catch((e: ApiError) =>
        setState({ status: 'error', message: e.message ?? 'Failed to load post' })
      );
  }, [slug]);

  return (
    <article>
      <Button asChild variant="ghost" size="sm" className="mb-4 text-blue-700">
        <Link to="/blogs">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          back to writing
        </Link>
      </Button>

      <Card>
        <CardContent className="p-8">
          {state.status === 'loading' && (
            <div>
              <Skeleton className="mb-4 h-8 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/3" />
              <Separator className="my-6" />
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="mb-2 h-4 w-full" />
              ))}
            </div>
          )}

          {state.status === 'not-found' && (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">Post not found.</p>
              <Button asChild variant="outline">
                <Link to="/blogs">back to writing</Link>
              </Button>
            </div>
          )}

          {state.status === 'error' && (
            <p className="text-sm text-muted-foreground">{state.message}</p>
          )}

          {state.status === 'ok' && (
            <>
              {state.post.coverImageUrl && (
                <img
                  src={state.post.coverImageUrl}
                  alt=""
                  loading="lazy"
                  className="mb-6 -mt-2 h-64 w-full rounded-md object-cover"
                />
              )}
              <h1 className="text-3xl font-medium text-blue-950">{state.post.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <PostMeta post={state.post} />
                <div className="flex flex-wrap gap-1.5">
                  {state.post.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-6" />
              <div className="prose prose-sm prose-blue mx-auto max-w-3xl prose-headings:text-blue-950 prose-a:text-blue-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.post.content}
                </ReactMarkdown>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
