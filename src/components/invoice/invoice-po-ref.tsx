'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { EditableCell } from '@/components/shared/editable-cell';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function InvoicePORef() {
  const poReference = useInvoiceStore(s => s.invoice.poReference);
  const reverseCharge = useInvoiceStore(s => s.invoice.reverseCharge);
  const updatePOReference = useInvoiceStore(s => s.updatePOReference);
  const setReverseCharge = useInvoiceStore(s => s.setReverseCharge);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Purchase Order / Supply Details
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">PO No:</span>
          <EditableCell
            value={poReference.poNumber}
            onChange={(v) => updatePOReference('poNumber', v)}
            placeholder="PO Number"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">PO Date:</span>
          <EditableCell
            value={poReference.poDate}
            onChange={(v) => updatePOReference('poDate', v)}
            type="date"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Delivery Date:</span>
          <EditableCell
            value={poReference.deliveryDate}
            onChange={(v) => updatePOReference('deliveryDate', v)}
            type="date"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Payment Terms:</span>
          <EditableCell
            value={poReference.paymentTerms}
            onChange={(v) => updatePOReference('paymentTerms', v)}
            placeholder="e.g. 30 Days"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Transport:</span>
          <EditableCell
            value={poReference.transportMode}
            onChange={(v) => updatePOReference('transportMode', v)}
            placeholder="Road / Rail / Air"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Vehicle No:</span>
          <EditableCell
            value={poReference.vehicleNumber}
            onChange={(v) => updatePOReference('vehicleNumber', v)}
            placeholder="Vehicle Number"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-600 shrink-0">E-Way Bill:</span>
          <EditableCell
            value={poReference.eWayBillNumber}
            onChange={(v) => updatePOReference('eWayBillNumber', v)}
            placeholder="E-Way Bill No."
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-600 shrink-0">Reverse Charge:</span>
          <Switch
            checked={reverseCharge}
            onCheckedChange={setReverseCharge}
            id="reverse-charge"
          />
          <Label htmlFor="reverse-charge" className="text-xs text-gray-500">
            {reverseCharge ? 'Yes' : 'No'}
          </Label>
        </div>
      </div>
    </div>
  );
}
