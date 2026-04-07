'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { Textarea } from '@/components/ui/textarea';

export function InvoiceTerms() {
  const terms = useInvoiceStore(s => s.invoice.terms);
  const notes = useInvoiceStore(s => s.invoice.notes);
  const updateTerms = useInvoiceStore(s => s.updateTerms);
  const updateNotes = useInvoiceStore(s => s.updateNotes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Terms & Conditions
        </h4>
        <Textarea
          value={terms}
          onChange={(e) => updateTerms(e.target.value)}
          placeholder="Enter terms and conditions..."
          className="text-xs min-h-[80px] resize-y"
          rows={4}
        />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Notes / Remarks
        </h4>
        <Textarea
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder="Any additional notes..."
          className="text-xs min-h-[80px] resize-y"
          rows={4}
        />
      </div>
    </div>
  );
}
