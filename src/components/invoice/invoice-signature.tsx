'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { ImageUpload } from '@/components/shared/image-upload';

export function InvoiceSignature() {
  const invoice = useInvoiceStore(s => s.invoice);
  const setSignature = useInvoiceStore(s => s.setSignature);
  const setStamp = useInvoiceStore(s => s.setStamp);

  return (
    <div className="flex justify-end">
      <div className="text-center space-y-2 min-w-[200px]">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          For {invoice.supplier.name || 'OMEGA EQUIPMENT AND PROJECTS'}
        </p>

        <div className="flex gap-4 justify-center">
          <div className="space-y-1">
            <ImageUpload
              value={invoice.signatureUrl}
              onChange={setSignature}
              label="Signature"
              className="min-w-[120px]"
            />
            <p className="text-[10px] text-gray-400">Authorized Signatory</p>
          </div>
          <div className="space-y-1">
            <ImageUpload
              value={invoice.stampUrl}
              onChange={setStamp}
              label="Company Stamp"
              className="min-w-[120px]"
            />
            <p className="text-[10px] text-gray-400">Company Seal/Stamp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
