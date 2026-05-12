import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/lib/auth-provider';
import AdminPostEditor from '@/routes/admin/post-editor';

// Mock MDEditor to avoid toolbar aria-label conflicts with form labels in jsdom
vi.mock('@uiw/react-md-editor', () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea data-testid="md-editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

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
