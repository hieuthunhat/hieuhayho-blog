import { beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.JWT_SECRET = 'test-secret-do-not-use-in-prod-aaaaaaaaaaaaaaaaaaaaaaaa';
process.env.ADMIN_EMAIL = 'admin@test.local';
process.env.ADMIN_PASSWORD = 'hunter2';
process.env.COOKIE_SECURE = 'false';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.GOOGLE_CLOUD_PROJECT = 'hieublog-local';
process.env.CLOUDINARY_CLOUD_NAME = 'test';
process.env.CLOUDINARY_API_KEY = 'test';
process.env.CLOUDINARY_API_SECRET = 'test';
process.env.CLOUDINARY_FOLDER = 'test';

beforeAll(async () => {
  // Sanity probe — fail fast if the emulator isn't running.
  const res = await fetch(`http://${process.env.FIRESTORE_EMULATOR_HOST}`).catch(
    () => null
  );
  if (!res) {
    throw new Error(
      'Firestore emulator not reachable at ' +
        process.env.FIRESTORE_EMULATOR_HOST +
        '. Run `firebase emulators:start --only firestore` first.'
    );
  }
});

beforeEach(async () => {
  const url = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT}/databases/(default)/documents`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Firestore reset failed: ${res.status} ${res.statusText}`);
  }
});
