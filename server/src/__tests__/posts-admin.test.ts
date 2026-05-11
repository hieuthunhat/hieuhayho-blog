import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { getTestApp } from './helpers/test-app.js';
import { seedPost } from './helpers/seed-firestore-test.js';
import { postsCol } from '../lib/firestore.js';

const goodCreds = { email: 'admin@test.local', password: 'hunter2' };

async function adminAgent() {
  const agent = request.agent(getTestApp());
  await agent.post('/api/auth/login').send(goodCreds);
  return agent;
}

const baseInput = {
  title: 'Hello world',
  slug: 'hello-world',
  excerpt: 'a first post',
  content: '# hi\n\nbody',
  tags: ['intro'],
  status: 'draft' as const,
  coverImageUrl: null,
};

describe('admin posts — auth', () => {
  it('rejects unauthenticated GET /api/admin/posts', async () => {
    const res = await request(getTestApp()).get('/api/admin/posts');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/posts', () => {
  it('returns drafts and published, newest updated first', async () => {
    await seedPost({ slug: 'p1', status: 'published' });
    await seedPost({ slug: 'd1', status: 'draft' });
    const a = await adminAgent();
    const res = await a.get('/api/admin/posts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});

describe('POST /api/admin/posts', () => {
  it('creates a new post with computed readingMinutes', async () => {
    const a = await adminAgent();
    const res = await a.post('/api/admin/posts').send(baseInput);
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('hello-world');
    expect(res.body.readingMinutes).toBe(1);
    expect(res.body.publishedAt).toBeNull();
  });

  it('rejects with 409 on slug conflict', async () => {
    await seedPost({ slug: 'taken' });
    const a = await adminAgent();
    const res = await a.post('/api/admin/posts').send({ ...baseInput, slug: 'taken' });
    expect(res.status).toBe(409);
  });

  it('sets publishedAt when status is published on create', async () => {
    const a = await adminAgent();
    const res = await a
      .post('/api/admin/posts')
      .send({ ...baseInput, slug: 'p-now', status: 'published' });
    expect(res.status).toBe(201);
    expect(typeof res.body.publishedAt).toBe('string');
  });
});

describe('PUT /api/admin/posts/:slug', () => {
  it('updates an existing post and bumps updatedAt', async () => {
    await seedPost({ slug: 'edit-me', title: 'Old' });
    const a = await adminAgent();
    const res = await a
      .put('/api/admin/posts/edit-me')
      .send({ ...baseInput, slug: 'edit-me', title: 'New' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New');
  });

  it('sets publishedAt only on first draft → published transition', async () => {
    await seedPost({ slug: 'transition', status: 'draft', publishedAt: null });
    const a = await adminAgent();
    const first = await a
      .put('/api/admin/posts/transition')
      .send({ ...baseInput, slug: 'transition', status: 'published' });
    expect(first.body.publishedAt).not.toBeNull();
    const firstAt = first.body.publishedAt;

    // Edit while still published — publishedAt must NOT change.
    const second = await a
      .put('/api/admin/posts/transition')
      .send({ ...baseInput, slug: 'transition', status: 'published', title: 'Edited' });
    expect(second.body.publishedAt).toBe(firstAt);
  });

  it('renames slug atomically (creates new doc, deletes old)', async () => {
    await seedPost({ slug: 'old' });
    const a = await adminAgent();
    const res = await a.put('/api/admin/posts/old').send({ ...baseInput, slug: 'new' });
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('new');
    const oldSnap = await postsCol().doc('old').get();
    const newSnap = await postsCol().doc('new').get();
    expect(oldSnap.exists).toBe(false);
    expect(newSnap.exists).toBe(true);
  });

  it('returns 409 when renaming into a taken slug', async () => {
    await seedPost({ slug: 'a' });
    await seedPost({ slug: 'b' });
    const a = await adminAgent();
    const res = await a.put('/api/admin/posts/a').send({ ...baseInput, slug: 'b' });
    expect(res.status).toBe(409);
  });

  it('returns 404 for an unknown slug', async () => {
    const a = await adminAgent();
    const res = await a.put('/api/admin/posts/nope').send({ ...baseInput, slug: 'nope' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/admin/posts/:slug', () => {
  it('deletes the post', async () => {
    await seedPost({ slug: 'gone' });
    const a = await adminAgent();
    const res = await a.delete('/api/admin/posts/gone');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    const snap = await postsCol().doc('gone').get();
    expect(snap.exists).toBe(false);
  });
});