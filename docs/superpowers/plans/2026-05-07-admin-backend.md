# Admin + Backend Phase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Koa + Firestore + Cloudinary backend and the React admin UI per the approved spec at `docs/superpowers/specs/2026-05-07-admin-backend-design.md`.

**Architecture:** New top-level `server/` package (npm workspaces) running Koa. Public + admin endpoints, JWT-cookie auth, Firestore Admin SDK for data, Cloudinary SDK for media. Existing `client/` adds `/admin/*` routes, an `AuthProvider`, and `@uiw/react-md-editor`. Firestore is reached only through Koa — frontend never imports `firebase`.

**Tech Stack:** Koa, @koa/router, @koa/cors, koa-bodyparser, @koa/multer, firebase-admin, cloudinary, jsonwebtoken, slugify, vitest + supertest, tsx; @uiw/react-md-editor on the client.

---

## Progress log

| # | Task | Status | Notes |
|---|---|---|---|
| 1 | npm workspaces + server scaffold | ⏳ next | — |
| 2 | Vitest + supertest + emulator harness | ⏳ pending | — |
| 3 | Firestore lib + server types | ⏳ pending | — |
| 4 | JWT lib (TDD) | ⏳ pending | — |
| 5 | Auth routes + `requireAdmin` (TDD) | ⏳ pending | — |
| 6 | Posts public routes (TDD) | ⏳ pending | — |
| 7 | Posts admin CRUD (TDD) | ⏳ pending | — |
| 8 | Cloudinary uploads (TDD) | ⏳ pending | — |
| 9 | Contact + admin submissions (TDD) | ⏳ pending | — |
| 10 | Firestore seed script | ⏳ pending | — |
| 11 | Root dev runtime + env templates | ⏳ pending | — |
| 12 | Client api.ts: auth + admin namespaces | ⏳ pending | — |
| 13 | `AuthProvider`, `RequireAdmin`, nav update (TDD) | ⏳ pending | — |
| 14 | Admin login page (TDD) | ⏳ pending | — |
| 15 | Admin dashboard (TDD) | ⏳ pending | — |
| 16 | Admin post editor + markdown editor + uploader (TDD) | ⏳ pending | — |
| 17 | Drop mock-api, simplify api.ts | ⏳ pending | — |
| 18 | End-to-end smoke + responsive sweep | ⏳ pending | — |

### Where to resume

- **Worktree:** create via `superpowers:using-git-worktrees` before starting (recommended branch name `worktree-admin-backend`).
- **Base branch:** `master` at `afd941d` (post merge of frontend phase + spec commit).
- **Next action:** Begin Task 1 (server scaffold inside npm workspaces).

---

## File Map

### `server/` (new top-level package)

**Create:**
- `server/package.json`, `server/tsconfig.json`, `server/.env.example`, `server/.gitignore`
- `server/vitest.config.ts`, `server/test-setup.ts`
- `server/src/index.ts` — Koa app entry
- `server/src/app.ts` — exports the Koa app instance (so tests can `supertest(app.callback())` without binding a port)
- `server/src/lib/firestore.ts` — Admin SDK init + `db` export
- `server/src/lib/cloudinary.ts` — SDK init + `uploadBuffer(buffer, mime)` helper
- `server/src/lib/jwt.ts` — `signAdminToken()` + `verifyAdminToken()`
- `server/src/lib/slugify.ts` — re-export of `slugify` with our default options
- `server/src/lib/reading-time.ts` — `readingMinutes(content)`
- `server/src/types.ts` — server-side types (`PostDoc`, `ContactDoc`, `PostInput`, `JwtPayload`, etc.)
- `server/src/middleware/require-admin.ts`
- `server/src/middleware/error-handler.ts`
- `server/src/routes/auth.ts`
- `server/src/routes/posts.ts` (public + admin combined; mounted at `/api/posts` and `/api/admin/posts`)
- `server/src/routes/uploads.ts`
- `server/src/routes/contact.ts`
- `server/src/scripts/seed-firestore.ts`
- `server/src/__tests__/auth.test.ts`
- `server/src/__tests__/posts-public.test.ts`
- `server/src/__tests__/posts-admin.test.ts`
- `server/src/__tests__/uploads.test.ts`
- `server/src/__tests__/contact.test.ts`
- `server/src/__tests__/jwt.test.ts`
- `server/src/__tests__/require-admin.test.ts`
- `server/src/__tests__/helpers/test-app.ts` — builds an isolated app + clears emulator data

### `client/` (existing — additions)

**Modify:**
- `client/src/lib/api.ts` (extend with auth + admin namespaces; later simplified after cleanup)
- `client/src/lib/types.ts` (add `PostInput`, `AdminPost`, `UploadResponse`)
- `client/src/components/layout/nav.tsx` (auth-aware admin link)
- `client/src/App.tsx` (mount `<AuthProvider>`, register `/admin/*` routes)
- `client/package.json` (add `@uiw/react-md-editor`, `slugify`)

**Create:**
- `client/src/lib/auth-provider.tsx` — `<AuthProvider>` + `useAuth()` hook
- `client/src/components/admin/require-admin.tsx`
- `client/src/components/admin/login-form.tsx`
- `client/src/components/admin/dashboard-table.tsx`
- `client/src/components/admin/post-editor.tsx`
- `client/src/components/admin/image-uploader.tsx`
- `client/src/routes/admin/login.tsx`
- `client/src/routes/admin/index.tsx` (dashboard)
- `client/src/routes/admin/post-editor.tsx` (mode="new" or "edit")
- `client/src/lib/__tests__/auth-provider.test.tsx`
- `client/src/components/admin/__tests__/require-admin.test.tsx`
- `client/src/components/admin/__tests__/dashboard-table.test.tsx`
- `client/src/components/admin/__tests__/post-editor.test.tsx`
- `client/src/components/admin/__tests__/image-uploader.test.tsx`

**Delete (Task 17 only):**
- `client/src/lib/mock-api.ts`
- `client/src/lib/__tests__/mock-api.test.ts`
- `client/src/content/seed-posts.ts`

### Repo root

**Modify:**
- `package.json` — convert to npm workspaces; add root scripts.
- `.gitignore` — add `server/.env`, `server/.env.local`.

**Create:**
- `firebase.json`, `.firebaserc` — Firestore emulator config.

---

## Working directory note

Most server commands run from `server/`. Most client commands run from `client/`. The root `package.json` adds workspace-aware scripts so you can run things from the repo root via `npm run dev`, `npm run dev:server`, `npm run dev:client`, `npm run seed`, `npm run test`, `npm run test:server`, `npm run test:client`, `npm run build`. Each task notes which directory its commands run in.

---

## Task 1: npm workspaces + server scaffold

**Files:**
- Modify: `package.json` (root), `.gitignore` (root)
- Create: `server/package.json`, `server/tsconfig.json`, `server/.gitignore`, `server/.env.example`, `server/src/index.ts`, `server/src/app.ts`

**Working dir:** repo root unless noted.

- [ ] **Step 1: Convert root `package.json` to workspaces**

```json
{
  "name": "hieublog",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "test:client": "npm run test:run --workspace=client",
    "test:server": "npm run test:run --workspace=server",
    "build:client": "npm run build --workspace=client",
    "build:server": "npm run build --workspace=server",
    "seed": "npm run seed --workspace=server"
  }
}
```

(Concurrent dev + `concurrently` get added in Task 11 once both halves boot independently.)

- [ ] **Step 2: Update root `.gitignore`**

Append:

```
# server env
server/.env
server/.env.local
server/dist
```

- [ ] **Step 3: Create `server/package.json`**

```json
{
  "name": "server",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:run": "vitest run",
    "seed": "tsx src/scripts/seed-firestore.ts"
  },
  "dependencies": {
    "@koa/cors": "^5.0.0",
    "@koa/multer": "^3.0.2",
    "@koa/router": "^13.1.0",
    "cloudinary": "^2.5.0",
    "dotenv": "^16.4.5",
    "firebase-admin": "^12.7.0",
    "jsonwebtoken": "^9.0.2",
    "koa": "^2.15.3",
    "koa-bodyparser": "^4.4.1",
    "multer": "^1.4.5-lts.1",
    "slugify": "^1.6.6"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.7",
    "@types/koa": "^2.15.0",
    "@types/koa__cors": "^5.0.0",
    "@types/koa__router": "^12.0.4",
    "@types/koa-bodyparser": "^4.3.12",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.0.0",
    "@types/supertest": "^6.0.2",
    "supertest": "^7.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.0",
    "vitest": "^4.0.0"
  }
}
```

- [ ] **Step 4: Create `server/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": false
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `server/.gitignore`**

```
node_modules
dist
.env
.env.local
*.log
```

- [ ] **Step 6: Create `server/.env.example`**

```
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-me-to-a-long-random-string-at-least-64-chars
ADMIN_EMAIL=hi@hieu.dev
ADMIN_PASSWORD=change-me
COOKIE_SECURE=false

# Firestore
FIREBASE_SERVICE_ACCOUNT_JSON=
FIRESTORE_EMULATOR_HOST=localhost:8080

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=hieublog-dev
```

- [ ] **Step 7: Create `server/src/app.ts`**

```ts
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

export function buildApp(): Koa {
  const app = new Koa();
  // Trust the keys for cookie signing in dev (we use unsigned cookies; this is just to silence Koa's warning).
  app.keys = [process.env.JWT_SECRET ?? 'dev-key'];

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(bodyParser());

  const root = new Router();
  root.get('/api/health', (ctx) => {
    ctx.body = { ok: true };
  });

  app.use(root.routes()).use(root.allowedMethods());

  return app;
}
```

- [ ] **Step 8: Create `server/src/index.ts`**

```ts
import 'dotenv/config';
import { buildApp } from './app.js';

const app = buildApp();
const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on http://localhost:${port}`);
});
```

- [ ] **Step 9: Install dependencies**

Run from repo root: `npm install`
Expected: workspaces fan out, both `client/node_modules` and `server/node_modules` populate. No errors.

- [ ] **Step 10: Boot the server and probe it**

In one terminal: `npm run dev:server`
Expected: prints `server listening on http://localhost:4000`.

In another: `curl -s http://localhost:4000/api/health`
Expected: `{"ok":true}`.

Stop the server (Ctrl-C).

- [ ] **Step 11: Build the server**

Run from `server/`: `npm run build`
Expected: completes; produces `server/dist/index.js`.

- [ ] **Step 12: Commit**

```bash
git add package.json .gitignore server/
git commit -m "chore: add npm workspaces and Koa server scaffold"
```

---

## Task 2: Vitest + supertest + Firestore-emulator harness

**Files:**
- Create: `server/vitest.config.ts`, `server/test-setup.ts`, `firebase.json`, `.firebaserc`, `server/src/__tests__/helpers/test-app.ts`
- Modify: `server/package.json` (already has the deps from Task 1; no changes here)

