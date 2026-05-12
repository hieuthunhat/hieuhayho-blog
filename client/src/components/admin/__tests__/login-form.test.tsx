import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/lib/auth-provider';
import AdminLogin from '@/routes/admin/login';

vi.mock('@/lib/api', () => ({
  api: { auth: { me: vi.fn(), login: vi.fn(), logout: vi.fn() } },
}));

import { api } from '@/lib/api';

function App({ initial = '/admin/login' }: { initial?: string }) {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<div data-testid="dash">dash</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
});

describe('<AdminLogin />', () => {
  it('renders email + password fields and a submit button', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows an inline error on 401', async () => {
    (api.auth.login as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Invalid credentials',
      status: 401,
    });
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  it('navigates to /admin on success (no `from`)', async () => {
    (api.auth.login as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'good');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByTestId('dash')).toBeInTheDocument());
  });
});
