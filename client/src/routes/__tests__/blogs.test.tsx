import { vi, beforeEach } from 'vitest';

vi.mock('@/lib/api', () => ({
  api: {
    posts: { list: vi.fn(), get: vi.fn() },
    contact: { send: vi.fn() },
  },
}));

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blogs from '@/routes/blogs';
import { api } from '@/lib/api';
import type { PostSummary } from '@/lib/types';

const samplePosts: PostSummary[] = [
  {
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
  },
  {
    slug: 'shipping-small',
    title: 'Shipping small, often',
    excerpt: 'A note on cadence over scope.',
    publishedAt: '2026-03-02',
    readingMinutes: 3,
    tags: ['process'],
    status: 'published',
    createdAt: '2026-03-02T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
    coverImageUrl: null,
  },
];

function renderBlogs() {
  return render(
    <MemoryRouter>
      <Blogs />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  (api.posts.list as ReturnType<typeof vi.fn>).mockResolvedValue(samplePosts);
});

describe('<Blogs />', () => {
  it('shows a loading state initially', () => {
    renderBlogs();
    expect(screen.getByTestId('blogs-loading')).toBeInTheDocument();
  });

  it('renders a card for every post once loaded', async () => {
    renderBlogs();
    for (const p of samplePosts) {
      await waitFor(() => expect(screen.getByText(p.title)).toBeInTheDocument());
    }
  });
});
