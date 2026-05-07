import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, GitBranch, Mail, Send } from 'lucide-react';
import { api } from '@/lib/api';
import type { ApiError } from '@/lib/types';

type FormState = { name: string; email: string; message: string };
const empty: FormState = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 10) {
      setError(
        'Please fill in all fields. Message must be at least 10 characters.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await api.contact.send(form);
      toast.success('Thanks — message received.');
      setForm(empty);
    } catch (err) {
      const msg = (err as ApiError).message ?? 'Something went wrong.';
      toast.error(`${msg} Try again or email me directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <h1 className="text-3xl font-medium text-blue-950">say hello</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          I'll get back within 24h. Booking from June 2026.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-blue-950">
              name
            </label>
            <Input
              id="name"
              value={form.name}
              onChange={update('name')}
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-blue-950">
              email
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-blue-950">
              message
            </label>
            <Textarea
              id="message"
              value={form.message}
              onChange={update('message')}
              rows={6}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-700 hover:bg-blue-800"
            >
              {submitting ? 'sending…' : 'send message'}
              {!submitting && <ArrowRight className="ml-1.5 h-4 w-4" />}
            </Button>
          </div>
        </form>

        <Separator className="my-6" />

        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">Or reach me at</p>
          <Button asChild variant="outline" size="icon" aria-label="send mail">
            <a href="mailto:hi@hieu.dev">
              <Mail className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="github profile">
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              <GitBranch className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="twitter profile">
            <a href="https://twitter.com/" target="_blank" rel="noreferrer">
              <Send className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