**Working dir:** `server/` for npm commands; repo root for `firebase init`.

- [ ] **Step 1: Install Firebase CLI globally (if missing)**

Run: `which firebase || npm install -g firebase-tools`
Expected: `firebase` is on PATH.

- [ ] **Step 2: Create `firebase.json` at repo root**

```json
{
  "emulators": {
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4400
    }
  }
}
```

- [ ] **Step 3: Create `.firebaserc` at repo root**

```json
{
  "projects": {
    "default": "hieublog-local"
  }
}
```

(Project ID is only used by the emulator. Real prod project goes in `.env` later.)

- [ ] **Step 4: Boot the emulator and verify it listens on :8080**

Run from repo root: `firebase emulators:start --only firestore`
Expected: prints `firestore: ✔  Emulator started at http://localhost:8080`.

In another terminal: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080`
Expected: `200` (or `400` — both confirm the listener is up).

Leave the emulator running for the rest of this task; stop with Ctrl-C when finished.

- [ ] **Step 5: Create `server/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test-setup.ts'],
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
  },
});
```

(Single fork so emulator state isn't trampled by parallel test files.)

- [ ] **Step 6: Create `server/test-setup.ts`**

```ts
import { afterAll, beforeAll, beforeEach } from 'vitest';

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
  // Clear all data between tests via the emulator's reset endpoint.
  await fetch(
    `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT}/databases/(default)/documents`,
    { method: 'DELETE' }
  );
});

afterAll(async () => {
  // Nothing — emulator stays up for the next run.
});
```

- [ ] **Step 7: Create `server/src/__tests__/helpers/test-app.ts`**

```ts
import { buildApp } from '../../app.js';

export function getTestApp() {
  return buildApp().callback();
}
```

(Each test imports `getTestApp()` and passes it to `supertest(...)`. We rebuild per test so middleware state can't leak.)

- [ ] **Step 8: Sanity test**

Create `server/src/__tests__/sanity.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { getTestApp } from './helpers/test-app.js';

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(getTestApp()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
```

- [ ] **Step 9: Run the sanity test**

Run from `server/`: `npm run test:run`
Expected: 1 passing test, no errors.

- [ ] **Step 10: Delete the sanity test**

```bash
rm server/src/__tests__/sanity.test.ts
```

- [ ] **Step 11: Commit**

```bash
git add server/ firebase.json .firebaserc
git commit -m "chore(server): add vitest + supertest harness with firestore emulator"
```

---

## Task 3: Firestore lib + server types

**Files:**
- Create: `server/src/lib/firestore.ts`, `server/src/lib/reading-time.ts`, `server/src/lib/slugify.ts`, `server/src/types.ts`

**Working dir:** `server/`

- [ ] **Step 1: Create `server/src/types.ts`**

```ts
import type { Timestamp } from 'firebase-admin/firestore';

export type PostStatus = 'draft' | 'published';

export type PostDoc = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readingMinutes: number;
  coverImageUrl: string | null;
};

export type PostSummary = Omit<PostDoc, 'content'>;

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  coverImageUrl: string | null;
};

export type ContactDoc = {
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  ip: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type JwtPayload = {
  sub: 'admin';
  iat: number;
  exp: number;
};
```

- [ ] **Step 2: Create `server/src/lib/firestore.ts`**

```ts
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
```

- [ ] **Step 3: Create `server/src/lib/slugify.ts`**

```ts
import slugify from 'slugify';

export function toSlug(input: string): string {
  return slugify(input, { lower: true, strict: true, trim: true });
}
```

- [ ] **Step 4: Create `server/src/lib/reading-time.ts`**

```ts
const WORDS_PER_MINUTE = 220;

export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
```

- [ ] **Step 5: Smoke-check the import graph**

Run from `server/`: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add server/src/lib server/src/types.ts
git commit -m "feat(server): add firestore client, slugify, reading-time helpers"
```

---

## Task 4: JWT lib (TDD)

**Files:**
- Create: `server/src/lib/jwt.ts`, `server/src/__tests__/jwt.test.ts`

**Working dir:** `server/`

- [ ] **Step 1: Write the failing test — `server/src/__tests__/jwt.test.ts`**

```ts
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
```

- [ ] **Step 2: Run the test — verify it fails**

Run: `npm run test:run -- jwt`
Expected: FAIL — `signAdminToken` is not defined.

- [ ] **Step 3: Implement `server/src/lib/jwt.ts`**

```ts
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types.js';

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 chars long');
  }
  return s;
}

export function signAdminToken(): string {
  return jwt.sign({ sub: 'admin' }, getSecret(), {
    algorithm: 'HS256',
    expiresIn: SEVEN_DAYS_SECONDS,
  });
}

export function verifyAdminToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getSecret(), { algorithms: ['HS256'] });
  if (typeof decoded === 'string' || decoded.sub !== 'admin') {
    throw new Error('Invalid token payload');
  }
  return decoded as JwtPayload;
}

export const COOKIE_NAME = 'token';
export const COOKIE_MAX_AGE_MS = SEVEN_DAYS_SECONDS * 1000;
```

- [ ] **Step 4: Run the test — verify it passes**

Run: `npm run test:run -- jwt`
Expected: 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add server/src/lib/jwt.ts server/src/__tests__/jwt.test.ts
git commit -m "feat(server): add JWT sign/verify helpers (TDD)"
```

---

## Task 5: Auth routes + `requireAdmin` middleware (TDD)

**Files:**
- Create: `server/src/middleware/require-admin.ts`, `server/src/middleware/error-handler.ts`, `server/src/routes/auth.ts`, `server/src/__tests__/auth.test.ts`, `server/src/__tests__/require-admin.test.ts`
- Modify: `server/src/app.ts` (mount routes + error handler)

**Working dir:** `server/`

- [ ] **Step 1: Create `server/src/middleware/error-handler.ts`**

```ts
import type { Context, Next } from 'koa';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    const e = err as { status?: number; message?: string };
    ctx.status = e.status ?? 500;
    ctx.body = { message: e.message ?? 'Internal error' };
  }
}
```

- [ ] **Step 2: Write the failing test for `requireAdmin`**

Create `server/src/__tests__/require-admin.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import Koa from 'koa';
import Router from '@koa/router';
import { requireAdmin } from '../middleware/require-admin.js';
import { signAdminToken, COOKIE_NAME } from '../lib/jwt.js';
import { errorHandler } from '../middleware/error-handler.js';

function buildAppWithGuard() {
  const app = new Koa();
  app.keys = [process.env.JWT_SECRET!];
  app.use(errorHandler);
  const r = new Router();
  r.get('/protected', requireAdmin, (ctx) => {
    ctx.body = { ok: true, user: ctx.state.user };
  });
  app.use(r.routes());
  return app.callback();
}

describe('requireAdmin', () => {
  it('rejects with 401 when no cookie', async () => {
    const res = await request(buildAppWithGuard()).get('/protected');
    expect(res.status).toBe(401);
  });

  it('rejects with 401 when cookie is malformed', async () => {
    const res = await request(buildAppWithGuard())
      .get('/protected')
      .set('Cookie', `${COOKIE_NAME}=not-a-jwt`);
    expect(res.status).toBe(401);
  });

  it('passes through with a valid cookie and sets ctx.state.user', async () => {
    const token = signAdminToken();
    const res = await request(buildAppWithGuard())
      .get('/protected')
      .set('Cookie', `${COOKIE_NAME}=${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, user: 'admin' });
  });
});
```

- [ ] **Step 3: Run the test — verify it fails**

Run: `npm run test:run -- require-admin`
Expected: FAIL — `requireAdmin` is not defined.

- [ ] **Step 4: Implement `server/src/middleware/require-admin.ts`**

```ts
import type { Context, Next } from 'koa';
import { COOKIE_NAME, verifyAdminToken } from '../lib/jwt.js';

export async function requireAdmin(ctx: Context, next: Next) {
  const token = ctx.cookies.get(COOKIE_NAME);
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Not authenticated' };
    return;
  }
  try {
    verifyAdminToken(token);
  } catch {
    ctx.status = 401;
    ctx.body = { message: 'Invalid or expired token' };
    return;
  }
  ctx.state.user = 'admin';
  await next();
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `npm run test:run -- require-admin`
Expected: 3 passing tests.

- [ ] **Step 6: Write the failing test for auth routes**

Create `server/src/__tests__/auth.test.ts`:

```ts
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
```

- [ ] **Step 7: Run the test — verify it fails**

Run: `npm run test:run -- auth`
Expected: FAIL — `/api/auth/login` returns 404.

- [ ] **Step 8: Implement `server/src/routes/auth.ts`**

```ts
import Router from '@koa/router';
import { COOKIE_MAX_AGE_MS, COOKIE_NAME, signAdminToken, verifyAdminToken } from '../lib/jwt.js';

const router = new Router({ prefix: '/api/auth' });

function setAuthCookie(ctx: import('koa').Context, token: string) {
  ctx.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
    overwrite: true,
  });
}

function clearAuthCookie(ctx: import('koa').Context) {
  ctx.cookies.set(COOKIE_NAME, null, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    path: '/',
    overwrite: true,
  });
}

router.post('/login', (ctx) => {
  const body = ctx.request.body as { email?: string; password?: string };
  const email = body?.email?.trim();
  const password = body?.password ?? '';

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Email and password are required' };
    return;
  }

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid credentials' };
    return;
  }

  setAuthCookie(ctx, signAdminToken());
  ctx.body = { ok: true };
});

router.get('/me', (ctx) => {
  const token = ctx.cookies.get(COOKIE_NAME);
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Not authenticated' };
    return;
  }
  try {
    verifyAdminToken(token);
    ctx.body = { admin: true };
  } catch {
    ctx.status = 401;
    ctx.body = { message: 'Invalid or expired token' };
  }
});

router.post('/logout', (ctx) => {
  clearAuthCookie(ctx);
  ctx.body = { ok: true };
});

export default router;
```

- [ ] **Step 9: Mount the auth router and error handler in `app.ts`**

Replace `server/src/app.ts` with:

```ts
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { errorHandler } from './middleware/error-handler.js';
import authRouter from './routes/auth.js';

