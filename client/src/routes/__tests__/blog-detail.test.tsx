import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogDetail from '@/routes/blog-detail';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blogs/:slug" element={<BlogDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('<BlogDetail />', () => {
  it('renders the post title and markdown body when slug exists', async () => {
    renderAt('/blogs/calm-interfaces');
    await waitFor(() =>
      expect(screen.getAllByText('On building calm interfaces').length).toBeGreaterThan(0)
    );
    expect(screen.getByText(/Fewer colors/)).toBeInTheDocument();
  });

  it('renders a not-found state when slug does not exist', async () => {
    renderAt('/blogs/nope');
    await waitFor(() => expect(screen.getByText(/Post not found/i)).toBeInTheDocument());
  });
});
