import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blogs from '@/routes/blogs';
import { seedPosts } from '@/content/seed-posts';

function renderBlogs() {
  return render(
    <MemoryRouter>
      <Blogs />
    </MemoryRouter>
  );
}

describe('<Blogs />', () => {
  it('shows a loading state initially', () => {
    renderBlogs();
    expect(screen.getByTestId('blogs-loading')).toBeInTheDocument();
  });

  it('renders a card for every post once loaded', async () => {
    renderBlogs();
    for (const p of seedPosts) {
      await waitFor(() => expect(screen.getByText(p.title)).toBeInTheDocument());
    }
  });
});
