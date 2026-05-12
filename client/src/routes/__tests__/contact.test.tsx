import { vi, beforeEach } from 'vitest';

vi.mock('@/lib/api', () => ({
  api: {
    posts: { list: vi.fn(), get: vi.fn() },
    contact: { send: vi.fn() },
  },
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Contact from '@/routes/contact';
import { api } from '@/lib/api';

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  (api.contact.send as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
});

describe('<Contact />', () => {
  it('renders the form fields', () => {
    renderContact();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows a validation message when submitting an empty form', async () => {
    const user = userEvent.setup();
    renderContact();
    await user.click(screen.getByRole('button', { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    );
  });

  it('clears the form after a successful submit', async () => {
    const user = userEvent.setup();
    renderContact();
    await user.type(screen.getByLabelText(/name/i), 'Hieu');
    await user.type(screen.getByLabelText(/email/i), 'hi@hieu.dev');
    await user.type(
      screen.getByLabelText(/message/i),
      'This is a test message that is long enough.'
    );
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() =>
      expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('')
    );
  });
});
