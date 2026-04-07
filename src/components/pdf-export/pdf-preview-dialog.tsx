'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Invoice, type TaxBreakdown } from '@/types/invoice';
import { InvoicePDFDocument } from './invoice-pdf-document';
import { toast } from 'sonner';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div> }
);

interface PDFPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  totals: TaxBreakdown;
}

export function PDFPreviewDialog({ open, onClose, invoice, totals }: PDFPreviewDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const document = useMemo(
    () => <InvoicePDFDocument invoice={invoice} totals={totals} />,
    [invoice, totals]
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await pdf(document).toBlob();
      const filename = `Invoice_${invoice.invoiceNumber.replace(/\//g, '-') || 'draft'}.pdf`;
      saveAs(blob, filename);
      toast.success(`PDF downloaded: ${filename}`);
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="sm"
                className="gap-1.5 bg-blue-600 hover:bg-blue-700"
              >
                {isDownloading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 px-4 pb-4 min-h-0">
          <div className="h-full border rounded-lg overflow-hidden bg-gray-200">
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              {document}
            </PDFViewer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
