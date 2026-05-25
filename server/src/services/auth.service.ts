import { httpError } from '../lib/http-error.js';
import { signAdminToken, verifyAdminToken } from '../lib/jwt.js';

export const AuthService = {
  login(email: string, password: string): string {
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      throw httpError(401, 'Invalid credentials');
    }
    return signAdminToken();
  },

  verify(token: string | undefined): void {
    if (!token) {
      throw httpError(401, 'Not authenticated');
    }
    try {
      verifyAdminToken(token);
    } catch {
      throw httpError(401, 'Invalid or expired token');
    }
  },
};
