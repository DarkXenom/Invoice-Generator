'use client';

import { useMemo } from 'react';
import { useInvoiceStore } from '@/stores/invoice-store';
import { calculateInvoiceTotals } from '@/lib/tax-calculator';
import { type TaxBreakdown } from '@/types/invoice';

export function useInvoiceTotals(): TaxBreakdown {
  const lineItems = useInvoiceStore(s => s.invoice.lineItems);
  const taxMode = useInvoiceStore(s => s.invoice.taxMode);

  return useMemo(
    () => calculateInvoiceTotals(lineItems, taxMode),
    [lineItems, taxMode]
  );
}