export function buildApp(): Koa {
  const app = new Koa();
  app.keys = [process.env.JWT_SECRET ?? 'dev-key'];

  app.use(errorHandler);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(bodyParser());

  const root = new Router();
  root.get('/api/health', (ctx) => {
    ctx.body = { ok: true };
  });

  app.use(root.routes()).use(root.allowedMethods());
  app.use(authRouter.routes()).use(authRouter.allowedMethods());

  return app;
}
```

- [ ] **Step 10: Run the test — verify it passes**

Run: `npm run test:run -- auth`
Expected: 6 passing tests (3 login + 2 me + 1 logout).

- [ ] **Step 11: Commit**

```bash
git add server/
git commit -m "feat(server): auth routes (login/me/logout) + requireAdmin middleware (TDD)"
```

---

## Task 6: Posts public routes (TDD)

**Files:**
- Create: `server/src/routes/posts.ts`, `server/src/__tests__/posts-public.test.ts`, `server/src/__tests__/helpers/seed-firestore-test.ts`
- Modify: `server/src/app.ts` (mount the posts router)

**Working dir:** `server/`

- [ ] **Step 1: Create `server/src/__tests__/helpers/seed-firestore-test.ts`**

```ts
import { Timestamp } from 'firebase-admin/firestore';
import { postsCol } from '../../lib/firestore.js';
import type { PostDoc, PostStatus } from '../../types.js';

type Override = Partial<PostDoc> & { slug: string };

export async function seedPost(o: Override): Promise<PostDoc> {
  const now = Timestamp.now();
  const status: PostStatus = o.status ?? 'published';
  const doc: PostDoc = {
    slug: o.slug,
    title: o.title ?? 'Title ' + o.slug,
    excerpt: o.excerpt ?? 'Excerpt ' + o.slug,
    content: o.content ?? `# ${o.slug}\n\nbody`,
    tags: o.tags ?? ['tag-a'],
    status,
    publishedAt: o.publishedAt ?? (status === 'published' ? now : null),
    createdAt: o.createdAt ?? now,
    updatedAt: o.updatedAt ?? now,
    readingMinutes: o.readingMinutes ?? 1,
    coverImageUrl: o.coverImageUrl ?? null,
  };
  await postsCol().doc(o.slug).set(doc);
  return doc;
}
```

- [ ] **Step 2: Write the failing test — `server/src/__tests__/posts-public.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { Timestamp } from 'firebase-admin/firestore';
import { getTestApp } from './helpers/test-app.js';
import { seedPost } from './helpers/seed-firestore-test.js';

