import { Timestamp } from 'firebase-admin/firestore';
import { ContactRepository, type ContactRecord } from '../repositories/contact.repository.js';
import type { ContactPayload } from '../types.js';

export const ContactService = {
  async submit(payload: ContactPayload, ip: string | null): Promise<void> {
    await ContactRepository.create({
      ...payload,
      createdAt: Timestamp.now(),
      ip,
    });
  },

  list: (): Promise<ContactRecord[]> => ContactRepository.findAllDesc(),
};
