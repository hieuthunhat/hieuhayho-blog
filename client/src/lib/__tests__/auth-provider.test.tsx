import { act, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth-provider';
import { vi, beforeEach } from 'vitest';

vi.mock('@/lib/api', () => {
  return {
    api: {
      auth: {
        me: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
      },
    },
  };
});

import { api } from '@/lib/api';

function Probe() {
  const { isAdmin, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'yes' : 'no'}</span>
      <span data-testid="admin">{isAdmin ? 'yes' : 'no'}</span>
      <button onClick={() => login('a', 'b')}>do-login</button>
      <button onClick={() => logout()}>do-logout</button>
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<AuthProvider />', () => {
  it('starts in loading; resolves to not-admin when /me says no', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(screen.getByTestId('loading').textContent).toBe('yes');
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('no'));
    expect(screen.getByTestId('admin').textContent).toBe('no');
  });

  it('resolves to admin when /me says yes', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('yes'));
  });

  it('flips to admin after login()', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: false });
    (api.auth.login as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('no'));
    await act(async () => {
      screen.getByText('do-login').click();
    });
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('yes'));
  });

  it('flips back after logout()', async () => {
    (api.auth.me as ReturnType<typeof vi.fn>).mockResolvedValue({ admin: true });
    (api.auth.logout as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('yes'));
    await act(async () => {
      screen.getByText('do-logout').click();
    });
    await waitFor(() => expect(screen.getByTestId('admin').textContent).toBe('no'));
  });
});