describe('GET /api/posts', () => {
  it('returns only published posts, newest first, without content field', async () => {
    await seedPost({ slug: 'older', publishedAt: Timestamp.fromDate(new Date('2026-01-01')) });
    await seedPost({ slug: 'newer', publishedAt: Timestamp.fromDate(new Date('2026-04-01')) });
    await seedPost({ slug: 'a-draft', status: 'draft' });

    const res = await request(getTestApp()).get('/api/posts');
    expect(res.status).toBe(200);
    const slugs = res.body.map((p: { slug: string }) => p.slug);
    expect(slugs).toEqual(['newer', 'older']);
    res.body.forEach((p: object) => {
      expect(p).not.toHaveProperty('content');
      expect(p).toHaveProperty('publishedAt');
    });
  });

  it('returns [] when no published posts', async () => {
    await seedPost({ slug: 'only-draft', status: 'draft' });
    const res = await request(getTestApp()).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/posts/:slug', () => {
  it('returns the published post including content', async () => {
    await seedPost({ slug: 'hello', content: '# hi', title: 'Hello' });
    const res = await request(getTestApp()).get('/api/posts/hello');
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('hello');
    expect(res.body.content).toBe('# hi');
    expect(res.body.title).toBe('Hello');
  });

  it('returns 404 for an unknown slug', async () => {
    const res = await request(getTestApp()).get('/api/posts/missing');
    expect(res.status).toBe(404);
  });

  it('returns 404 for a draft', async () => {
    await seedPost({ slug: 'a-draft', status: 'draft' });
    const res = await request(getTestApp()).get('/api/posts/a-draft');
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 3: Run the test — verify it fails**

Run: `npm run test:run -- posts-public`
Expected: FAIL — routes not yet implemented.

- [ ] **Step 4: Implement `server/src/routes/posts.ts` (public half only for now)**

```ts
import Router from '@koa/router';
import { Timestamp } from 'firebase-admin/firestore';
import { postsCol } from '../lib/firestore.js';
import type { PostDoc, PostSummary } from '../types.js';

const router = new Router();

function toIso(ts: Timestamp | null): string | null {
  return ts ? ts.toDate().toISOString() : null;
}

function toApiSummary(doc: PostDoc): Omit<PostSummary, 'publishedAt' | 'createdAt' | 'updatedAt'> & {
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
} {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    tags: doc.tags,
    status: doc.status,
    readingMinutes: doc.readingMinutes,
    coverImageUrl: doc.coverImageUrl,
    publishedAt: toIso(doc.publishedAt),
    createdAt: toIso(doc.createdAt)!,
    updatedAt: toIso(doc.updatedAt)!,
  };
}

function toApiFull(doc: PostDoc) {
  return { ...toApiSummary(doc), content: doc.content };
}

router.get('/api/posts', async (ctx) => {
  const snap = await postsCol()
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .get();
  ctx.body = snap.docs.map((d) => toApiSummary(d.data() as PostDoc));
});

router.get('/api/posts/:slug', async (ctx) => {
  const slug = ctx.params.slug;
  const snap = await postsCol().doc(slug).get();
  if (!snap.exists) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }
  const data = snap.data() as PostDoc;
  if (data.status !== 'published') {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }
  ctx.body = toApiFull(data);
});

export default router;
```

- [ ] **Step 5: Mount the posts router in `app.ts`**

In `server/src/app.ts`, after the auth router lines, add:

```ts
import postsRouter from './routes/posts.js';
// ...
app.use(postsRouter.routes()).use(postsRouter.allowedMethods());
```

- [ ] **Step 6: Run the test — verify it passes**

Run: `npm run test:run -- posts-public`
Expected: 5 passing tests (2 list + 3 detail).

- [ ] **Step 7: Commit**

```bash
git add server/
git commit -m "feat(server): public posts routes — list (published only) + detail (TDD)"
```

---

## Task 7: Posts admin CRUD (TDD)

**Files:**
- Modify: `server/src/routes/posts.ts` (add admin routes), `server/src/app.ts` (no change — same router)
- Create: `server/src/__tests__/posts-admin.test.ts`

**Working dir:** `server/`

- [ ] **Step 1: Write the failing test — `server/src/__tests__/posts-admin.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { getTestApp } from './helpers/test-app.js';
import { seedPost } from './helpers/seed-firestore-test.js';
import { postsCol } from '../lib/firestore.js';

const goodCreds = { email: 'admin@test.local', password: 'hunter2' };

async function adminAgent() {
  const agent = request.agent(getTestApp());
  await agent.post('/api/auth/login').send(goodCreds);
  return agent;
}

const baseInput = {
  title: 'Hello world',
  slug: 'hello-world',
  excerpt: 'a first post',
  content: '# hi\n\nbody',
  tags: ['intro'],
  status: 'draft' as const,
  coverImageUrl: null,
};

describe('admin posts — auth', () => {
  it('rejects unauthenticated GET /api/admin/posts', async () => {
    const res = await request(getTestApp()).get('/api/admin/posts');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/posts', () => {
  it('returns drafts and published, newest updated first', async () => {
    await seedPost({ slug: 'p1', status: 'published' });
    await seedPost({ slug: 'd1', status: 'draft' });
    const a = await adminAgent();
    const res = await a.get('/api/admin/posts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});

describe('POST /api/admin/posts', () => {
  it('creates a new post with computed readingMinutes', async () => {
    const a = await adminAgent();
    const res = await a.post('/api/admin/posts').send(baseInput);
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('hello-world');
    expect(res.body.readingMinutes).toBe(1);
    expect(res.body.publishedAt).toBeNull();
  });

  it('rejects with 409 on slug conflict', async () => {
    await seedPost({ slug: 'taken' });
    const a = await adminAgent();
    const res = await a.post('/api/admin/posts').send({ ...baseInput, slug: 'taken' });
    expect(res.status).toBe(409);
  });

  it('sets publishedAt when status is published on create', async () => {
    const a = await adminAgent();
    const res = await a
      .post('/api/admin/posts')
      .send({ ...baseInput, slug: 'p-now', status: 'published' });
    expect(res.status).toBe(201);
    expect(typeof res.body.publishedAt).toBe('string');
  });
});

describe('PUT /api/admin/posts/:slug', () => {
  it('updates an existing post and bumps updatedAt', async () => {
    await seedPost({ slug: 'edit-me', title: 'Old' });
    const a = await adminAgent();
    const res = await a
      .put('/api/admin/posts/edit-me')
      .send({ ...baseInput, slug: 'edit-me', title: 'New' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New');
  });

  it('sets publishedAt only on first draft → published transition', async () => {
    await seedPost({ slug: 'transition', status: 'draft', publishedAt: null });
    const a = await adminAgent();
    const first = await a
      .put('/api/admin/posts/transition')
      .send({ ...baseInput, slug: 'transition', status: 'published' });
    expect(first.body.publishedAt).not.toBeNull();
    const firstAt = first.body.publishedAt;

    // Edit while still published — publishedAt must NOT change.
    const second = await a
      .put('/api/admin/posts/transition')
      .send({ ...baseInput, slug: 'transition', status: 'published', title: 'Edited' });
    expect(second.body.publishedAt).toBe(firstAt);
  });

  it('renames slug atomically (creates new doc, deletes old)', async () => {
    await seedPost({ slug: 'old' });
    const a = await adminAgent();
    const res = await a.put('/api/admin/posts/old').send({ ...baseInput, slug: 'new' });
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('new');
    const oldSnap = await postsCol().doc('old').get();
    const newSnap = await postsCol().doc('new').get();
    expect(oldSnap.exists).toBe(false);
    expect(newSnap.exists).toBe(true);
  });

  it('returns 409 when renaming into a taken slug', async () => {
    await seedPost({ slug: 'a' });
    await seedPost({ slug: 'b' });
    const a = await adminAgent();
    const res = await a.put('/api/admin/posts/a').send({ ...baseInput, slug: 'b' });
    expect(res.status).toBe(409);
  });

  it('returns 404 for an unknown slug', async () => {
    const a = await adminAgent();
    const res = await a.put('/api/admin/posts/nope').send({ ...baseInput, slug: 'nope' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/admin/posts/:slug', () => {
  it('deletes the post', async () => {
    await seedPost({ slug: 'gone' });
    const a = await adminAgent();
    const res = await a.delete('/api/admin/posts/gone');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    const snap = await postsCol().doc('gone').get();
    expect(snap.exists).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test — verify it fails**

Run: `npm run test:run -- posts-admin`
Expected: FAIL — admin routes don't exist yet.

- [ ] **Step 3: Extend `server/src/routes/posts.ts` with admin routes**

Append to the existing file (after the public routes, before `export default router;`):

```ts
import { Timestamp } from 'firebase-admin/firestore';
import { requireAdmin } from '../middleware/require-admin.js';
import { readingMinutes } from '../lib/reading-time.js';
import { db } from '../lib/firestore.js';
import type { PostInput, PostStatus } from '../types.js';

function validateInput(body: unknown): PostInput {
  const b = body as Partial<PostInput>;
  const required = ['title', 'slug', 'excerpt', 'content', 'tags', 'status'] as const;
  for (const k of required) {
    if (b[k] === undefined || b[k] === null) {
      const err = new Error(`Missing field: ${k}`);
      (err as Error & { status?: number }).status = 400;
      throw err;
    }
  }
  if (b.status !== 'draft' && b.status !== 'published') {
    const err = new Error('status must be "draft" or "published"');
    (err as Error & { status?: number }).status = 400;
    throw err;
  }
  if (!Array.isArray(b.tags)) {
    const err = new Error('tags must be an array');
    (err as Error & { status?: number }).status = 400;
    throw err;
  }
  return {
    title: b.title!,
    slug: b.slug!,
    excerpt: b.excerpt!,
    content: b.content!,
    tags: b.tags!,
    status: b.status as PostStatus,
    coverImageUrl: b.coverImageUrl ?? null,
  };
}

router.get('/api/admin/posts', requireAdmin, async (ctx) => {
  const snap = await postsCol().orderBy('updatedAt', 'desc').get();
  ctx.body = snap.docs.map((d) => toApiFull(d.data() as PostDoc));
});

router.get('/api/admin/posts/:slug', requireAdmin, async (ctx) => {
  const snap = await postsCol().doc(ctx.params.slug).get();
  if (!snap.exists) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }
  ctx.body = toApiFull(snap.data() as PostDoc);
});

router.post('/api/admin/posts', requireAdmin, async (ctx) => {
  const input = validateInput(ctx.request.body);
  const now = Timestamp.now();
  const created: PostDoc = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    tags: input.tags,
    status: input.status,
    publishedAt: input.status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
    readingMinutes: readingMinutes(input.content),
    coverImageUrl: input.coverImageUrl,
  };

  const ref = postsCol().doc(input.slug);
  await db.runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists) {
      const err = new Error('Slug already used');
      (err as Error & { status?: number }).status = 409;
      throw err;
    }
    tx.set(ref, created);
  });

  ctx.status = 201;
  ctx.body = toApiFull(created);
});

router.put('/api/admin/posts/:slug', requireAdmin, async (ctx) => {
  const oldSlug = ctx.params.slug;
  const input = validateInput(ctx.request.body);
  const now = Timestamp.now();

  const updated = await db.runTransaction(async (tx) => {
    const oldRef = postsCol().doc(oldSlug);
    const oldSnap = await tx.get(oldRef);
    if (!oldSnap.exists) {
      const err = new Error('Post not found');
      (err as Error & { status?: number }).status = 404;
      throw err;
    }
    const prev = oldSnap.data() as PostDoc;

    // Slug renaming path.
    if (input.slug !== oldSlug) {
      const newRef = postsCol().doc(input.slug);
      const newSnap = await tx.get(newRef);
      if (newSnap.exists) {
        const err = new Error('Slug already used');
        (err as Error & { status?: number }).status = 409;
        throw err;
      }
      const next: PostDoc = {
        ...prev,
        ...input,
        publishedAt:
          prev.status !== 'published' && input.status === 'published'
            ? now
            : prev.publishedAt,
        updatedAt: now,
        readingMinutes: readingMinutes(input.content),
      };
      tx.set(newRef, next);
      tx.delete(oldRef);
      return next;
    }

    // Same slug — just update.
    const next: PostDoc = {
      ...prev,
      ...input,
      publishedAt:
        prev.status !== 'published' && input.status === 'published' ? now : prev.publishedAt,
      updatedAt: now,
      readingMinutes: readingMinutes(input.content),
    };
    tx.set(oldRef, next);
    return next;
  });

  ctx.body = toApiFull(updated);
});

router.delete('/api/admin/posts/:slug', requireAdmin, async (ctx) => {
  const ref = postsCol().doc(ctx.params.slug);
  await ref.delete();
  ctx.body = { ok: true };
});
```

- [ ] **Step 4: Run the test — verify it passes**

Run: `npm run test:run -- posts-admin`
Expected: 11 passing tests across the file.

- [ ] **Step 5: Run the whole suite — make sure nothing regressed**

Run: `npm run test:run`
Expected: all tests across all files pass.

- [ ] **Step 6: Commit**

```bash
git add server/
git commit -m "feat(server): admin posts CRUD with slug uniqueness and rename transaction (TDD)"
```

---

## Task 8: Cloudinary uploads (TDD)

**Files:**
- Create: `server/src/lib/cloudinary.ts`, `server/src/routes/uploads.ts`, `server/src/__tests__/uploads.test.ts`
- Modify: `server/src/app.ts` (mount uploads router)

**Working dir:** `server/`

- [ ] **Step 1: Create `server/src/lib/cloudinary.ts`**

```ts
import { v2 as cloudinary } from 'cloudinary';

let configured = false;
function configure() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export type UploadResult = { url: string; publicId: string };

export async function uploadBuffer(buffer: Buffer): Promise<UploadResult> {
  configure();
  return new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
```

- [ ] **Step 2: Write the failing test — `server/src/__tests__/uploads.test.ts`**

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { getTestApp } from './helpers/test-app.js';

vi.mock('../lib/cloudinary.js', () => ({
  uploadBuffer: vi.fn(async () => ({
    url: 'https://res.cloudinary.com/test/image/upload/abc.jpg',
    publicId: 'test/abc',
  })),
}));

const goodCreds = { email: 'admin@test.local', password: 'hunter2' };

async function adminAgent() {
  const a = request.agent(getTestApp());
  await a.post('/api/auth/login').send(goodCreds);
  return a;
}

beforeEach(() => {
  vi.clearAllMocks();
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
```

- [ ] **Step 3: Run the test — verify it fails**

Run: `npm run test:run -- uploads`
Expected: FAIL — `/api/admin/uploads` returns 404.

- [ ] **Step 4: Implement `server/src/routes/uploads.ts`**

```ts
import Router from '@koa/router';
import multer from '@koa/multer';
import { requireAdmin } from '../middleware/require-admin.js';
import { uploadBuffer } from '../lib/cloudinary.js';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      const err = new Error('Unsupported file type') as Error & { status?: number };
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

const router = new Router();

router.post('/api/admin/uploads', requireAdmin, upload.single('file'), async (ctx) => {
  const file = (ctx.request as unknown as { file?: { buffer: Buffer } }).file;
  if (!file) {
    ctx.status = 400;
    ctx.body = { message: 'No file provided' };
    return;
  }
  const result = await uploadBuffer(file.buffer);
  ctx.body = result;
});

export default router;
```

- [ ] **Step 5: Mount the uploads router in `app.ts`**

After the posts router lines:

```ts
import uploadsRouter from './routes/uploads.js';
// ...
app.use(uploadsRouter.routes()).use(uploadsRouter.allowedMethods());
```

- [ ] **Step 6: Update `error-handler.ts` to translate Multer errors**

Replace `server/src/middleware/error-handler.ts`:

```ts
import type { Context, Next } from 'koa';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    const e = err as { status?: number; code?: string; message?: string };
    if (e.code === 'LIMIT_FILE_SIZE') {
      ctx.status = 400;
      ctx.body = { message: 'File too large' };
      return;
    }
    ctx.status = e.status ?? 500;
    ctx.body = { message: e.message ?? 'Internal error' };
  }
}
```

- [ ] **Step 7: Run the test — verify it passes**

Run: `npm run test:run -- uploads`
Expected: 4 passing tests.

- [ ] **Step 8: Commit**

```bash
git add server/
git commit -m "feat(server): admin Cloudinary upload endpoint with MIME + size limits (TDD)"
```

---

## Task 9: Contact route + admin submissions list (TDD)

**Files:**
- Create: `server/src/routes/contact.ts`, `server/src/__tests__/contact.test.ts`
- Modify: `server/src/app.ts` (mount contact router)

**Working dir:** `server/`

- [ ] **Step 1: Write the failing test — `server/src/__tests__/contact.test.ts`**

```ts
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
```

- [ ] **Step 2: Run the test — verify it fails**

Run: `npm run test:run -- contact`
Expected: FAIL — routes don't exist.

- [ ] **Step 3: Implement `server/src/routes/contact.ts`**

```ts
import Router from '@koa/router';
import { Timestamp } from 'firebase-admin/firestore';
import { contactCol } from '../lib/firestore.js';
import { requireAdmin } from '../middleware/require-admin.js';
import type { ContactDoc, ContactPayload } from '../types.js';

const router = new Router();

router.post('/api/contact', async (ctx) => {
  const body = ctx.request.body as Partial<ContactPayload>;
  const name = body?.name?.trim() ?? '';
  const email = body?.email?.trim() ?? '';
  const message = body?.message?.trim() ?? '';

  if (!name || !email || message.length < 10) {
    ctx.status = 400;
    ctx.body = { message: 'Name, email, and a message of 10+ chars are required' };
    return;
  }

  const ip = ctx.request.ip ?? null;
  await contactCol().add({
    name,
    email,
    message,
    createdAt: Timestamp.now(),
    ip,
  });

  ctx.body = { ok: true };
});

router.get('/api/admin/contact-submissions', requireAdmin, async (ctx) => {
  const snap = await contactCol().orderBy('createdAt', 'desc').get();
  ctx.body = snap.docs.map((d) => {
    const v = d.data() as ContactDoc;
    return {
      id: d.id,
      name: v.name,
      email: v.email,
      message: v.message,
      createdAt: v.createdAt.toDate().toISOString(),
      ip: v.ip,
    };
  });
});

export default router;
```

- [ ] **Step 4: Mount the contact router in `app.ts`**

```ts
import contactRouter from './routes/contact.js';
// ...
app.use(contactRouter.routes()).use(contactRouter.allowedMethods());
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `npm run test:run -- contact`
Expected: 5 passing tests.

- [ ] **Step 6: Run the whole suite**

Run: `npm run test:run`
Expected: every test file passes.

- [ ] **Step 7: Commit**

```bash
git add server/
git commit -m "feat(server): contact submission endpoint + admin list (TDD)"
```

---

## Task 10: Firestore seed script

**Files:**
- Create: `server/src/scripts/seed-firestore.ts`

**Working dir:** repo root and `server/`.

- [ ] **Step 1: Create `server/src/scripts/seed-firestore.ts`**

```ts
import 'dotenv/config';
import { Timestamp } from 'firebase-admin/firestore';
import { postsCol } from '../lib/firestore.js';
import { readingMinutes } from '../lib/reading-time.js';
import type { PostDoc } from '../types.js';

const seedPosts = [
  {
    slug: 'calm-interfaces',
    title: 'On building calm interfaces',
    excerpt: 'Why subtraction is the most underrated tool in interface design.',
    publishedAt: '2026-04-12',
    tags: ['design', 'craft'],
    content: `# On building calm interfaces

The best interfaces ask less of you. They reveal what matters,
hide what doesn't, and trust that you'll find your way.

## A short list

- Fewer colors
- Fewer animations
- Fewer modes

When in doubt, remove a thing.`,
  },
  {
    slug: 'shipping-small',
    title: 'Shipping small, often',
    excerpt: 'A note on cadence over scope.',
    publishedAt: '2026-03-02',
    tags: ['process'],
    content: `# Shipping small, often

Big releases are mostly an accounting trick. Real progress
compounds in small daily moves.`,
  },
  {
    slug: 'blueprint-aesthetic',
    title: 'The blueprint aesthetic',
    excerpt: 'Dot grids, blue ink, and why technical drawings still feel modern.',
    publishedAt: '2026-02-18',
    tags: ['design', 'aesthetics'],
    content: `# The blueprint aesthetic

Engineering drawings have a quiet confidence: nothing decorative,
everything load-bearing. That feels relevant again.`,
  },
  {
    slug: 'koa-notes',
    title: 'Koa notes — small server, big mileage',
    excerpt: 'Why Koa keeps showing up in my side projects.',
    publishedAt: '2026-01-09',
    tags: ['backend', 'node'],
    content: `# Koa notes

Koa is small enough to read in a sitting and gives you exactly
the seams you need. Most "frameworks" hide too much.`,
  },
];

async function main() {
  for (const p of seedPosts) {
    const publishedAt = Timestamp.fromDate(new Date(p.publishedAt));
    const doc: PostDoc = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags,
      status: 'published',
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      readingMinutes: readingMinutes(p.content),
      coverImageUrl: null,
    };
    await postsCol().doc(p.slug).set(doc);
    // eslint-disable-next-line no-console
    console.log(`seeded ${p.slug}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
```

- [ ] **Step 2: Run it against the emulator**

Boot the emulator first if not already running: `firebase emulators:start --only firestore` (separate terminal).

Then from `server/`: `FIRESTORE_EMULATOR_HOST=localhost:8080 GOOGLE_CLOUD_PROJECT=hieublog-local npm run seed`
Expected: prints `seeded calm-interfaces`, `seeded shipping-small`, `seeded blueprint-aesthetic`, `seeded koa-notes`.

- [ ] **Step 3: Verify via the API**

In another terminal, with server running (`npm run dev:server`): `curl -s http://localhost:4000/api/posts | jq '.[0].slug'`
Expected: `"calm-interfaces"` (newest published post).

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add server/src/scripts
git commit -m "feat(server): firestore seed script for the four launch posts"
```

---

## Task 11: Root dev runtime + env templates

**Files:**
- Modify: `package.json` (root), `client/.env.example`, `client/.env.local` (created locally, not committed)
- Create: `client/.env.example` exists already; just confirm contents.

**Working dir:** repo root.

- [ ] **Step 1: Add `concurrently` to the root and update scripts**

Run: `npm install -D -w hieublog concurrently`
(Or if that fails because `hieublog` isn't a workspace name, just `npm install -D concurrently` at the root — it goes into root `node_modules`.)

Update root `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "concurrently -n client,server -c blue,magenta \"npm:dev:client\" \"npm:dev:server\"",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "test": "npm run test:server && npm run test:client",
    "test:client": "npm run test:run --workspace=client",
    "test:server": "npm run test:run --workspace=server",
    "build:client": "npm run build --workspace=client",
    "build:server": "npm run build --workspace=server",
    "seed": "npm run seed --workspace=server"
  }
}
```

- [ ] **Step 2: Confirm `client/.env.example` already has `VITE_API_BASE`**

If not present, add:

```
# Leave VITE_API_BASE empty to use the in-memory mock API.
# Set it to your Koa backend URL once that phase begins, e.g.:
# VITE_API_BASE=http://localhost:4000
VITE_API_BASE=
```

- [ ] **Step 3: Create `client/.env.local` (locally, NOT committed)**

```
VITE_API_BASE=http://localhost:4000
```

- [ ] **Step 4: Smoke check the combined dev script**

Boot the Firestore emulator in one terminal. Then from repo root: `npm run dev`
Expected: prints both `[client]` (Vite at :5173) and `[server]` (Koa at :4000) lines, both stay running.

In a third terminal: `curl -s http://localhost:4000/api/posts | jq length`
Expected: `4`.

Visit `http://localhost:5173/blogs` in a browser. Expected: still shows the 4 posts (now via real backend).

Stop both processes.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json client/.env.example
git commit -m "chore: add concurrently dev runtime and env templates"
```

---

## Task 12: Client `api.ts` — auth + admin namespaces

**Files:**
- Modify: `client/src/lib/api.ts`, `client/src/lib/types.ts`

**Working dir:** `client/`

- [ ] **Step 1: Extend `client/src/lib/types.ts`**

Replace its contents with:

```ts
export type PostStatus = 'draft' | 'published';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string | null;
  readingMinutes: number;
  tags: string[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  coverImageUrl: string | null;
};

export type PostSummary = Omit<Post, 'content'>;

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  coverImageUrl: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ApiError = {
  message: string;
  status: number;
};

export type UploadResponse = {
  url: string;
  publicId: string;
};

export type Project = {
  name: string;
  type: string;
  year: string;
  bg: string;
  accent: string;
  shape: 'square' | 'circle' | 'parallelogram';
  tags: string[];
};
```

- [ ] **Step 2: Replace `client/src/lib/api.ts`**

```ts
import type {
  ContactPayload,
  Post,
  PostInput,
  PostSummary,
  UploadResponse,
} from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

const BASE = import.meta.env.VITE_API_BASE?.trim();

const usingMock = !BASE;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.body && !(init.body instanceof FormData)
      ? { 'content-type': 'application/json' }
      : {}),
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw { message: body.message ?? 'Request failed', status: res.status };
  }
  // 204-like responses
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const realApi = {
  posts: {
    list: () => http<PostSummary[]>('/api/posts'),
    get: async (slug: string): Promise<Post | null> => {
      try {
        return await http<Post>(`/api/posts/${encodeURIComponent(slug)}`);
      } catch (e) {
        if ((e as { status?: number }).status === 404) return null;
        throw e;
      }
    },
  },
  contact: {
    send: (payload: ContactPayload) =>
      http<{ ok: true }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  auth: {
    login: (email: string, password: string) =>
      http<{ ok: true }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: async (): Promise<{ admin: boolean }> => {
      try {
        return await http<{ admin: boolean }>('/api/auth/me');
      } catch (e) {
        if ((e as { status?: number }).status === 401) return { admin: false };
        throw e;
      }
    },
    logout: () => http<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  },
  admin: {
    posts: {
      list: () => http<Post[]>('/api/admin/posts'),
      get: async (slug: string): Promise<Post | null> => {
        try {
          return await http<Post>(`/api/admin/posts/${encodeURIComponent(slug)}`);
        } catch (e) {
          if ((e as { status?: number }).status === 404) return null;
          throw e;
        }
      },
      create: (input: PostInput) =>
        http<Post>('/api/admin/posts', {
          method: 'POST',
          body: JSON.stringify(input),
        }),
      update: (slug: string, input: PostInput) =>
        http<Post>(`/api/admin/posts/${encodeURIComponent(slug)}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        }),
      delete: (slug: string) =>
        http<{ ok: true }>(`/api/admin/posts/${encodeURIComponent(slug)}`, {
          method: 'DELETE',
        }),
    },
    uploads: {
      create: (file: File): Promise<UploadResponse> => {
        const fd = new FormData();
        fd.append('file', file);
        return http<UploadResponse>('/api/admin/uploads', {
          method: 'POST',
          body: fd,
        });
      },
    },
  },
};

// While the mock is still in-tree, fall back for the public surface only.
// Auth + admin on the mock are stubs that always reject — log in via the real backend.
type AuthApi = typeof realApi.auth;
type AdminApi = typeof realApi.admin;

const mockAuth: AuthApi = {
  login: async () => {
    throw { message: 'Mock backend has no auth', status: 501 };
  },
  me: async () => ({ admin: false }),
  logout: async () => ({ ok: true as const }),
};

const mockAdmin: AdminApi = {
  posts: {
    list: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
    get: async () => null,
    create: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
    update: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
    delete: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
  },
  uploads: {
    create: async () => {
      throw { message: 'Mock backend has no admin', status: 501 };
    },
  },
};

export const api = usingMock
  ? { ...mockApi, auth: mockAuth, admin: mockAdmin }
  : realApi;
```

(The mock fallback is temporary scaffolding so the public app keeps working; Task 17 deletes it along with `mock-api.ts`.)

- [ ] **Step 3: Update `client/src/lib/mock-api.ts` to match the new `Post` shape**

Append the new fields to existing seed projection. Replace `mock-api.ts`'s `toSummary` and `get`:

```ts
import type { ContactPayload, Post, PostSummary, ApiError, PostStatus } from '@/lib/types';
import { seedPosts } from '@/content/seed-posts';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function fillDefaults(p: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
}): Post {
  return {
    ...p,
    publishedAt: p.publishedAt,
    status: 'published' as PostStatus,
    createdAt: p.publishedAt,
    updatedAt: p.publishedAt,
    coverImageUrl: null,
  };
}

const toSummary = (post: Post): PostSummary => {
  const { content: _content, ...rest } = post;
  return rest;
};

export const mockApi = {
  posts: {
    async list(): Promise<PostSummary[]> {
      await delay();
      return [...seedPosts]
        .map(fillDefaults)
        .sort((a, b) => ((a.publishedAt ?? '') < (b.publishedAt ?? '') ? 1 : -1))
        .map(toSummary);
    },
    async get(slug: string): Promise<Post | null> {
      await delay();
      const found = seedPosts.find((p) => p.slug === slug);
      return found ? fillDefaults(found) : null;
    },
  },
  contact: {
    async send(payload: ContactPayload): Promise<{ ok: true }> {
      await delay();
      if (!payload.email.trim()) {
        const err: ApiError = { message: 'Email is required', status: 400 };
        throw err;
      }
      if (payload.message.trim().length < 10) {
        const err: ApiError = { message: 'Message must be at least 10 characters', status: 400 };
        throw err;
      }
      return { ok: true };
    },
  },
};
```

- [ ] **Step 4: Update existing `mock-api.test.ts` to match new shape**

Replace `client/src/lib/__tests__/mock-api.test.ts` summary assertion to also accept the new fields. Change the `not.toHaveProperty('content')` block stays the same; nothing else needs to change because tests don't assert on the new fields explicitly. But re-run anyway:

Run from `client/`: `npm run test:run -- mock-api`
Expected: still 7 passing tests.

- [ ] **Step 5: Verify the full client suite still passes**

Run from `client/`: `npm run test:run`
Expected: 22 passing tests (no regressions).

- [ ] **Step 6: Commit**

```bash
git add client/
git commit -m "feat(client): extend api.ts with auth and admin namespaces; widen Post type"
```

---

## Task 13: AuthProvider, RequireAdmin, auth-aware Nav (TDD)

**Files:**
- Create: `client/src/lib/auth-provider.tsx`, `client/src/components/admin/require-admin.tsx`, `client/src/lib/__tests__/auth-provider.test.tsx`, `client/src/components/admin/__tests__/require-admin.test.tsx`
- Modify: `client/src/App.tsx` (wrap with `<AuthProvider>`), `client/src/components/layout/nav.tsx` (auth-aware admin link)

**Working dir:** `client/`

- [ ] **Step 1: Write the failing test for `AuthProvider`**

Create `client/src/lib/__tests__/auth-provider.test.tsx`:

```tsx
import { act, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth-provider';
import { vi, beforeEach } from 'vitest';

vi.mock('@/lib/api', () => {
  return {
    api: {
      auth: {
        me: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
      },
    },
  };
});

import { api } from '@/lib/api';

function Probe() {
  const { isAdmin, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'yes' : 'no'}</span>
      <span data-testid="admin">{isAdmin ? 'yes' : 'no'}</span>
      <button onClick={() => login('a', 'b')}>do-login</button>
      <button onClick={() => logout()}>do-logout</button>
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<AuthProvider />', () => {
  it('starts in loading; resolves to not-admin when /me says no', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(screen.getByTestId('loading').textContent).toBe('yes');
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('no'));
    expect(screen.getByTestId('admin').textContent).toBe('no');
  });

  it('resolves to admin when /me says yes', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('yes'));
  });

  it('flips to admin after login()', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
    (api.auth.login as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('no'));
    await act(async () => {
      screen.getByText('do-login').click();
    });
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('yes'));
  });

  it('flips back after logout()', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
    (api.auth.logout as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('yes'));
    await act(async () => {
      screen.getByText('do-logout').click();
    });
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('no'));
  });
});
```

- [ ] **Step 2: Run the test — verify it fails**

Run: `npm run test:run -- auth-provider`
Expected: FAIL — `AuthProvider` not defined.

- [ ] **Step 3: Implement `client/src/lib/auth-provider.tsx`**

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

type AuthCtx = {
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await api.auth.me();
        if (!cancelled) setIsAdmin(r.admin);
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    await api.auth.login(email, password);
    setIsAdmin(true);
  };

  const logout = async () => {
    await api.auth.logout();
    setIsAdmin(false);
  };

  return <Ctx.Provider value={{ isAdmin, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be inside <AuthProvider>');
  return v;
}
```

- [ ] **Step 4: Run the test — verify it passes**

Run: `npm run test:run -- auth-provider`
Expected: 4 passing tests.

- [ ] **Step 5: Write the failing test for `RequireAdmin`**

Create `client/src/components/admin/__tests__/require-admin.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import RequireAdmin from '@/components/admin/require-admin';
import { AuthProvider } from '@/lib/auth-provider';

vi.mock('@/lib/api', () => ({
  api: {
    auth: {
      me: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    },
  },
}));

import { api } from '@/lib/api';

function App({ initialPath }: { initialPath: string }) {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <div data-testid="protected">secret</div>
              </RequireAdmin>
            }
          />
          <Route path="/admin/login" element={<div data-testid="login">login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<RequireAdmin />', () => {
  it('redirects to /admin/login when not admin', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
    render(<App initialPath="/admin" />);
    await waitFor(() => expect(screen.getByTestId('login')).toBeInTheDocument());
  });

  it('renders children when admin', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
    render(<App initialPath="/admin" />);
    await waitFor(() => expect(screen.getByTestId('protected')).toBeInTheDocument());
  });
});
```

- [ ] **Step 6: Run the test — verify it fails**

Run: `npm run test:run -- require-admin`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `client/src/components/admin/require-admin.tsx`**

```tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-provider';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAdmin) {
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?from=${from}`} replace />;
  }
  return <>{children}</>;
}
```

- [ ] **Step 8: Run the test — verify it passes**

Run: `npm run test:run -- require-admin`
Expected: 2 passing tests.

- [ ] **Step 9: Wrap `<App />` with `<AuthProvider>`**

Replace `client/src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Nav from '@/components/layout/nav';
import Footer from '@/components/layout/footer';
import { AuthProvider } from '@/lib/auth-provider';
import RequireAdmin from '@/components/admin/require-admin';
import Home from '@/routes/home';
import Blogs from '@/routes/blogs';
import BlogDetail from '@/routes/blog-detail';
import Contact from '@/routes/contact';
import NotFound from '@/routes/not-found';
import AdminLogin from '@/routes/admin/login';
import AdminDashboard from '@/routes/admin/index';
import AdminPostEditor from '@/routes/admin/post-editor';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <main className="mx-auto max-w-5xl px-8 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                <RequireAdmin>
                  <AdminPostEditor mode="new" />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/posts/:slug/edit"
              element={
                <RequireAdmin>
                  <AdminPostEditor mode="edit" />
                </RequireAdmin>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
```

(The admin route components don't exist yet — Tasks 14–16. Build will fail at the `import` lines until then. Skip the type-check at this step; it'll pass once those files exist. To keep the test suite green in the meantime, create stub files that default-export `() => null`.)

- [ ] **Step 10: Create stub admin route files**

```tsx
// client/src/routes/admin/login.tsx
export default function AdminLogin() { return null; }
```
```tsx
// client/src/routes/admin/index.tsx
export default function AdminDashboard() { return null; }
```
```tsx
// client/src/routes/admin/post-editor.tsx
type Props = { mode: 'new' | 'edit' };
export default function AdminPostEditor(_: Props) { return null; }
```

- [ ] **Step 11: Update `Nav` to show admin link when logged in**

Modify `client/src/components/layout/nav.tsx`. Replace its body with:

```tsx
import { Link, NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-provider';

const baseLinks = [
  { to: '/#work', label: 'work' },
  { to: '/blogs', label: 'writing' },
  { to: '/contact', label: 'contact' },
];

export default function Nav() {
  const { isAdmin } = useAuth();
  const links = isAdmin
    ? [...baseLinks, { to: '/admin', label: 'admin' }]
    : baseLinks;

  return (
    <nav className="mx-auto mb-12 flex max-w-5xl items-center justify-between px-8 pt-8">
      <Link to="/" className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8 rounded-md">
          <AvatarFallback className="rounded-md bg-blue-700 text-sm font-medium text-white">
            H
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-blue-950">hieu.dev</span>
      </Link>

      <ul className="flex gap-6 text-sm text-blue-900">
        {links.map((l) => {
          const isAnchor = l.to.includes('#');
          if (isAnchor) {
            return (
              <li key={l.label}>
                <a href={l.to} className="hover:underline">{l.label}</a>
              </li>
            );
          }
          return (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) => cn('hover:underline', isActive && 'underline')}
              >
                {l.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 12: Update existing `nav.test.tsx` to wrap with `<AuthProvider>`**

The existing test renders `<Nav />` inside a `<MemoryRouter>` only. It will now break because `useAuth` requires a provider. Wrap the test's helper:

In `client/src/components/layout/__tests__/nav.test.tsx`, change the imports + helper to:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth-provider';
import Nav from '@/components/layout/nav';
import { vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  api: { auth: { me: vi.fn().mockResolvedValue({ admin: false }) } },
}));

function renderNav(initialEntries = ['/']) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Nav />
      </MemoryRouter>
    </AuthProvider>
  );
}

// (existing describe block stays the same)
```

- [ ] **Step 13: Run the whole client suite**

Run: `npm run test:run`
Expected: all tests pass (existing 22 + 4 auth-provider + 2 require-admin = 28 minimum).

- [ ] **Step 14: Commit**

```bash
git add client/
git commit -m "feat(client): AuthProvider + RequireAdmin guard + admin link in Nav (TDD)"
```

---

## Task 14: Admin login page (TDD)

**Files:**
- Modify: `client/src/routes/admin/login.tsx`
- Create: `client/src/components/admin/login-form.tsx`, `client/src/components/admin/__tests__/login-form.test.tsx`

**Working dir:** `client/`

- [ ] **Step 1: Write the failing test — `client/src/components/admin/__tests__/login-form.test.tsx`**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/lib/auth-provider';
import AdminLogin from '@/routes/admin/login';

vi.mock('@/lib/api', () => ({
  api: { auth: { me: vi.fn(), login: vi.fn(), logout: vi.fn() } },
}));

import { api } from '@/lib/api';

function App({ initial = '/admin/login' }: { initial?: string }) {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<div data-testid="dash">dash</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
});

describe('<AdminLogin />', () => {
  it('renders email + password fields and a submit button', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows an inline error on 401', async () => {
    (api.auth.login as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Invalid credentials',
      status: 401,
    });
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  it('navigates to /admin on success (no `from`)', async () => {
    (api.auth.login as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'good');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByTestId('dash')).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run the test — verify it fails**

Run: `npm run test:run -- login-form`
Expected: FAIL — current `AdminLogin` is a stub.

- [ ] **Step 3: Implement `client/src/components/admin/login-form.tsx`**

```tsx
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-provider';

export type LoginFormProps = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError((err as { message?: string }).message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto mt-12 max-w-md">
      <CardContent className="p-8">
        <h1 className="text-2xl font-medium text-blue-950">admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">sign in to author posts</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-blue-950">
              email
            </label>
            <Input id="email" type="email" autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-blue-950">
              password
            </label>
            <Input id="password" type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}
            className="bg-blue-700 hover:bg-blue-800">
            {submitting ? 'signing in…' : 'sign in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Replace `client/src/routes/admin/login.tsx`**

```tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from '@/components/admin/login-form';
import { useAuth } from '@/lib/auth-provider';

export default function AdminLogin() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAdmin) nav('/admin', { replace: true });
  }, [loading, isAdmin, nav]);

  const onSuccess = () => {
    const from = params.get('from');
    nav(from ? decodeURIComponent(from) : '/admin', { replace: true });
  };

  return <LoginForm onSuccess={onSuccess} />;
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `npm run test:run -- login-form`
Expected: 3 passing tests.

- [ ] **Step 6: Run the whole client suite**

Run: `npm run test:run`
Expected: all tests still pass.

- [ ] **Step 7: Commit**

```bash
git add client/
git commit -m "feat(client): admin login page with inline error + redirect (TDD)"
```

---

## Task 15: Admin dashboard (TDD)

**Files:**
- Modify: `client/src/routes/admin/index.tsx`
- Create: `client/src/components/admin/dashboard-table.tsx`, `client/src/components/admin/__tests__/dashboard-table.test.tsx`

**Working dir:** `client/`

- [ ] **Step 1: Write the failing test — `client/src/components/admin/__tests__/dashboard-table.test.tsx`**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/lib/auth-provider';
import AdminDashboard from '@/routes/admin/index';

vi.mock('@/lib/api', () => ({
  api: {
    auth: { me: vi.fn(), login: vi.fn(), logout: vi.fn() },
    admin: {
      posts: {
        list: vi.fn(),
        delete: vi.fn(),
      },
    },
  },
}));

import { api } from '@/lib/api';

const samplePosts = [
  {
    slug: 'a',
    title: 'A title',
    excerpt: '',
    publishedAt: '2026-04-01T00:00:00.000Z',
    readingMinutes: 1,
    tags: [],
    status: 'published' as const,
    createdAt: '2026-04-01T00:00:00.000Z',
    updatedAt: '2026-04-02T00:00:00.000Z',
    coverImageUrl: null,
    content: 'x',
  },
  {
    slug: 'b',
    title: 'B title',
    excerpt: '',
    publishedAt: null,
    readingMinutes: 1,
    tags: [],
    status: 'draft' as const,
    createdAt: '2026-04-03T00:00:00.000Z',
    updatedAt: '2026-04-03T00:00:00.000Z',
    coverImageUrl: null,
    content: 'x',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
  (api.admin.posts.list as ReturnType<typeof vi.fn>).mockResolvedValue(samplePosts);
});

function setup() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('<AdminDashboard />', () => {
  it('renders one row per post with title and status', async () => {
    setup();
    await waitFor(() => expect(screen.getByText('A title')).toBeInTheDocument());
    expect(screen.getByText('B title')).toBeInTheDocument();
    expect(screen.getByText(/published/i)).toBeInTheDocument();
    expect(screen.getByText(/draft/i)).toBeInTheDocument();
  });

  it('delete button calls api.admin.posts.delete after confirmation', async () => {
    (api.admin.posts.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    setup();
    await waitFor(() => screen.getByText('A title'));
    const buttons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(buttons[0]);
    expect(confirmSpy).toHaveBeenCalled();
    expect(api.admin.posts.delete).toHaveBeenCalledWith('a');
  });
});
```

- [ ] **Step 2: Run the test — verify it fails**

Run: `npm run test:run -- dashboard-table`
Expected: FAIL — `AdminDashboard` is still a stub.

- [ ] **Step 3: Implement `client/src/components/admin/dashboard-table.tsx`**

```tsx
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Post } from '@/lib/types';

type Props = {
  posts: Post[];
  onDelete: (slug: string) => void;
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export default function DashboardTable({ posts, onDelete }: Props) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No posts yet — create your first one.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {posts.map((p) => (
            <li key={p.slug} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-blue-950">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  /{p.slug} · updated {fmt(p.updatedAt)}
                </p>
              </div>
              <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>
                {p.status}
              </Badge>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/posts/${p.slug}/edit`}>edit</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(p.slug)}>
                  delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Replace `client/src/routes/admin/index.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DashboardTable from '@/components/admin/dashboard-table';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-provider';
import type { Post } from '@/lib/types';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await api.admin.posts.list());
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (slug: string) => {
    if (!window.confirm(`Delete "${slug}"? This is permanent.`)) return;
    try {
      await api.admin.posts.delete(slug);
      toast.success('Post deleted');
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Delete failed');
    }
  };

  const onLogout = async () => {
    await logout();
    nav('/admin/login', { replace: true });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-blue-950">posts</h1>
          <p className="text-sm text-muted-foreground">drafts and published, newest update first</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <Link to="/admin/posts/new">new post</Link>
          </Button>
          <Button variant="outline" onClick={onLogout}>logout</Button>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">loading…</p>
      ) : (
        <DashboardTable posts={posts} onDelete={onDelete} />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `npm run test:run -- dashboard-table`
Expected: 2 passing tests.

- [ ] **Step 6: Run the whole client suite**

Run: `npm run test:run`
Expected: all tests still pass.

- [ ] **Step 7: Commit**

```bash
git add client/
git commit -m "feat(client): admin dashboard with post list, delete, logout (TDD)"
```

---

## Task 16: Admin post editor + markdown editor + image uploader (TDD)

**Files:**
- Modify: `client/src/routes/admin/post-editor.tsx`, `client/package.json` (add `@uiw/react-md-editor`, `slugify`)
- Create: `client/src/components/admin/post-editor.tsx`, `client/src/components/admin/image-uploader.tsx`, `client/src/components/admin/__tests__/post-editor.test.tsx`, `client/src/components/admin/__tests__/image-uploader.test.tsx`

**Working dir:** `client/`

- [ ] **Step 1: Install editor + slug deps**

Run: `npm install @uiw/react-md-editor slugify`
Expected: install succeeds.

- [ ] **Step 2: Write the failing test for `<ImageUploader />`**

Create `client/src/components/admin/__tests__/image-uploader.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach } from 'vitest';
import ImageUploader from '@/components/admin/image-uploader';

vi.mock('@/lib/api', () => ({
  api: { admin: { uploads: { create: vi.fn() } } },
}));

import { api } from '@/lib/api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<ImageUploader />', () => {
  it('calls onUploaded with returned url after successful upload', async () => {
    (api.admin.uploads.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      url: 'https://res.cloudinary.com/x/y.jpg',
      publicId: 'x/y',
    });
    const onUploaded = vi.fn();
    const user = userEvent.setup();
    render(<ImageUploader onUploaded={onUploaded} label="Upload cover" />);
    const input = screen.getByLabelText(/upload cover/i) as HTMLInputElement;
    const file = new File([new Uint8Array([0xff])], 'x.jpg', { type: 'image/jpeg' });
    await user.upload(input, file);
    await waitFor(() =>
      expect(onUploaded).toHaveBeenCalledWith('https://res.cloudinary.com/x/y.jpg')
    );
  });
});
```

- [ ] **Step 3: Run the test — verify it fails**

Run: `npm run test:run -- image-uploader`
Expected: FAIL.

- [ ] **Step 4: Implement `client/src/components/admin/image-uploader.tsx`**

```tsx
import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type Props = {
  label: string;
  onUploaded: (url: string) => void;
};

export default function ImageUploader({ label, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const r = await api.admin.uploads.create(file);
      onUploaded(r.url);
    } catch (err) {
      toast.error((err as { message?: string }).message ?? 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-blue-50">
      <span>{busy ? 'uploading…' : label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label={label}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `npm run test:run -- image-uploader`
Expected: 1 passing test.

- [ ] **Step 6: Write the failing test for `<AdminPostEditor />`**

Create `client/src/components/admin/__tests__/post-editor.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/lib/auth-provider';
import AdminPostEditor from '@/routes/admin/post-editor';

vi.mock('@/lib/api', () => ({
  api: {
    auth: { me: vi.fn(), login: vi.fn(), logout: vi.fn() },
    admin: {
      posts: {
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      uploads: { create: vi.fn() },
    },
  },
}));

import { api } from '@/lib/api';

function setup(initial: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/admin/posts/new" element={<AdminPostEditor mode="new" />} />
          <Route path="/admin/posts/:slug/edit" element={<AdminPostEditor mode="edit" />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
});

describe('<AdminPostEditor mode="new" />', () => {
  it('auto-derives slug from title', async () => {
    const user = userEvent.setup();
    setup('/admin/posts/new');
    await waitFor(() => screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), 'Hello World');
    expect((screen.getByLabelText(/slug/i) as HTMLInputElement).value).toBe('hello-world');
  });

  it('lets the user override the slug and stops auto-deriving once typed', async () => {
    const user = userEvent.setup();
    setup('/admin/posts/new');
    await waitFor(() => screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), 'Foo');
    await user.clear(screen.getByLabelText(/slug/i));
    await user.type(screen.getByLabelText(/slug/i), 'custom-slug');
    await user.type(screen.getByLabelText(/title/i), ' bar');
    expect((screen.getByLabelText(/slug/i) as HTMLInputElement).value).toBe('custom-slug');
  });

  it('save calls api.admin.posts.create with the form values', async () => {
    (api.admin.posts.create as ReturnType<typeof vi.fn>).mockResolvedValue({ slug: 'hello-world' });
    const user = userEvent.setup();
    setup('/admin/posts/new');
    await waitFor(() => screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), 'Hello World');
    await user.type(screen.getByLabelText(/excerpt/i), 'first');
    await user.type(screen.getByLabelText(/tags/i), 'intro, meta');
    await user.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() =>
      expect(api.admin.posts.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Hello World',
          slug: 'hello-world',
          excerpt: 'first',
          tags: ['intro', 'meta'],
          status: 'draft',
        })
      )
    );
  });
});

describe('<AdminPostEditor mode="edit" />', () => {
  it('loads the post and populates the fields', async () => {
    (api.admin.posts.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      slug: 'a',
      title: 'A title',
      excerpt: 'A excerpt',
      content: '# body',
      publishedAt: null,
      readingMinutes: 1,
      tags: ['x'],
      status: 'draft',
      createdAt: '2026-04-01T00:00:00.000Z',
      updatedAt: '2026-04-01T00:00:00.000Z',
      coverImageUrl: null,
    });
    setup('/admin/posts/a/edit');
    await waitFor(() =>
      expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('A title')
    );
    expect((screen.getByLabelText(/slug/i) as HTMLInputElement).value).toBe('a');
  });
});
```

- [ ] **Step 7: Run the test — verify it fails**

Run: `npm run test:run -- post-editor`
Expected: FAIL — editor is a stub.

- [ ] **Step 8: Implement `client/src/components/admin/post-editor.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import MDEditor from '@uiw/react-md-editor';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploader from '@/components/admin/image-uploader';
import { api } from '@/lib/api';
import type { Post, PostInput, PostStatus } from '@/lib/types';

