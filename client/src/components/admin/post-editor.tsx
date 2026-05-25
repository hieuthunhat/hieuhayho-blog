import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import MDEditor from '@uiw/react-md-editor';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploader from '@/components/admin/image-uploader';
import { api } from '@/lib/api';
import type { Post, PostInput, PostStatus } from '@/lib/types';

const toSlug = (s: string) => slugify(s, { lower: true, strict: true, trim: true });

export type Props = { mode: 'new'; initial?: undefined } | { mode: 'edit'; initial: Post };

export default function PostEditor(props: Props) {
  const nav = useNavigate();
  const seed: Post | null = props.mode === 'edit' ? props.initial : null;

  const [title, setTitle] = useState(seed?.title ?? '');
  const [slug, setSlug] = useState(seed?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(props.mode === 'edit');
  const [excerpt, setExcerpt] = useState(seed?.excerpt ?? '');
  const [content, setContent] = useState(seed?.content ?? '');
  const [tagsRaw, setTagsRaw] = useState((seed?.tags ?? []).join(', '));
  const [status, setStatus] = useState<PostStatus>(seed?.status ?? 'draft');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(seed?.coverImageUrl ?? null);
  const [submitting, setSubmitting] = useState(false);
  const editorWrapRef = useRef<HTMLDivElement>(null);

  const insertImageMarkdown = (url: string) => {
    const md = `![](${url})`;
    const ta = editorWrapRef.current?.querySelector('textarea');
    if (!ta) {
      setContent((c) => (c ? `${c}\n\n${md}\n` : `${md}\n`));
      return;
    }
    const start = ta.selectionStart ?? content.length;
    const end = ta.selectionEnd ?? content.length;
    const next = content.slice(0, start) + md + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + md.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  // auto-derive slug from title until the slug field is touched
  useEffect(() => {
    if (!slugTouched) setSlug(toSlug(title));
  }, [title, slugTouched]);

  const buildInput = (): PostInput => ({
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt.trim(),
    content,
    tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
    status,
    coverImageUrl,
  });

  const save = async () => {
    setSubmitting(true);
    try {
      let saved;
      if (props.mode === 'new') {
        saved = await api.admin.posts.create(buildInput());
        toast.success('Post created');
        nav(`/admin/posts/${saved.slug}/edit`, { replace: true });
      } else {
        saved = await api.admin.posts.update(seed!.slug, buildInput());
        toast.success('Saved');
        if (saved.slug !== seed!.slug) {
          nav(`/admin/posts/${saved.slug}/edit`, { replace: true });
        }
      }
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (props.mode !== 'edit') return;
    if (!window.confirm(`Delete "${seed!.slug}"?`)) return;
    try {
      await api.admin.posts.delete(seed!.slug);
      toast.success('Deleted');
      nav('/admin', { replace: true });
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-blue-950">title</label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex w-64 flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-blue-950">slug</label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-blue-950">status</label>
          <div className="flex rounded-md border bg-white">
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={status === 'draft' ? 'bg-blue-50 px-3 py-1.5 text-sm' : 'px-3 py-1.5 text-sm'}
            >
              draft
            </button>
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={status === 'published' ? 'bg-blue-700 px-3 py-1.5 text-sm text-white' : 'px-3 py-1.5 text-sm'}
            >
              published
            </button>
          </div>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4" data-color-mode="light">
          <div className="mb-2 flex justify-end">
            <ImageUploader
              label="insert image"
              onUploaded={(u) => insertImageMarkdown(u)}
            />
          </div>
          <div ref={editorWrapRef}>
            <MDEditor value={content} onChange={(v) => setContent(v ?? '')} height={420} preview="edit" />
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className="text-sm font-medium text-blue-950">excerpt</label>
          <Textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tags" className="text-sm font-medium text-blue-950">tags</label>
          <Input id="tags" placeholder="comma, separated" value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)} />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <label className="text-sm font-medium text-blue-950">cover image</label>
        <div className="flex items-center gap-3">
          {coverImageUrl ? (
            <img src={coverImageUrl} alt="" className="h-16 w-24 rounded object-cover" />
          ) : (
            <div className="h-16 w-24 rounded border border-dashed bg-blue-50/40" />
          )}
          <ImageUploader label="upload cover" onUploaded={(u) => setCoverImageUrl(u)} />
          {coverImageUrl && (
            <Button variant="outline" size="sm" onClick={() => setCoverImageUrl(null)}>
              remove
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={save} disabled={submitting} className="bg-blue-700 hover:bg-blue-800">
          {submitting ? 'saving…' : 'save'}
        </Button>
        {props.mode === 'edit' && (
          <Button variant="outline" onClick={remove}>
            delete
          </Button>
        )}
      </div>
    </div>
  );
}
