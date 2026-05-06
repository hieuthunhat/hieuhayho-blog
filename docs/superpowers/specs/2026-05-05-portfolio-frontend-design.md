# Portfolio frontend — design

**Date:** 2026-05-05
**Status:** approved — ready for implementation plan
**Scope:** Frontend-first phase of HieuBlog. Backend (Koa + Firebase) follows in a separate spec.

## 1. Context

Personal site for Hieu (developer). Visual language is locked in by `docs/SPEC.md` and the prototype `docs/Portfolio.jsx`: blueprint dot-grid background, blue-700 accent, blue-950 text, shadcn/ui card-based layout, sentence-case copy, max-width 1024px container.

Current repo state:
- `client/` — empty Vite scaffold (vanilla JS, will be reset to Vite + React + TS).
- `server/` — empty `package.json`. Out of scope this phase.
- `docs/SPEC.md`, `docs/Portfolio.jsx` — visual reference.

Pages in scope this phase: **homepage, blogs (list + detail), contact**. About page is deliberately skipped.

## 2. Architecture & tooling

**Stack**
- Vite + React 18 + TypeScript
- Tailwind CSS v4
- shadcn/ui — `button`, `card`, `badge`, `separator`, `avatar`, `input`, plus added: `skeleton`, `sonner`, `textarea`, `navigation-menu`
- `lucide-react` icons
- `react-router-dom` v7
- `react-markdown` + `remark-gfm` for blog post bodies
- `@tailwindcss/typography` for prose styling on blog detail

**Folder layout under `client/`**

```
client/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── components.json           (shadcn config)
├── src/
│   ├── main.tsx              (router + root)
│   ├── App.tsx               (layout: <Nav/> <Outlet/> <Footer/>)
│   ├── globals.css           (dot-grid background on <body>, tailwind v4 css-config)
│   ├── routes/
│   │   ├── home.tsx
│   │   ├── blogs.tsx
│   │   ├── blog-detail.tsx
│   │   ├── contact.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/           (nav.tsx, footer.tsx)
│   │   ├── home/             (hero.tsx, stats.tsx, work-grid.tsx, tools-card.tsx, contact-cta.tsx)
│   │   ├── blog/             (post-card.tsx, post-meta.tsx)
│   │   └── ui/               (shadcn-generated)
│   ├── lib/
│   │   ├── api.ts            (typed public surface; switches between mock and real)
│   │   ├── mock-api.ts       (in-memory mock used while backend is offline)
│   │   └── types.ts          (Post, PostSummary, ContactPayload, ApiError)
│   └── content/
│       ├── seed-posts.ts     (mock blog posts for development)
│       └── seed-projects.ts  (4 homepage project cards, typed)
```

The vanilla scaffold (`main.js`, `counter.js`, `style.css`) is wiped. `index.html`, `public/favicon.svg`, `public/icons.svg` are kept.

## 3. Routing

`react-router-dom` v7, browser history, no SSR.

| Path | Component | Purpose |
|---|---|---|
| `/` | `routes/home.tsx` | Homepage per SPEC |
| `/blogs` | `routes/blogs.tsx` | Blog post list |
| `/blogs/:slug` | `routes/blog-detail.tsx` | Single post, markdown-rendered |
| `/contact` | `routes/contact.tsx` | Full contact page with form |
| `*` | `routes/not-found.tsx` | 404 fallback |

**Nav** — 3 links, `work · writing · contact`:
- `work` → `/#work` (in-page anchor on the homepage)
- `writing` → `/blogs`
- `contact` → `/contact`

About is omitted from the nav this phase.

Brand: logo "H" on `bg-blue-700`, brand text "hieu.dev". Active link styled via `aria-current="page"` underline. Implemented with shadcn `navigation-menu`.

Adding a new top-level page later = create a route file + register it in `App.tsx`. No nested routing until needed.

## 4. Shared layout & background

**`App.tsx` shell**

```tsx
<>
  <Nav />
  <main className="mx-auto max-w-5xl px-8 pb-16">
    <Outlet />
  </main>
  <Footer />
</>
```

**Dot-grid background** — applied once on `<body>` in `globals.css`, so it stays continuous across route changes:

```css
body {
  background-color: #ffffff;
  background-image: radial-gradient(circle, #1d4ed8 1.2px, transparent 1.2px);
  background-size: 32px 32px;
  background-position: 0 0;
  min-height: 100vh;
}
```

**`<Nav />`**
- Top of page (not sticky), `pt-8 mb-12`.
- Left: shadcn `Avatar` 32×32 + brand text "hieu.dev", linked to `/`.
- Right: shadcn `navigation-menu` with three `NavLink`s.
- Mobile: same horizontal layout, `gap-4` instead of `gap-6`. No hamburger needed at three links.

**`<Footer />`** — single centered line, `text-xs text-muted-foreground`: `© 2026 hieu.dev · made with care`. Margin `mt-12 pb-8`.

Page rhythm: `mb-6` between top-level cards, matching the SPEC homepage.

## 5. Pages

### 5.1 Home (`/`)

Direct port of `docs/Portfolio.jsx`, refactored into TS sub-components:

- `<Hero />` — badge ("available for work · 2026") + H1 + paragraph + 2 buttons. "view work" scrolls to `#work`; "get in touch" links to `/contact`.
- `<Stats />` — 4 cards (mobile 2 cols, md 4 cols).
- `<WorkGrid />` — anchor `id="work"`, 4 project cards with soft-accent preview blocks, hover `border-blue-300`. Data in `src/content/seed-projects.ts`. Cards keep `cursor-pointer` styling but are non-clickable for now (no project detail pages yet).
- `<ToolsCard />` — flex-wrap of `Badge` chips.
- `<ContactCTA />` — **trimmed** to a teaser: "Have a project in mind?" + sub copy + "say hello" button → `/contact`. Email input + social icons removed from homepage; they live on `/contact`.

