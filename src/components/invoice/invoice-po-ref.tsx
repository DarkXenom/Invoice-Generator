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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm">
      <div>
        <span className="font-medium text-gray-600">PO Number:</span>
        <EditableCell value={poReference.poNumber} onChange={(v) => updatePOReference('poNumber', v)} placeholder="PO Number" />
      </div>
      <div>
        <span className="font-medium text-gray-600">PO Date:</span>
        <EditableCell value={poReference.poDate} onChange={(v) => updatePOReference('poDate', v)} type="date" />
      </div>
      <div>
        <span className="font-medium text-gray-600">Delivery Date:</span>
        <EditableCell value={poReference.deliveryDate} onChange={(v) => updatePOReference('deliveryDate', v)} type="date" />
      </div>
      <div>
        <span className="font-medium text-gray-600">Payment Terms:</span>
        <EditableCell value={poReference.paymentTerms} onChange={(v) => updatePOReference('paymentTerms', v)} placeholder="e.g. Net 30" />
      </div>
      <div>
        <span className="font-medium text-gray-600">Transport Mode:</span>
        <EditableCell value={poReference.transportMode} onChange={(v) => updatePOReference('transportMode', v)} placeholder="Road/Rail/Air" />
      </div>
      <div>
        <span className="font-medium text-gray-600">Vehicle No:</span>
        <EditableCell value={poReference.vehicleNumber} onChange={(v) => updatePOReference('vehicleNumber', v)} placeholder="Vehicle Number" />
      </div>
      <div>
        <span className="font-medium text-gray-600">E-Way Bill:</span>
        <EditableCell value={poReference.eWayBillNumber} onChange={(v) => updatePOReference('eWayBillNumber', v)} placeholder="E-Way Bill No." />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Switch checked={reverseCharge} onCheckedChange={setReverseCharge} id="reverse-charge" />
        <Label htmlFor="reverse-charge" className="text-sm cursor-pointer">Reverse Charge</Label>
      </div>
    </div>
  );
}
