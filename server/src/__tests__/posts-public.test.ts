import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { Timestamp } from 'firebase-admin/firestore';
import { getTestApp } from './helpers/test-app.js';
import { seedPost } from './helpers/seed-firestore-test.js';

describe('GET /api/posts', () => {
  it('returns only published posts, newest first, without content field', async () => {
    await seedPost({ slug: 'older', publishedAt: Timestamp.fromDate(new Date('2026-01-01')) });
    await seedPost({ slug: 'newer', publishedAt: Timestamp.fromDate(new Date('2026-04-01')) });
    await seedPost({ slug: 'a-draft', status: 'draft' });

    const res = await request(getTestApp()).get('/api/posts');
    expect(res.status).toBe(200);
    const slugs = res.body.map((p: { slug: string }) => p.slug);
    expect(slugs).toEqual(['newer', 'older']);
    res.body.forEach((p: object) => {
      expect(p).not.toHaveProperty('content');
      expect(p).toHaveProperty('publishedAt');
    });
  });

  it('returns [] when no published posts', async () => {
    await seedPost({ slug: 'only-draft', status: 'draft' });
    const res = await request(getTestApp()).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/posts/:slug', () => {
  it('returns the published post including content', async () => {
    await seedPost({ slug: 'hello', content: '# hi', title: 'Hello' });
    const res = await request(getTestApp()).get('/api/posts/hello');
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('hello');
    expect(res.body.content).toBe('# hi');
    expect(res.body.title).toBe('Hello');
  });

  it('returns 404 for an unknown slug', async () => {
    const res = await request(getTestApp()).get('/api/posts/missing');
    expect(res.status).toBe(404);
  });

  it('returns 404 for a draft', async () => {
    await seedPost({ slug: 'a-draft', status: 'draft' });
    const res = await request(getTestApp()).get('/api/posts/a-draft');
    expect(res.status).toBe(404);
  });
});