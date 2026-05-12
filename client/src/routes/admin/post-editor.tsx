import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import PostEditor from '@/components/admin/post-editor';
import { api } from '@/lib/api';
import type { Post } from '@/lib/types';

type Props = { mode: 'new' | 'edit' };

export default function AdminPostEditor({ mode }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [loaded, setLoaded] = useState<Post | null>(null);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode !== 'edit' || !slug) return;
    let cancel = false;
    (async () => {
      try {
        const p = await api.admin.posts.get(slug);
        if (cancel) return;
        if (!p) {
          toast.error('Post not found');
          return;
        }
        setLoaded(p);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [mode, slug]);

  if (mode === 'new') return <PostEditor mode="new" />;
  if (loading) return <p className="text-sm text-muted-foreground">loading…</p>;
  if (!loaded) return <p className="text-sm text-muted-foreground">Post not found.</p>;
  return <PostEditor mode="edit" initial={loaded} />;
}
