# Admin + Backend Phase — Design

> **Status:** approved 2026-05-07. This spec extends the project beyond the frontend-first phase ([`2026-05-05-portfolio-frontend-design.md`](./2026-05-05-portfolio-frontend-design.md), which deferred admin to a later phase). It introduces a Koa + Firestore backend, admin authentication via JWT cookies, an admin authoring UI, and Cloudinary-backed image uploads.

## 1. Goal

Give Hieu a single-admin authoring workflow:

- Log into `/admin/login`, see a dashboard of every post (drafts and published), create / edit / delete posts in a markdown editor with inline image upload, toggle a draft/publish state, and have all of it persist in Firestore behind a Koa server.
- Public site stays the same: `/`, `/blogs`, `/blogs/:slug`, `/contact` continue to work, but data now flows through Koa → Firestore instead of the in-memory mock.

## 2. Architecture

```
┌──────────────┐        HTTPS+cookies       ┌──────────────┐
│   client/    │ ◀───────────────────────▶  │   server/    │
│   React SPA  │                            │   Koa API    │
└──────┬───────┘                            └──────┬───────┘
       │                                           │
       │                                           ├── Firebase Admin SDK ▶ Firestore
       │                                           │
       │       multipart/form-data                 └── cloudinary SDK    ▶ Cloudinary CDN
       │ ────────────────────────────────────▶
       │       (admin uploads only)
```

- **`client/`** (existing): React 18 + Vite + Tailwind v4 + shadcn/ui. Adds `/admin/*` routes and an `AuthProvider`. Never imports `firebase` or `cloudinary` directly.
- **`server/`** (new): Koa app. Owns all Firestore + Cloudinary access. Public `GET /api/posts*` endpoints are unauthenticated; everything under `/api/admin/*` (and write methods on `/api/posts*`) requires the admin JWT cookie.
- **Firestore**: `posts` collection (doc ID = slug), `contact_submissions` collection.
- **Cloudinary**: stores all uploaded images. Server is the only thing with API credentials; client only ever sees the returned `secure_url`.

The existing `client/src/lib/api.ts` switch (mock vs. real fetch via `VITE_API_BASE`) is the seam: when `VITE_API_BASE` points at the Koa server, `api.ts` makes real HTTP calls and `mock-api.ts` is no longer used.

## 3. Auth

Hardcoded admin credentials in env vars. Single user, no signup, no roles.

### 3.1 Login flow

