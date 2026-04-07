'use client';

import { useEffect, useRef } from 'react';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useDraftsStore } from '@/stores/drafts-store';

export function useAutoSave(enabled = true) {
  const invoice = useInvoiceStore(s => s.invoice);
  const isDirty = useInvoiceStore(s => s.isDirty);
  const markSaved = useInvoiceStore(s => s.markSaved);
  const saveDraft = useDraftsStore(s => s.saveDraft);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !isDirty) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveDraft(invoice);
      markSaved();
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [invoice, isDirty, enabled, saveDraft, markSaved]);
}
