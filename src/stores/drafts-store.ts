'use client';

import { create } from 'zustand';
import { type DraftMeta, getDraftsIndex, saveDraft as storageSaveDraft, loadDraft as storageLoadDraft, deleteDraft as storageDeleteDraft } from '@/lib/storage';
import { type Invoice } from '@/types/invoice';

interface DraftsStore {
  drafts: DraftMeta[];
  loadDraftsList: () => void;
  saveDraft: (invoice: Invoice) => string;
  loadDraft: (id: string) => Invoice | null;
  deleteDraft: (id: string) => void;
}

export const useDraftsStore = create<DraftsStore>((set) => ({
  drafts: [],

  loadDraftsList: () => {
    set({ drafts: getDraftsIndex() });
  },

  saveDraft: (invoice) => {
    const id = storageSaveDraft(invoice);
    set({ drafts: getDraftsIndex() });
    return id;
  },

  loadDraft: (id) => {
    return storageLoadDraft(id);
  },

  deleteDraft: (id) => {
    storageDeleteDraft(id);
    set({ drafts: getDraftsIndex() });
  },
}));
