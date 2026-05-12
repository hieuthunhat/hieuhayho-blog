import { describe, expect, it } from 'vitest';
import { signAdminToken, verifyAdminToken } from '../lib/jwt.js';

describe('jwt', () => {
  it('signs and verifies a valid admin token', () => {
    const token = signAdminToken();
    const payload = verifyAdminToken(token);
    expect(payload.sub).toBe('admin');
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('throws on a tampered token', () => {
    const token = signAdminToken();
    const tampered = token.slice(0, -2) + 'aa';
    expect(() => verifyAdminToken(tampered)).toThrow();
  });

  it('throws on an unrelated string', () => {
    expect(() => verifyAdminToken('not-a-jwt')).toThrow();
  });
});