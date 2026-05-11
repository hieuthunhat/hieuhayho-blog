import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { getTestApp } from './helpers/test-app.js';
import { contactCol } from '../lib/firestore.js';

const goodCreds = { email: 'admin@test.local', password: 'hunter2' };

describe('POST /api/contact', () => {
  it('writes to Firestore and returns ok', async () => {
    const res = await request(getTestApp()).post('/api/contact').send({
      name: 'Hieu',
      email: 'hi@hieu.dev',
      message: 'this message is at least ten characters long',
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    const snap = await contactCol().get();
    expect(snap.size).toBe(1);
    const d = snap.docs[0].data();
    expect(d.name).toBe('Hieu');
    expect(d.email).toBe('hi@hieu.dev');
  });

  it('rejects empty email with 400', async () => {
    const res = await request(getTestApp())
      .post('/api/contact')
      .send({ name: 'x', email: '', message: 'long enough message here' });
    expect(res.status).toBe(400);
  });

  it('rejects messages shorter than 10 chars with 400', async () => {
    const res = await request(getTestApp())
      .post('/api/contact')
      .send({ name: 'x', email: 'x@x.com', message: 'short' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/admin/contact-submissions', () => {
  it('rejects without admin cookie', async () => {
    const res = await request(getTestApp()).get('/api/admin/contact-submissions');
    expect(res.status).toBe(401);
  });

  it('returns submissions newest first when authenticated', async () => {
    await contactCol().add({
      name: 'a',
      email: 'a@a.com',
      message: 'msg',
      createdAt: new Date(),
      ip: null,
    });
    const a = request.agent(getTestApp());
    await a.post('/api/auth/login').send(goodCreds);
    const res = await a.get('/api/admin/contact-submissions');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('a');
  });
});
