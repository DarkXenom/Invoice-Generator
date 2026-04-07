'use client';

import { Save, FileDown, RotateCcw, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useDraftsStore } from '@/stores/drafts-store';
import { toast } from 'sonner';

interface InvoiceActionsProps {
  onExportPDF: () => void;
}

export function InvoiceActions({ onExportPDF }: InvoiceActionsProps) {
  const invoice = useInvoiceStore(s => s.invoice);
  const isDirty = useInvoiceStore(s => s.isDirty);
  const lastSavedAt = useInvoiceStore(s => s.lastSavedAt);
  const markSaved = useInvoiceStore(s => s.markSaved);
  const resetInvoice = useInvoiceStore(s => s.resetInvoice);
  const saveDraft = useDraftsStore(s => s.saveDraft);

  const handleSave = () => {
    saveDraft(invoice);
    markSaved();
    toast.success('Invoice saved as draft');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset this invoice? All unsaved changes will be lost.')) {
      resetInvoice();
      toast.info('Invoice reset to blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <Button onClick={handleSave} variant="outline" size="sm" className="gap-1.5">
          <Save className="h-3.5 w-3.5" />
          Save Draft
        </Button>
        <Button onClick={onExportPDF} size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
          <FileDown className="h-3.5 w-3.5" />
          Export PDF
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm" className="gap-1.5">
          <Printer className="h-3.5 w-3.5" />
          Print
        </Button>
        <Button onClick={handleReset} variant="ghost" size="sm" className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {isDirty && <Badge variant="outline" className="text-amber-600 border-amber-300">Unsaved changes</Badge>}
        {lastSavedAt && !isDirty && (
          <span className="text-xs text-gray-400">
            Saved {new Date(lastSavedAt).toLocaleTimeString('en-IN')}
          </span>
        )}
      </div>
    </div>
  );
}
