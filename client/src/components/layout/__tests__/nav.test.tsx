import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from '@/components/layout/nav';

function renderNav(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Nav />
    </MemoryRouter>
  );
}

describe('<Nav />', () => {
  it('renders the brand text "hieu.dev" and the logo letter "H"', () => {
    renderNav();
    expect(screen.getByText('hieu.dev')).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
  });

  it('renders three nav links: work, writing, contact', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'work' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'writing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact' })).toBeInTheDocument();
  });

  it('marks the writing link as current when on /blogs', () => {
    renderNav(['/blogs']);
    const writing = screen.getByRole('link', { name: 'writing' });
    expect(writing).toHaveAttribute('aria-current', 'page');
  });
});
