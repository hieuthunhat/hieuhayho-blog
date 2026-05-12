import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach } from 'vitest';
import ImageUploader from '@/components/admin/image-uploader';

vi.mock('@/lib/api', () => ({
  api: { admin: { uploads: { create: vi.fn() } } },
}));

import { api } from '@/lib/api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<ImageUploader />', () => {
  it('calls onUploaded with returned url after successful upload', async () => {
    (api.admin.uploads.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      url: 'https://res.cloudinary.com/x/y.jpg',
      publicId: 'x/y',
    });
    const onUploaded = vi.fn();
    const user = userEvent.setup();
    render(<ImageUploader onUploaded={onUploaded} label="Upload cover" />);
    const input = screen.getByLabelText(/upload cover/i) as HTMLInputElement;
    const file = new File([new Uint8Array([0xff])], 'x.jpg', { type: 'image/jpeg' });
    await user.upload(input, file);
    await waitFor(() =>
      expect(onUploaded).toHaveBeenCalledWith('https://res.cloudinary.com/x/y.jpg')
    );
  });
});
