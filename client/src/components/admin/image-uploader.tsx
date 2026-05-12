import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type Props = {
  label: string;
  onUploaded: (url: string) => void;
};

export default function ImageUploader({ label, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const r = await api.admin.uploads.create(file);
      onUploaded(r.url);
    } catch (err) {
      toast.error((err as { message?: string }).message ?? 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-blue-50">
      <span>{busy ? 'uploading…' : label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label={label}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
