import 'dotenv/config';
import { Timestamp } from 'firebase-admin/firestore';
import { postsCol } from '../lib/firestore.js';
import { readingMinutes } from '../lib/reading-time.js';
import type { PostDoc } from '../types.js';

const seedPosts = [
  {
    slug: 'calm-interfaces',
    title: 'On building calm interfaces',
    excerpt: 'Why subtraction is the most underrated tool in interface design.',
    publishedAt: '2026-04-12',
    tags: ['design', 'craft'],
    content: `# On building calm interfaces

The best interfaces ask less of you. They reveal what matters,
hide what doesn't, and trust that you'll find your way.

## A short list

- Fewer colors
- Fewer animations
- Fewer modes

When in doubt, remove a thing.`,
  },
  {
    slug: 'shipping-small',
    title: 'Shipping small, often',
    excerpt: 'A note on cadence over scope.',
    publishedAt: '2026-03-02',
    tags: ['process'],
    content: `# Shipping small, often

Big releases are mostly an accounting trick. Real progress
compounds in small daily moves.`,
  },
  {
    slug: 'blueprint-aesthetic',
    title: 'The blueprint aesthetic',
    excerpt: 'Dot grids, blue ink, and why technical drawings still feel modern.',
    publishedAt: '2026-02-18',
    tags: ['design', 'aesthetics'],
    content: `# The blueprint aesthetic

Engineering drawings have a quiet confidence: nothing decorative,
everything load-bearing. That feels relevant again.`,
  },
  {
    slug: 'koa-notes',
    title: 'Koa notes — small server, big mileage',
    excerpt: 'Why Koa keeps showing up in my side projects.',
    publishedAt: '2026-01-09',
    tags: ['backend', 'node'],
    content: `# Koa notes

Koa is small enough to read in a sitting and gives you exactly
the seams you need. Most "frameworks" hide too much.`,
  },
];

async function main() {
  for (const p of seedPosts) {
    const publishedAt = Timestamp.fromDate(new Date(p.publishedAt));
    const doc: PostDoc = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags,
      status: 'published',
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      readingMinutes: readingMinutes(p.content),
      coverImageUrl: null,
    };
    await postsCol().doc(p.slug).set(doc);
    // eslint-disable-next-line no-console
    console.log(`seeded ${p.slug}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
