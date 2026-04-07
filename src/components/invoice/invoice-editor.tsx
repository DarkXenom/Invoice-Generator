'use client';

import { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InvoiceHeader } from './invoice-header';
import { InvoiceParties } from './invoice-parties';
import { InvoicePORef } from './invoice-po-ref';
import { InvoiceLineItems } from './invoice-line-items';
import { InvoiceSummary } from './invoice-summary';
import { InvoiceBankDetails } from './invoice-bank-details';
import { InvoiceTerms } from './invoice-terms';
import { InvoiceSignature } from './invoice-signature';
import { InvoiceActions } from './invoice-actions';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useDraftsStore } from '@/stores/drafts-store';
import { toast } from 'sonner';

interface InvoiceEditorProps {
  onExportPDF: () => void;
}

export function InvoiceEditor({ onExportPDF }: InvoiceEditorProps) {
  useAutoSave(true);

  const invoice = useInvoiceStore(s => s.invoice);
  const markSaved = useInvoiceStore(s => s.markSaved);
  const saveDraft = useDraftsStore(s => s.saveDraft);

  const handleSave = useCallback(() => {
    saveDraft(invoice);
    markSaved();
    toast.success('Invoice saved (Ctrl+S)');
  }, [invoice, markSaved, saveDraft]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  useKeyboardShortcuts({
    onSave: handleSave,
    onExportPDF,
    onPrint: handlePrint,
  });

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <Card>
        <CardContent className="py-3 px-4">
          <InvoiceActions onExportPDF={onExportPDF} />
        </CardContent>
      </Card>

      {/* Keyboard shortcuts hint */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400">
        <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] border">Ctrl+S</kbd> Save</span>
        <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] border">Ctrl+E</kbd> Export PDF</span>
        <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] border">Ctrl+P</kbd> Print</span>
      </div>

      {/* Invoice Body */}
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-5">
          {/* Header: Company + Invoice # */}
          <InvoiceHeader />

          <Separator />

          {/* Bill To / Ship To */}
          <InvoiceParties />

          <Separator />

          {/* PO Reference & Supply Details */}
          <InvoicePORef />

          <Separator />

          {/* Line Items Table */}
          <InvoiceLineItems />

          {/* Totals & Tax Summary */}
          <InvoiceSummary />

          <Separator />

          {/* Bank Details */}
          <InvoiceBankDetails />

          <Separator />

          {/* Terms & Notes */}
          <InvoiceTerms />

          <Separator />

          {/* Signature & Stamp */}
          <InvoiceSignature />
        </CardContent>
      </Card>
    </div>
  );
}
