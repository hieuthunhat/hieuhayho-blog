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

  // Production path — service account JSON in env.
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is required when not using the emulator');
  }
  const credentials = JSON.parse(raw);
  initializeApp({ credential: cert(credentials) });
}

init();

export const db = getFirestore();
export const postsCol = () => db.collection('posts');
export const contactCol = () => db.collection('contact_submissions');
