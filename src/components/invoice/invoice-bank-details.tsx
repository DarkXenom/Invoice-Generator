'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { EditableCell } from '@/components/shared/editable-cell';

export function InvoiceBankDetails() {
  const bankDetails = useInvoiceStore(s => s.invoice.bankDetails);
  const updateBankDetails = useInvoiceStore(s => s.updateBankDetails);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Bank Details
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Bank:</span>
          <EditableCell
            value={bankDetails.bankName}
            onChange={(v) => updateBankDetails('bankName', v)}
            placeholder="Bank Name"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">A/C No:</span>
          <EditableCell
            value={bankDetails.accountNumber}
            onChange={(v) => updateBankDetails('accountNumber', v)}
            placeholder="Account Number"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">IFSC:</span>
          <EditableCell
            value={bankDetails.ifscCode}
            onChange={(v) => updateBankDetails('ifscCode', v)}
            placeholder="IFSC Code"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Branch:</span>
          <EditableCell
            value={bankDetails.branchName}
            onChange={(v) => updateBankDetails('branchName', v)}
            placeholder="Branch Name"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Type:</span>
          <EditableCell
            value={bankDetails.accountType}
            onChange={(v) => updateBankDetails('accountType', v)}
            placeholder="Current / Savings"
          />
        </div>
      </div>
    </div>
  );
}
