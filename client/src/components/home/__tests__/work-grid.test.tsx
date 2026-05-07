import { render, screen } from '@testing-library/react';
import WorkGrid from '@/components/home/work-grid';
import { seedProjects } from '@/content/seed-projects';

describe('<WorkGrid />', () => {
  it('renders a card for each seed project', () => {
    render(<WorkGrid />);
    seedProjects.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getByText(p.type)).toBeInTheDocument();
    });
  });

  it('exposes an anchor target for in-page nav (id="work")', () => {
    const { container } = render(<WorkGrid />);
    expect(container.querySelector('#work')).not.toBeNull();
  });

  it('renders all tags as Badges', () => {
    render(<WorkGrid />);
    seedProjects.forEach((p) => {
      p.tags.forEach((tag) => {
        expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
      });
    });
  });
});
