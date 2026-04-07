'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { EditableCell } from '@/components/shared/editable-cell';
import { ImageUpload } from '@/components/shared/image-upload';
import { Separator } from '@/components/ui/separator';

export function InvoiceHeader() {
  const invoice = useInvoiceStore(s => s.invoice);
  const updateHeader = useInvoiceStore(s => s.updateHeader);
  const updateSupplier = useInvoiceStore(s => s.updateSupplier);
  const setLogo = useInvoiceStore(s => s.setLogo);

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-lg font-bold tracking-wide text-gray-900">TAX INVOICE</h2>
      </div>
      <Separator />
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
        <div className="space-y-1">
          <ImageUpload
            value={invoice.logoUrl}
            onChange={setLogo}
            label="Upload Company Logo"
            className="mb-2"
          />
          <h3 className="font-bold text-base text-blue-900">
            <EditableCell
              value={invoice.supplier.name}
              onChange={(v) => updateSupplier('name', v)}
              placeholder="Company Name"
              className="font-bold text-base text-blue-900"
            />
          </h3>
          <EditableCell value={invoice.supplier.address} onChange={(v) => updateSupplier('address', v)} placeholder="Address" />
          <div className="flex gap-2">
            <EditableCell value={invoice.supplier.city} onChange={(v) => updateSupplier('city', v)} placeholder="City" className="flex-1" />
            <EditableCell value={invoice.supplier.pincode} onChange={(v) => updateSupplier('pincode', v)} placeholder="PIN" className="w-24" />
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-600">GSTIN: </span>
            <EditableCell value={invoice.supplier.gstin} onChange={(v) => updateSupplier('gstin', v)} placeholder="Enter GSTIN" className="inline-flex" />
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Phone: </span>
              <EditableCell value={invoice.supplier.phone} onChange={(v) => updateSupplier('phone', v)} placeholder="Phone" className="inline-flex" />
            </div>
            <div>
              <span className="font-medium text-gray-600">Email: </span>
              <EditableCell value={invoice.supplier.email} onChange={(v) => updateSupplier('email', v)} placeholder="Email" className="inline-flex" />
            </div>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className="space-y-2">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-center">
            <span className="text-sm font-medium text-gray-600">Invoice No:</span>
            <EditableCell
              value={invoice.invoiceNumber}
              onChange={(v) => updateHeader('invoiceNumber', v)}
              placeholder="Invoice Number"
              className="font-semibold"
            />
            <span className="text-sm font-medium text-gray-600">Date:</span>
            <EditableCell
              value={invoice.invoiceDate}
              onChange={(v) => updateHeader('invoiceDate', v)}
              type="date"
            />
            <span className="text-sm font-medium text-gray-600">State:</span>
            <EditableCell value={invoice.supplier.state} onChange={(v) => updateSupplier('state', v)} placeholder="State" />
            <span className="text-sm font-medium text-gray-600">State Code:</span>
            <EditableCell value={invoice.supplier.stateCode} onChange={(v) => updateSupplier('stateCode', v)} placeholder="Code" />
            <span className="text-sm font-medium text-gray-600">PAN:</span>
            <EditableCell value={invoice.supplier.pan} onChange={(v) => updateSupplier('pan', v)} placeholder="PAN Number" />
          </div>
        </div>
      </div>
    </div>
  );
}