const toSlug = (s: string) => slugify(s, { lower: true, strict: true, trim: true });

export type Props = { mode: 'new'; initial?: undefined } | { mode: 'edit'; initial: Post };

export default function PostEditor(props: Props) {
  const nav = useNavigate();
  const seed: Post | null = props.mode === 'edit' ? props.initial : null;

  const [title, setTitle] = useState(seed?.title ?? '');
  const [slug, setSlug] = useState(seed?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(props.mode === 'edit');
  const [excerpt, setExcerpt] = useState(seed?.excerpt ?? '');
  const [content, setContent] = useState(seed?.content ?? '');
  const [tagsRaw, setTagsRaw] = useState((seed?.tags ?? []).join(', '));
  const [status, setStatus] = useState<PostStatus>(seed?.status ?? 'draft');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(seed?.coverImageUrl ?? null);
  const [submitting, setSubmitting] = useState(false);

  // auto-derive slug from title until the slug field is touched
  useEffect(() => {
    if (!slugTouched) setSlug(toSlug(title));
  }, [title, slugTouched]);

  const buildInput = (): PostInput => ({
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt.trim(),
    content,
    tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
    status,
    coverImageUrl,
  });

  const save = async () => {
    setSubmitting(true);
    try {
      let saved;
      if (props.mode === 'new') {
        saved = await api.admin.posts.create(buildInput());
        toast.success('Post created');
        nav(`/admin/posts/${saved.slug}/edit`, { replace: true });
      } else {
        saved = await api.admin.posts.update(seed!.slug, buildInput());
        toast.success('Saved');
        if (saved.slug !== seed!.slug) {
          nav(`/admin/posts/${saved.slug}/edit`, { replace: true });
        }
      }
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (props.mode !== 'edit') return;
    if (!window.confirm(`Delete "${seed!.slug}"?`)) return;
    try {
      await api.admin.posts.delete(seed!.slug);
      toast.success('Deleted');
      nav('/admin', { replace: true });
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-blue-950">title</label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex w-64 flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-blue-950">slug</label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-blue-950">status</label>
          <div className="flex rounded-md border bg-white">
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={status === 'draft' ? 'bg-blue-50 px-3 py-1.5 text-sm' : 'px-3 py-1.5 text-sm'}
            >
              draft
            </button>
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={status === 'published' ? 'bg-blue-700 px-3 py-1.5 text-sm text-white' : 'px-3 py-1.5 text-sm'}
            >
              published
            </button>
          </div>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4" data-color-mode="light">
          <MDEditor value={content} onChange={(v) => setContent(v ?? '')} height={420} preview="edit" />
        </CardContent>
      </Card>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className="text-sm font-medium text-blue-950">excerpt</label>
          <Textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tags" className="text-sm font-medium text-blue-950">tags</label>
          <Input id="tags" placeholder="comma, separated" value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)} />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <label className="text-sm font-medium text-blue-950">cover image</label>
        <div className="flex items-center gap-3">
          {coverImageUrl ? (
            <img src={coverImageUrl} alt="" className="h-16 w-24 rounded object-cover" />
          ) : (
            <div className="h-16 w-24 rounded border border-dashed bg-blue-50/40" />
          )}
          <ImageUploader label="upload cover" onUploaded={(u) => setCoverImageUrl(u)} />
          {coverImageUrl && (
            <Button variant="outline" size="sm" onClick={() => setCoverImageUrl(null)}>
              remove
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={save} disabled={submitting} className="bg-blue-700 hover:bg-blue-800">
          {submitting ? 'saving…' : 'save'}
        </Button>
        {props.mode === 'edit' && (
          <Button variant="outline" onClick={remove}>
            delete
          </Button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Replace `client/src/routes/admin/post-editor.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import PostEditor from '@/components/admin/post-editor';
import { api } from '@/lib/api';
import type { Post } from '@/lib/types';

type Props = { mode: 'new' | 'edit' };

export default function AdminPostEditor({ mode }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [loaded, setLoaded] = useState<Post | null>(null);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode !== 'edit' || !slug) return;
    let cancel = false;
    (async () => {
      try {
        const p = await api.admin.posts.get(slug);
        if (cancel) return;
        if (!p) {
          toast.error('Post not found');
          return;
        }
        setLoaded(p);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [mode, slug]);

  if (mode === 'new') return <PostEditor mode="new" />;
  if (loading) return <p className="text-sm text-muted-foreground">loading…</p>;
  if (!loaded) return <p className="text-sm text-muted-foreground">Post not found.</p>;
  return <PostEditor mode="edit" initial={loaded} />;
}
```

- [ ] **Step 10: Run the test — verify it passes**

Run: `npm run test:run -- post-editor`
Expected: 4 passing tests (3 new + 1 edit).

- [ ] **Step 11: Run the whole client suite**

Run: `npm run test:run`
Expected: every test still passes.

- [ ] **Step 12: Commit**

```bash
git add client/
git commit -m "feat(client): admin post editor with @uiw/react-md-editor + cover uploader (TDD)"
```

---

## Task 17: Drop mock API and simplify `api.ts`

**Files:**
- Delete: `client/src/lib/mock-api.ts`, `client/src/lib/__tests__/mock-api.test.ts`, `client/src/content/seed-posts.ts`
- Modify: `client/src/lib/api.ts`

**Working dir:** `client/`

> Run this task **after** the seed script has populated Firestore (Task 10) so the public site doesn't go blank between commits. The local dev pipeline is now: emulator → real Koa → real React fetch.

- [ ] **Step 1: Delete the mock-api files**

```bash
rm client/src/lib/mock-api.ts
rm client/src/lib/__tests__/mock-api.test.ts
rm client/src/content/seed-posts.ts
```

- [ ] **Step 2: Replace `client/src/lib/api.ts` with the real-only version**

```ts
import type {
  ContactPayload,
  Post,
  PostInput,
  PostSummary,
  UploadResponse,
} from '@/lib/types';

const BASE = import.meta.env.VITE_API_BASE?.trim() ?? '';

if (!BASE) {
  // Surface this loudly during development so we never accidentally hit the same-origin path.
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE is not set; API calls will go to same origin.');
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.body && !(init.body instanceof FormData)
      ? { 'content-type': 'application/json' }
      : {}),
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw { message: body.message ?? 'Request failed', status: res.status };
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  posts: {
    list: () => http<PostSummary[]>('/api/posts'),
    get: async (slug: string): Promise<Post | null> => {
      try {
        return await http<Post>(`/api/posts/${encodeURIComponent(slug)}`);
      } catch (e) {
        if ((e as { status?: number }).status === 404) return null;
        throw e;
      }
    },
  },
  contact: {
    send: (payload: ContactPayload) =>
      http<{ ok: true }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  auth: {
    login: (email: string, password: string) =>
      http<{ ok: true }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: async (): Promise<{ admin: boolean }> => {
      try {
        return await http<{ admin: boolean }>('/api/auth/me');
      } catch (e) {
        if ((e as { status?: number }).status === 401) return { admin: false };
        throw e;
      }
    },
    logout: () => http<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  },
  admin: {
    posts: {
      list: () => http<Post[]>('/api/admin/posts'),
      get: async (slug: string): Promise<Post | null> => {
        try {
          return await http<Post>(`/api/admin/posts/${encodeURIComponent(slug)}`);
        } catch (e) {
          if ((e as { status?: number }).status === 404) return null;
          throw e;
        }
      },
      create: (input: PostInput) =>
        http<Post>('/api/admin/posts', {
          method: 'POST',
          body: JSON.stringify(input),
        }),
      update: (slug: string, input: PostInput) =>
        http<Post>(`/api/admin/posts/${encodeURIComponent(slug)}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        }),
      delete: (slug: string) =>
        http<{ ok: true }>(`/api/admin/posts/${encodeURIComponent(slug)}`, {
          method: 'DELETE',
        }),
    },
    uploads: {
      create: (file: File): Promise<UploadResponse> => {
        const fd = new FormData();
        fd.append('file', file);
        return http<UploadResponse>('/api/admin/uploads', {
          method: 'POST',
          body: fd,
        });
      },
    },
  },
};
```

- [ ] **Step 3: Update `client/src/components/home/__tests__/work-grid.test.tsx`**

The work-grid still imports `seedProjects` from `@/content/seed-projects` — keep that. Only `seed-posts` is removed. No change here, but verify by running:

Run: `npm run test:run -- work-grid`
Expected: 3 passing tests.

- [ ] **Step 4: Run the whole client suite**

Run: `npm run test:run`
Expected: every remaining test passes (the 7 mock-api tests are gone with the file).

- [ ] **Step 5: Run the build**

Run: `npm run build`
Expected: succeeds, no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add client/
git commit -m "chore(client): drop mock-api and seed-posts now that backend is live"
```

---

## Task 18: End-to-end smoke + responsive sweep

**Files:** none modified — verification only.

**Working dir:** repo root.

- [ ] **Step 1: Run all server tests**

Run: `npm run test:server`
Expected: every server test file passes.

- [ ] **Step 2: Run all client tests**

Run: `npm run test:client`
Expected: every client test file passes.

- [ ] **Step 3: Boot the full stack**

In one terminal: `firebase emulators:start --only firestore`
In another: `npm run dev`
Expected: both Vite (:5173) and Koa (:4000) up, no errors.

- [ ] **Step 4: Re-seed Firestore (optional fresh start)**

In a third terminal: `npm run seed`
Expected: prints `seeded calm-interfaces` etc.

- [ ] **Step 5: Walk every public route**

Visit and verify:
- `/` — hero, stats, work, tools, contact CTA. All as before.
- `/blogs` — 4 cards, newest first.
- `/blogs/calm-interfaces` — title, meta, prose body.
- `/blogs/no-such-slug` — "Post not found".
- `/contact` — submit fills `contact_submissions` (check Firestore emulator UI at :4400).

- [ ] **Step 6: Walk the admin flow**

- `/admin` — should redirect to `/admin/login`.
- Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`.
- Dashboard shows the 4 seeded posts.
- Create a new post: title, paste markdown, drop in an image (Cloudinary upload), set status published, save. Visit `/blogs/<slug>` — it appears.
- Edit the post: change title, change slug, save. Old URL 404s; new URL works.
- Toggle a post to draft: it disappears from `/blogs`.
- Delete a post: gone from dashboard and `/blogs`.
- Log out: nav loses the `admin` link, `/admin` redirects to login.

- [ ] **Step 7: Responsive sweep**

In DevTools, resize to:
- 375px (iPhone) — admin login card centered, dashboard table stacks readably, post editor scrolls without overlap.
- 768px (iPad) — editor body two-column where it should be.
- 1024px+ — full layout.

Fix anything that breaks (commonly: hide the slug field or stack title/slug on mobile in the editor's top bar).

- [ ] **Step 8: Commit any responsive tweaks (if any)**

```bash
git add client/
git commit -m "chore(client): responsive polish for admin pages"
```

If no changes were needed, skip this step.

---

## Done

The admin + backend phase is complete. To deploy in the future:

1. Provision a real Firebase project, swap `FIRESTORE_EMULATOR_HOST` away, set `FIREBASE_SERVICE_ACCOUNT_JSON`.
2. Provision a Cloudinary account, fill the four env vars.
3. Pick a Node host for Koa (Render, Fly, Cloud Run), set `NODE_ENV=production`, `COOKIE_SECURE=true`, real `JWT_SECRET`, real `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
4. Set `VITE_API_BASE` on the static-host build to the deployed Koa URL.

The api.ts seam means none of that touches React code.
