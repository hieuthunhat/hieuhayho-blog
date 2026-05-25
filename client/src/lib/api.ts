import type {
  ContactPayload,
  Post,
  PostInput,
  PostSummary,
  UploadResponse,
} from '@/lib/types';

const BASE = import.meta.env.VITE_API_BASE?.trim() ?? '';

if (!BASE && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE is not set; API calls will go to same origin.');
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.body && !(init.body instanceof FormData)
      ? { 'content-type': 'application/json' }
      : {}),
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw { message: body.message ?? 'Request failed', status: res.status };
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  posts: {
    list: () => http<PostSummary[]>('/api/posts'),
    get: async (slug: string): Promise<Post | null> => {
      try {
        return await http<Post>(`/api/posts/${encodeURIComponent(slug)}`);
      } catch (e) {
        if ((e as { status?: number }).status === 404) return null;
        throw e;
      }
    },
  },
  contact: {
    send: (payload: ContactPayload) =>
      http<{ ok: true }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  auth: {
    login: (email: string, password: string) =>
      http<{ ok: true }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: async (): Promise<{ admin: boolean }> => {
      try {
        return await http<{ admin: boolean }>('/api/auth/me');
      } catch (e) {
        if ((e as { status?: number }).status === 401) return { admin: false };
        throw e;
      }
    },
    logout: () => http<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  },
  admin: {
    posts: {
      list: () => http<Post[]>('/api/admin/posts'),
      get: async (slug: string): Promise<Post | null> => {
        try {
          return await http<Post>(`/api/admin/posts/${encodeURIComponent(slug)}`);
        } catch (e) {
          if ((e as { status?: number }).status === 404) return null;
          throw e;
        }
      },
      create: (input: PostInput) =>
        http<Post>('/api/admin/posts', {
          method: 'POST',
          body: JSON.stringify(input),
        }),
      update: (slug: string, input: PostInput) =>
        http<Post>(`/api/admin/posts/${encodeURIComponent(slug)}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        }),
      delete: (slug: string) =>
        http<{ ok: true }>(`/api/admin/posts/${encodeURIComponent(slug)}`, {
          method: 'DELETE',
        }),
    },
    uploads: {
      create: (file: File): Promise<UploadResponse> => {
        const fd = new FormData();
        fd.append('file', file);
        return http<UploadResponse>('/api/admin/uploads', {
          method: 'POST',
          body: fd,
        });
      },
    },
  },
};
