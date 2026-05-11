import type {
  ContactPayload,
  Post,
  PostInput,
  PostSummary,
  UploadResponse,
} from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

const BASE = import.meta.env.VITE_API_BASE?.trim();

const usingMock = !BASE;

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
  // 204-like responses
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const realApi = {
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

// While the mock is still in-tree, fall back for the public surface only.
// Auth + admin on the mock are stubs that always reject — log in via the real backend.
type AuthApi = typeof realApi.auth;
type AdminApi = typeof realApi.admin;

const mockAuth: AuthApi = {
  login: async () => {
    throw { message: 'Mock backend has no auth', status: 501 };
  },
  me: async () => ({ admin: false }),
  logout: async () => ({ ok: true as const }),
};

const mockAdmin: AdminApi = {
  posts: {
    list: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
    get: async () => null,
    create: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
    update: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
    delete: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
  },
  uploads: {
    create: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
  },
};

export const api = usingMock
  ? { ...mockApi, auth: mockAuth, admin: mockAdmin }
  : realApi;
