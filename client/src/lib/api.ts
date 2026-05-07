import type { ContactPayload, Post, PostSummary } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

const BASE = import.meta.env.VITE_API_BASE?.trim();

const usingMock = !BASE;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw { message: body.message ?? 'Request failed', status: res.status };
  }
  return res.json() as Promise<T>;
}

export const api = usingMock
  ? mockApi
  : {
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
    };
