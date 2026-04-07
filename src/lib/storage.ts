import { type Invoice } from '@/types/invoice';
import { type AppSettings } from '@/types/settings';
import { DEFAULT_SETTINGS } from './constants';

const KEYS = {
  settings: 'omega_settings',
  draftsIndex: 'omega_drafts_index',
  draftPrefix: 'omega_draft_',
} as const;

export interface DraftMeta {
  id: string;
  invoiceNumber: string;
  recipientName: string;
  createdAt: string;
  updatedAt: string;
  grandTotal: number;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
}

export function getSettings(): AppSettings {
  return safeGet(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  safeSet(KEYS.settings, settings);
}

export function getDraftsIndex(): DraftMeta[] {
  return safeGet(KEYS.draftsIndex, []);
}

export function saveDraft(invoice: Invoice): string {
  const index = getDraftsIndex();
  const existing = index.findIndex(d => d.id === invoice.id);

  const meta: DraftMeta = {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    recipientName: invoice.recipient.name,
    createdAt: existing >= 0 ? index[existing].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    grandTotal: invoice.lineItems.reduce((sum, item) => sum + item.totalAmount, 0),
  };

  if (existing >= 0) {
    index[existing] = meta;
  } else {
    index.unshift(meta);
  }

  safeSet(KEYS.draftsIndex, index);
  safeSet(KEYS.draftPrefix + invoice.id, invoice);

  return invoice.id;
}

export function loadDraft(id: string): Invoice | null {
  return safeGet<Invoice | null>(KEYS.draftPrefix + id, null);
}

export function deleteDraft(id: string): void {
  const index = getDraftsIndex().filter(d => d.id !== id);
  safeSet(KEYS.draftsIndex, index);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEYS.draftPrefix + id);
  }
}
