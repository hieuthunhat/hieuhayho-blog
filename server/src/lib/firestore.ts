import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function init() {
  if (getApps().length) return;

  // Emulator path — service account not needed.
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({
      projectId: process.env.GOOGLE_CLOUD_PROJECT ?? 'hieublog-local',
    });
    return;
  }

  // Production path — file first, then JSON-in-env fallback.
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  if (filePath) {
    const absolute = resolve(filePath);
    const credentials = JSON.parse(readFileSync(absolute, 'utf8'));
    initializeApp({ credential: cert(credentials) });
    return;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    initializeApp({ credential: cert(JSON.parse(raw)) });
    return;
  }

  throw new Error(
    'Set FIREBASE_SERVICE_ACCOUNT_FILE (path to JSON) or FIREBASE_SERVICE_ACCOUNT_JSON (inline JSON), or FIRESTORE_EMULATOR_HOST for emulator.'
  );
}

init();

export const db = getFirestore();
export const postsCol = () => db.collection('posts');
export const contactCol = () => db.collection('contact_submissions');
