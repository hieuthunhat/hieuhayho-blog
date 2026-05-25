import { db, postsCol } from '../lib/firestore.js';
import { httpError } from '../lib/http-error.js';
import type { PostDoc } from '../types.js';

export const PostsRepository = {
  async findPublished(): Promise<PostDoc[]> {
    const snap = await postsCol()
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .get();
    return snap.docs.map((d) => d.data() as PostDoc);
  },

  async findAll(): Promise<PostDoc[]> {
    const snap = await postsCol().orderBy('updatedAt', 'desc').get();
    return snap.docs.map((d) => d.data() as PostDoc);
  },

  async findBySlug(slug: string): Promise<PostDoc | null> {
    const snap = await postsCol().doc(slug).get();
    return snap.exists ? (snap.data() as PostDoc) : null;
  },

  async createUnique(doc: PostDoc): Promise<void> {
    const ref = postsCol().doc(doc.slug);
    await db.runTransaction(async (tx) => {
      const existing = await tx.get(ref);
      if (existing.exists) {
        throw httpError(409, 'Slug already used');
      }
      tx.set(ref, doc);
    });
  },

  async updateInTransaction(
    oldSlug: string,
    apply: (prev: PostDoc) => { next: PostDoc; newSlug: string }
  ): Promise<PostDoc> {
    return db.runTransaction(async (tx) => {
      const oldRef = postsCol().doc(oldSlug);
      const oldSnap = await tx.get(oldRef);
      if (!oldSnap.exists) {
        throw httpError(404, 'Post not found');
      }
      const prev = oldSnap.data() as PostDoc;
      const { next, newSlug } = apply(prev);

      if (newSlug !== oldSlug) {
        const newRef = postsCol().doc(newSlug);
        const newSnap = await tx.get(newRef);
        if (newSnap.exists) {
          throw httpError(409, 'Slug already used');
        }
        tx.set(newRef, next);
        tx.delete(oldRef);
      } else {
        tx.set(oldRef, next);
      }
      return next;
    });
  },

  async deleteBySlug(slug: string): Promise<void> {
    await postsCol().doc(slug).delete();
  },
};
