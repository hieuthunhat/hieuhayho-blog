import { mockApi } from '@/lib/mock-api';

describe('mockApi.posts.list', () => {
  it('returns post summaries without the full content field', async () => {
    const posts = await mockApi.posts.list();
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((p) => {
      expect(p).toHaveProperty('slug');
      expect(p).toHaveProperty('title');
      expect(p).toHaveProperty('excerpt');
      expect(p).not.toHaveProperty('content');
    });
  });

  it('returns posts in reverse chronological order (newest first)', async () => {
    const posts = await mockApi.posts.list();
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].publishedAt >= posts[i + 1].publishedAt).toBe(true);
    }
  });
});

describe('mockApi.posts.get', () => {
  it('returns the post matching the slug, with full content', async () => {
    const post = await mockApi.posts.get('calm-interfaces');
    expect(post).not.toBeNull();
    expect(post?.slug).toBe('calm-interfaces');
    expect(post?.content).toContain('calm interfaces');
  });

  it('returns null for an unknown slug', async () => {
    const post = await mockApi.posts.get('does-not-exist');
    expect(post).toBeNull();
  });
});

describe('mockApi.contact.send', () => {
  it('resolves { ok: true } for a valid payload', async () => {
    const result = await mockApi.contact.send({
      name: 'Hieu',
      email: 'hi@hieu.dev',
      message: 'hello world from a unit test',
    });
    expect(result).toEqual({ ok: true });
  });

  it('rejects with ApiError when email is empty', async () => {
    await expect(
      mockApi.contact.send({ name: 'x', email: '', message: 'long enough message' })
    ).rejects.toMatchObject({ status: 400 });
  });

  it('rejects with ApiError when message is shorter than 10 chars', async () => {
    await expect(
      mockApi.contact.send({ name: 'x', email: 'x@x.com', message: 'short' })
    ).rejects.toMatchObject({ status: 400 });
  });
});
