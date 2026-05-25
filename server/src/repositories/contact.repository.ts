import { Timestamp } from 'firebase-admin/firestore';
import { contactCol } from '../lib/firestore.js';
import type { ContactDoc } from '../types.js';

export type ContactRecord = ContactDoc & { id: string };

export const ContactRepository = {
  async create(doc: ContactDoc): Promise<void> {
    await contactCol().add(doc);
  },

  async findAllDesc(): Promise<ContactRecord[]> {
    const snap = await contactCol().orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ContactDoc) }));
  },

  now: () => Timestamp.now(),
};
