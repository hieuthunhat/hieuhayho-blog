import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import RequireAdmin from '@/components/admin/require-admin';
import { AuthProvider } from '@/lib/auth-provider';

vi.mock('@/lib/api', () => ({
  api: {
    auth: {
      me: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    },
  },
}));

import { api } from '@/lib/api';

function App({ initialPath }: { initialPath: string }) {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <div data-testid="protected">secret</div>
              </RequireAdmin>
            }
          />
          <Route path="/admin/login" element={<div data-testid="login">login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<RequireAdmin />', () => {
  it('redirects to /admin/login when not admin', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
    render(<App initialPath="/admin" />);
    await waitFor(() => expect(screen.getByTestId('login')).toBeInTheDocument());
  });

  it('renders children when admin', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
    render(<App initialPath="/admin" />);
    await waitFor(() => expect(screen.getByTestId('protected')).toBeInTheDocument());
  });
});
