import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/lib/auth-provider';
import AdminDashboard from '@/routes/admin/index';

vi.mock('@/lib/api', () => ({
  api: {
    auth: { me: vi.fn(), login: vi.fn(), logout: vi.fn() },
    admin: {
      posts: {
        list: vi.fn(),
        delete: vi.fn(),
      },
    },
  },
}));

import { api } from '@/lib/api';

const samplePosts = [
  {
    slug: 'a',
    title: 'A title',
    excerpt: '',
    publishedAt: '2026-04-01T00:00:00.000Z',
    readingMinutes: 1,
    tags: [],
    status: 'published' as const,
    createdAt: '2026-04-01T00:00:00.000Z',
    updatedAt: '2026-04-02T00:00:00.000Z',
    coverImageUrl: null,
    content: 'x',
  },
  {
    slug: 'b',
    title: 'B title',
    excerpt: '',
    publishedAt: null,
    readingMinutes: 1,
    tags: [],
    status: 'draft' as const,
    createdAt: '2026-04-03T00:00:00.000Z',
    updatedAt: '2026-04-03T00:00:00.000Z',
    coverImageUrl: null,
    content: 'x',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
  (api.admin.posts.list as ReturnType<typeof vi.fn>).mockResolvedValue(samplePosts);
});

function setup() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('<AdminDashboard />', () => {
  it('renders one row per post with title and status', async () => {
    setup();
    await waitFor(() => expect(screen.getByText('A title')).toBeInTheDocument());
    expect(screen.getByText('B title')).toBeInTheDocument();
    expect(screen.getAllByText(/published/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/^draft$/i)).toBeInTheDocument();
  });

  it('delete button calls api.admin.posts.delete after confirmation', async () => {
    (api.admin.posts.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    setup();
    await waitFor(() => screen.getByText('A title'));
    const buttons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(buttons[0]);
    expect(confirmSpy).toHaveBeenCalled();
    expect(api.admin.posts.delete).toHaveBeenCalledWith('a');
  });
});
