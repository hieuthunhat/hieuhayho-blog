import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DashboardTable from '@/components/admin/dashboard-table';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-provider';
import type { Post } from '@/lib/types';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await api.admin.posts.list());
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (slug: string) => {
    if (!window.confirm(`Delete "${slug}"? This is permanent.`)) return;
    try {
      await api.admin.posts.delete(slug);
      toast.success('Post deleted');
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Delete failed');
    }
  };

  const onLogout = async () => {
    await logout();
    nav('/admin/login', { replace: true });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-blue-950">posts</h1>
          <p className="text-sm text-muted-foreground">drafts and published, newest update first</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <Link to="/admin/posts/new">new post</Link>
          </Button>
          <Button variant="outline" onClick={onLogout}>logout</Button>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">loading…</p>
      ) : (
        <DashboardTable posts={posts} onDelete={onDelete} />
      )}
    </div>
  );
}
