import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './helpers/test-app.js';
import * as cloudinaryLib from '../lib/cloudinary.js';

const goodCreds = { email: 'admin@test.local', password: 'hunter2' };

async function adminAgent() {
  const a = request.agent(getTestApp());
  await a.post('/api/auth/login').send(goodCreds);
  return a;
}

let uploadSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  uploadSpy = vi.spyOn(cloudinaryLib, 'uploadBuffer').mockResolvedValue({
    url: 'https://res.cloudinary.com/test/image/upload/abc.jpg',
    publicId: 'test/abc',
  });
});

afterEach(() => {
  uploadSpy.mockRestore();
});

describe('POST /api/admin/uploads', () => {
  it('rejects without admin cookie', async () => {
    const res = await request(getTestApp())
      .post('/api/admin/uploads')
      .attach('file', Buffer.from([0xff, 0xd8, 0xff]), { filename: 'x.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(401);
  });

  it('returns { url, publicId } on a valid jpeg upload', async () => {
    const a = await adminAgent();
    const res = await a
      .post('/api/admin/uploads')
      .attach('file', Buffer.from([0xff, 0xd8, 0xff]), { filename: 'x.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      url: 'https://res.cloudinary.com/test/image/upload/abc.jpg',
      publicId: 'test/abc',
    });
  });

  it('rejects bad MIME with 400', async () => {
    const a = await adminAgent();
    const res = await a
      .post('/api/admin/uploads')
      .attach('file', Buffer.from('hello'), { filename: 'x.txt', contentType: 'text/plain' });
    expect(res.status).toBe(400);
  });

  it('rejects files larger than 5 MB with 400', async () => {
    const a = await adminAgent();
    const big = Buffer.alloc(5 * 1024 * 1024 + 1, 0xff);
    const res = await a
      .post('/api/admin/uploads')
      .attach('file', big, { filename: 'x.jpg', contentType: 'image/jpeg' });
    expect([400, 413]).toContain(res.status);
  });
});