1. `POST /api/auth/login` body `{ email, password }`. Koa compares to `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars (plaintext compare; we never store a users table).
2. On match, server signs a JWT (HS256, payload `{ sub: 'admin', iat, exp }`, 7-day expiry, secret = `JWT_SECRET`).
3. Response sets cookie:
   ```
   Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
   ```
   `Secure` is gated by `COOKIE_SECURE=true` in production; off in local dev.
4. Response body: `{ ok: true }`.
5. On mismatch: 401 `{ message: "Invalid credentials" }` and no cookie.

### 3.2 Session check

`GET /api/auth/me` — middleware reads `ctx.cookies.get('token')`, verifies JWT. Returns `{ admin: true }` on valid token, 401 otherwise. Frontend `AuthProvider` calls this once on mount to decide if the admin session is alive.

### 3.3 Logout

`POST /api/auth/logout` — server clears cookie via `ctx.cookies.set('token', null)`. Always returns `{ ok: true }`.

### 3.4 `requireAdmin` middleware

Wraps every write route (`POST/PUT/DELETE /api/posts/*`, every `/api/admin/*`). Reads cookie, verifies JWT, attaches `ctx.state.user = 'admin'`. On failure → 401.

### 3.5 CSRF posture

Single-origin app (frontend and Koa under same domain in production), `SameSite=Strict` cookie, browsers block cross-site requests carrying the cookie. No CSRF token needed for v1. If a separate frontend domain is ever introduced, revisit (move to `SameSite=Lax` + CSRF token).

### 3.6 Frontend integration

- All `fetch` calls in `api.ts` use `credentials: 'include'` so cookies ride along.
- `<AuthProvider>` exposes `{ isAdmin, loading, login, logout }`. Calls `/api/auth/me` once on mount.
- `<RequireAdmin>` route guard wraps `/admin/*` routes; redirects to `/admin/login?from=<original>` on `isAdmin === false`.

## 4. Data model

### 4.1 Firestore `posts/{slug}`

```ts
type PostDoc = {
  slug: string;                     // doc ID; URL-safe, unique
  title: string;
  excerpt: string;
  content: string;                  // markdown source
  tags: string[];
  status: 'draft' | 'published';
  publishedAt: Timestamp | null;    // set first time draft → published; not re-set on edits
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readingMinutes: number;           // computed at save time
  coverImageUrl: string | null;     // Cloudinary secure_url
};
```

Computed at save time on the server:
- `readingMinutes = Math.max(1, Math.ceil(words(content) / 220))`.
- `publishedAt`: set to `now` only when `prev.status !== 'published' && next.status === 'published'`.

### 4.2 Firestore `contact_submissions/{auto-id}`

```ts
type ContactDoc = {
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  ip: string | null;
};
```

Stored on every successful `POST /api/contact`. Listable via `/api/admin/contact-submissions` (cookie required). Inbox UI is **not in v1**; data is captured so a later phase can surface it.

### 4.3 Slug strategy

- Auto-generated on the client from `title` via `slugify(title, { lower: true, strict: true })`.
- Editable in the editor. Once the user types in the slug field, auto-derivation stops for that post.
- Server enforces uniqueness on save: if `posts/<slug>` exists and isn't this post, return 409 `{ message: "Slug already used" }`.
- **Slug rename on edit**: allowed. Server runs a transaction: write new doc, delete old doc. Old URL stops resolving (acceptable for a personal blog; redirects can be added later if needed).

### 4.4 Public visibility rules

- `GET /api/posts` returns only `status === 'published'`, ordered by `publishedAt desc`. Strips `content` field (returns `PostSummary[]`).
- `GET /api/posts/:slug` returns the full post only if `status === 'published'`. Drafts return 404 to public callers.
- Admin reads via `GET /api/admin/posts` and `GET /api/admin/posts/:slug` return everything.

## 5. API surface

### 5.1 Public

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/posts` | — | `PostSummary[]` (published only) |
| GET | `/api/posts/:slug` | — | `Post` (404 if missing or draft) |
| POST | `/api/contact` | `ContactPayload` | `{ ok: true }` (or 4xx `{ message }`) |

### 5.2 Auth

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` | `{ ok: true }` + cookie, or 401 |
| GET | `/api/auth/me` | — | `{ admin: true }` or 401 |
| POST | `/api/auth/logout` | — | `{ ok: true }` |

### 5.3 Admin (cookie required)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/admin/posts` | — | `PostDoc[]` (all statuses) |
| GET | `/api/admin/posts/:slug` | — | `PostDoc` or 404 |
| POST | `/api/admin/posts` | `PostInput` | `PostDoc` (201) or 409 (slug conflict) |
| PUT | `/api/admin/posts/:slug` | `PostInput` | `PostDoc` or 409 |
| DELETE | `/api/admin/posts/:slug` | — | `{ ok: true }` |
| POST | `/api/admin/uploads` | `multipart` | `{ url: string, publicId: string }` |
| GET | `/api/admin/contact-submissions` | — | `ContactDoc[]` (data only; no UI in v1) |

`PostInput`: `{ title, slug, excerpt, content, tags, status, coverImageUrl }`. Server fills `createdAt`, `updatedAt`, `publishedAt`, `readingMinutes`.

## 6. Image upload (Cloudinary)

1. Editor's `onUpload` handler sends file as `multipart/form-data` to `POST /api/admin/uploads`.
2. Koa receives via `@koa/multer` (memory storage), validates:
   - MIME in `['image/jpeg', 'image/png', 'image/webp', 'image/gif']`.
   - Size ≤ 5 MB.
3. Koa calls `cloudinary.uploader.upload_stream({ folder: process.env.CLOUDINARY_FOLDER }, ...)` and pipes the buffer in.
4. Returns `{ url: result.secure_url, publicId: result.public_id }`. The editor inserts `![alt](<url>)` at the cursor.
5. Cover image upload uses the same endpoint; the returned `url` is stored in `posts.coverImageUrl`.

Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are server-side only. The folder differs per environment (`hieublog-dev` vs `hieublog-prod`) so dev uploads don't pollute prod.

**Orphan images:** if a post is deleted or an image is removed from a draft before save, the Cloudinary asset stays. Cleanup is deferred — not worth the complexity for a personal blog.

## 7. Frontend admin UI

### 7.1 Routes added

| Path | Component | Guard |
|---|---|---|
| `/admin/login` | `<AdminLogin />` | redirects to `/admin` if `isAdmin` |
| `/admin` | `<AdminDashboard />` | `<RequireAdmin>` |
| `/admin/posts/new` | `<AdminPostEditor mode="new" />` | `<RequireAdmin>` |
| `/admin/posts/:slug/edit` | `<AdminPostEditor mode="edit" />` | `<RequireAdmin>` |

### 7.2 Components (under `client/src/components/admin/`)

- `auth-provider.tsx` — context + `useAuth()` hook (`{ isAdmin, loading, login, logout }`).
- `require-admin.tsx` — route guard.
- `login-form.tsx` — single-card email/password form, inline error on 401.
- `dashboard-table.tsx` — list of posts; cols = title / status badge / updated / actions. Top-right "new post" button. Logout in corner. Empty state when zero posts.
- `post-editor.tsx` — top bar (title, slug, status toggle, save, delete-if-edit), two-column body (markdown editor left, live preview right; stacked on mobile), tags chips, excerpt textarea, cover image uploader.
- `image-uploader.tsx` — shared by inline images and cover image. Drag-drop + click to upload.

### 7.3 Markdown editor

`@uiw/react-md-editor` is the chosen library. Configured with `previewOptions` set so the preview pane mirrors `prose prose-blue` styling used on the public detail page (consistency across compose-time and render-time).

The editor's `commands` array gets a custom `image` command that:
1. Opens a hidden file picker.
2. Calls `api.admin.uploads.create(file)`.
3. Inserts `![<filename>](<returned url>)` at the current selection.

Drag-drop on the editor surface uses the same uploader.

### 7.4 Auth-aware nav

`<Nav />` reads `useAuth().isAdmin`. When true, it shows an extra `admin` link → `/admin`. Public nav otherwise unchanged. Logout lives inside `/admin` (not in the public nav).

### 7.5 Public site changes

- `seed-posts.ts` and `mock-api.ts` are deleted after migration. `api.ts` collapses to only the real-fetch implementation.
- `<Blogs />` and `<BlogDetail />` continue to work without changes — same `api.posts.list` / `api.posts.get` signatures.

## 8. Project layout

```
HieuBlog/
├── client/                          (existing)
│   └── src/
│       ├── components/admin/        ← new
│       └── routes/admin/            ← new
├── server/                          ← new top-level package
│   ├── src/
│   │   ├── index.ts                 (Koa app entry)
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── posts.ts
│   │   │   ├── uploads.ts
│   │   │   └── contact.ts
│   │   ├── middleware/
│   │   │   ├── require-admin.ts
│   │   │   └── error-handler.ts
│   │   ├── lib/
│   │   │   ├── firestore.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── jwt.ts
│   │   └── scripts/seed-firestore.ts
│   ├── tests/                       (vitest + supertest)
│   ├── package.json
│   └── tsconfig.json
├── package.json                     (npm workspaces: ["client", "server"])
└── docs/superpowers/specs/          (this file lives here)
```

## 9. Tech stack additions

### Server (`server/package.json`)

- `koa`, `@koa/router`, `@koa/cors`, `koa-bodyparser`, `@koa/multer`
- `firebase-admin`
- `cloudinary`
- `jsonwebtoken`
- `slugify`
- `vitest` + `supertest`
- `tsx` (dev runtime), `typescript`

### Client (added)

- `@uiw/react-md-editor`
- `slugify` (live preview of auto-slug)

## 10. Environment variables

| Var | Where | Purpose |
|---|---|---|
| `PORT` | server `.env` | default 4000 |
| `CORS_ORIGIN` | server `.env` | `http://localhost:5173` in dev |
| `JWT_SECRET` | server `.env` | random ≥64 chars |
| `ADMIN_EMAIL` | server `.env` | login email |
| `ADMIN_PASSWORD` | server `.env` | login password (plaintext, never logged) |
| `COOKIE_SECURE` | server `.env` | `false` in dev, `true` in prod |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | server `.env` | service account JSON (or path) for Admin SDK |
| `FIRESTORE_EMULATOR_HOST` | server `.env.local` | e.g. `localhost:8080` (dev only) |
| `CLOUDINARY_CLOUD_NAME` | server `.env` | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | server `.env` | |
| `CLOUDINARY_API_SECRET` | server `.env` | |
| `CLOUDINARY_FOLDER` | server `.env` | `hieublog-dev` or `hieublog-prod` |
| `VITE_API_BASE` | client `.env.local` | `http://localhost:4000` |

Both `.env` files in `.gitignore`. `.env.example` next to each.

## 11. Local dev workflow

1. `npm install` at repo root (workspaces fan out into `client/` and `server/`).
2. `firebase emulators:start --only firestore` (one-time `firebase init` to create config).
3. `npm run dev` at root → boots Koa on :4000 + Vite on :5173 via `concurrently`.
4. First time only: `npm run seed` → runs `server/src/scripts/seed-firestore.ts`, which writes the existing 4 seed posts as `status: 'published'`.
5. Visit `http://localhost:5173/admin/login`, log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## 12. Testing strategy

- **Server:** `vitest` + `supertest`. Test files run against the Firestore emulator (started by a vitest global setup hook). Coverage:
  - `auth.test.ts`: login good/bad creds, me with/without cookie, logout clears cookie.
  - `posts.test.ts`: public list filters drafts, public get returns 404 on draft, admin CRUD, slug conflict 409, slug rename transaction.
  - `uploads.test.ts`: rejects bad MIME and >5 MB; happy path mocks the Cloudinary SDK.
  - `contact.test.ts`: validation, persistence to Firestore.
- **Client:** vitest + RTL (matches existing setup):
  - `auth-provider.test.tsx` — login → me → logout transitions, fetch mocked.
  - `require-admin.test.tsx` — redirect when not admin.
  - `dashboard-table.test.tsx` — rows render, delete fires with confirmation.
  - `post-editor.test.tsx` — auto-slug from title, slug override sticks, save calls correct API, draft/publish toggle.

## 13. Out of scope this phase

- Multi-author / roles / signup flow.
- Refresh tokens (single 7-day JWT is enough).
- Image cleanup on post delete (Cloudinary orphans accepted).
- Admin inbox UI for `contact_submissions` (data captured, UI deferred).
- Old-slug → new-slug redirects on rename (low traffic, deferred).
- Production deploy plumbing (Koa hosting, prod Firebase project, prod Cloudinary folder, frontend hosting, custom domain). Deploy gets its own follow-up spec.
- Dark mode for admin pages (deferred with the public site's dark mode).

## 14. Open questions

None at design close. Reopen if any of these become true:
- A second author needs access → revisit `roles`.
- Frontend and API end up on different origins → revisit cookie + CSRF posture.
- Large traffic / SEO concerns on slug rename → add redirects collection.
