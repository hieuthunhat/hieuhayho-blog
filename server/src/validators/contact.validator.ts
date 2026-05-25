import { httpError } from '../lib/http-error.js';
import type { ContactPayload } from '../types.js';

export function parseContactPayload(body: unknown): ContactPayload {
  const b = (body ?? {}) as Partial<ContactPayload>;
  const name = b.name?.trim() ?? '';
  const email = b.email?.trim() ?? '';
  const message = b.message?.trim() ?? '';

  if (!name || !email || message.length < 10) {
    throw httpError(400, 'Name, email, and a message of 10+ chars are required');
  }
  return { name, email, message };
}
