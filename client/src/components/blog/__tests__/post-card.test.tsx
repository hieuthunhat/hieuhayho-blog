import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostCard from '@/components/blog/post-card';
import type { PostSummary } from '@/lib/types';

const sample: PostSummary = {
  slug: 'hello',
  title: 'Hello world',
  excerpt: 'A first post.',
  publishedAt: '2026-04-01',
  readingMinutes: 3,
  tags: ['intro', 'meta'],
};

function renderCard() {
  return render(
    <MemoryRouter>
      <PostCard post={sample} />
    </MemoryRouter>
  );
}

describe('<PostCard />', () => {
  it('renders title, excerpt, date, reading time, and tags', () => {
    renderCard();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('A first post.')).toBeInTheDocument();
    expect(screen.getByText(/3 min read/)).toBeInTheDocument();
    expect(screen.getByText('intro')).toBeInTheDocument();
    expect(screen.getByText('meta')).toBeInTheDocument();
  });

  it('links to /blogs/<slug>', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /Hello world/i });
    expect(link).toHaveAttribute('href', '/blogs/hello');
  });
});
