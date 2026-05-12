import { vi, beforeEach } from 'vitest';

vi.mock('@/lib/api', () => ({
  api: {
    posts: { list: vi.fn(), get: vi.fn() },
    contact: { send: vi.fn() },
  },
}));

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogDetail from '@/routes/blog-detail';
import { api } from '@/lib/api';
import type { Post } from '@/lib/types';

const samplePost: Post = {
  slug: 'calm-interfaces',
  title: 'On building calm interfaces',
  excerpt: 'Why subtraction is the most underrated tool in interface design.',
  publishedAt: '2026-04-12',
  readingMinutes: 4,
  tags: ['design', 'craft'],
  status: 'published',
  createdAt: '2026-04-12T00:00:00Z',
  updatedAt: '2026-04-12T00:00:00Z',
  coverImageUrl: null,
  content: `# On building calm interfaces

The best interfaces ask less of you.

## A short list

- Fewer colors
- Fewer animations`,
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blogs/:slug" element={<BlogDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<BlogDetail />', () => {
  it('renders the post title and markdown body when slug exists', async () => {
    (api.posts.get as ReturnType<typeof vi.fn>).mockResolvedValue(samplePost);
    renderAt('/blogs/calm-interfaces');
    await waitFor(() =>
      expect(screen.getAllByText('On building calm interfaces').length).toBeGreaterThan(0)
    );
    expect(screen.getByText(/Fewer colors/)).toBeInTheDocument();
  });

  it('renders a not-found state when slug does not exist', async () => {
    (api.posts.get as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    renderAt('/blogs/nope');
    await waitFor(() => expect(screen.getByText(/Post not found/i)).toBeInTheDocument());
  });
});
