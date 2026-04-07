'use client';

import { useCallback, useState } from 'react';
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

interface InvoiceEditorProps {
  onExportPDF: () => void;
}

export function InvoiceEditor({ onExportPDF }: InvoiceEditorProps) {
  useAutoSave(true);

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <Card>
        <CardContent className="py-3 px-4">
          <InvoiceActions onExportPDF={onExportPDF} />
        </CardContent>
      </Card>

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