Copy: bake in name "Hieu" and developer tagline. Suggested H1: *"Developer crafting calm, considered interfaces."*

Shadcn used: `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`, `Badge`, `Button`, `Avatar`, `Separator`.

### 5.2 Blogs list (`/blogs`)

- Section header: H2 "writing" left, year-range muted text right (matches SPEC's "selected work" header).
- 1-column vertical stack of post cards (long-form reading lists feel better vertical).
- Each `<PostCard />`: `Card` with `p-5`, hoverable border. Title (text-base, font-medium) · excerpt (text-sm muted, 2-line clamp) · footer row with date + reading time (left) and `Badge variant="outline"` tags (right).
- States:
  - Loading — 3 `Skeleton` post cards.
  - Empty — small muted "No posts yet — check back soon."
  - Error — muted message + "retry" button.
- Card click → `/blogs/:slug`.

### 5.3 Blog detail (`/blogs/:slug`)

- Top: `<Button variant="ghost" size="sm">` "← back to writing" → `/blogs`.
- `<Card>` `p-8`:
  - H1 title (text-3xl, font-medium, `text-blue-950`).
  - Meta row: date · reading time · tags.
  - `Separator my-6`.
  - Markdown body via `react-markdown` + `remark-gfm`. Tailwind `prose` class tuned to blueprint palette: headings `text-blue-950`, links `text-blue-700`.
- Loading — `Skeleton` for title + body lines.
- Not found — small "Post not found" card with link back to `/blogs`.

### 5.4 Contact (`/contact`)

- Single `<Card p-8>`.
- Header: H1 "say hello", muted subtitle "I'll get back within 24h. Booking from June 2026."
- Form fields, vertical stack `gap-4`:
  - `Input` — name (required)
  - `Input` — email (required, type=email, basic format check)
  - `Textarea` — message (required, min 10 chars)
- Submit: primary `Button` "send message" + `ArrowRight`. Disabled while submitting.
- Success: `sonner` toast "Thanks — message received." + form clears.
- Error: toast "Something went wrong. Try again or email me directly."
- Below form: `Separator my-6` + small row "Or reach me at" with 3 outline icon buttons (Mail mailto, Github, Twitter).

### 5.5 404 (`*`)

Single centered `Card`: "This page doesn't exist." + `Button` "back home" → `/`.

## 6. API contract & types

The frontend talks to a single `api` module. Today it returns mocked data; tomorrow it talks to Koa, with no component-side changes.

### Types (`src/lib/types.ts`)

```ts
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;        // full markdown body, only on detail fetch
  publishedAt: string;    // ISO date
  readingMinutes: number;
  tags: string[];
};

export type PostSummary = Omit<Post, 'content'>;

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ApiError = { message: string; status: number };
```

### Public surface (`src/lib/api.ts`)

```ts
export const api = {
  posts: {
    list(): Promise<PostSummary[]>,
    get(slug: string): Promise<Post | null>,
  },
  contact: {
    send(payload: ContactPayload): Promise<{ ok: true }>,
  },
};
```

Each method throws `ApiError` on failure.

### Mock implementation (`src/lib/mock-api.ts`)

- Reads from `src/content/seed-posts.ts` (3–4 seed posts with full markdown bodies).
- Wraps returns in `await new Promise(r => setTimeout(r, 300))` so loading UI is real.
- `posts.get(slug)` returns `null` for unknown slugs (drives the not-found state).
- `contact.send` validates shape and resolves `{ ok: true }`. A flag-gated synthetic-error path lets us test the error toast manually.

### Mock-vs-real switch

`api.ts` reads `import.meta.env.VITE_API_BASE`:
- **Empty/unset** → re-exports the mock module. Default during this phase.
- **Set** (e.g. `http://localhost:4000`) → uses real `fetch` against `${BASE}/api/posts`, `${BASE}/api/posts/:slug`, `${BASE}/api/contact`.

### Backend contract preview (for later Koa work)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/posts` | — | `PostSummary[]` |
| GET | `/api/posts/:slug` | — | `Post` (or 404) |
| POST | `/api/contact` | `ContactPayload` | `{ ok: true }` (or 4xx with `{ message }`) |

## 7. Out of scope this phase

- About page (deliberately skipped; nav link omitted).
- Dark mode (mentioned in SPEC as optional; defer).
- Project detail pages (homepage cards remain non-clickable).
- Real Koa backend, Firebase wiring, deployment (separate phase).
- Admin UI (no `/admin` routes, no auth context). Decided: backend will gate write endpoints with a hardcoded admin credential when Koa+Firebase land in a later phase. No frontend changes needed now.

## 8. Backend phase preview (informational, not in scope)

Recorded so the next phase has continuity, not because anything below is built now.

- **Database:** Firebase (likely Firestore for posts and contact submissions).
- **Admin auth:** hardcoded credentials in env/config — single admin (Hieu). No user signup, no roles. Used to gate writes on `/api/posts`, `/api/posts/:slug` (PUT/DELETE), and reads on contact submissions.
- **Open for next phase, not this one:** whether admin UI lands as a small frontend dashboard or as direct REST/Firebase-console interaction. Reopen the question when starting the backend spec.