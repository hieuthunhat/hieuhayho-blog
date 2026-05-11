import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { getTestApp } from './helpers/test-app.js';
import { COOKIE_NAME } from '../lib/jwt.js';

const goodCreds = { email: 'admin@test.local', password: 'hunter2' };

describe('POST /api/auth/login', () => {
  it('returns 200 + sets cookie on valid creds', async () => {
    const res = await request(getTestApp()).post('/api/auth/login').send(goodCreds);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    const setCookie = res.headers['set-cookie']?.[0] ?? '';
    expect(setCookie).toMatch(new RegExp(`^${COOKIE_NAME}=`));
    expect(setCookie.toLowerCase()).toContain('httponly');
    expect(setCookie.toLowerCase()).toContain('samesite=strict');
  });

  it('returns 401 on bad email', async () => {
    const res = await request(getTestApp())
      .post('/api/auth/login')
      .send({ email: 'wrong@x.com', password: 'hunter2' });
    expect(res.status).toBe(401);
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('returns 401 on bad password', async () => {
    const res = await request(getTestApp())
      .post('/api/auth/login')
      .send({ ...goodCreds, password: 'nope' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 without cookie', async () => {
    const res = await request(getTestApp()).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns { admin: true } with valid cookie', async () => {
    const agent = request.agent(getTestApp());
    await agent.post('/api/auth/login').send(goodCreds);
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ admin: true });
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the cookie', async () => {
    const agent = request.agent(getTestApp());
    await agent.post('/api/auth/login').send(goodCreds);
    const res = await agent.post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    const setCookie = res.headers['set-cookie']?.[0] ?? '';
    expect(setCookie.toLowerCase()).toContain('expires=');
  });
});