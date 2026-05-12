import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from '@/components/admin/login-form';
import { useAuth } from '@/lib/auth-provider';

export default function AdminLogin() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAdmin) nav('/admin', { replace: true });
  }, [loading, isAdmin, nav]);

  const onSuccess = () => {
    const from = params.get('from');
    nav(from ? decodeURIComponent(from) : '/admin', { replace: true });
  };

  return <LoginForm onSuccess={onSuccess} />;
}
