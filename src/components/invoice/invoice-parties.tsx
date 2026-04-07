'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { EditableCell } from '@/components/shared/editable-cell';
import { GSTStateSelect } from '@/components/shared/gst-state-select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getStateFromGSTIN } from '@/lib/constants';
import { type Party } from '@/types/invoice';

function PartySection({
  title,
  party,
  onUpdate,
}: {
  title: string;
  party: Party;
  onUpdate: (field: keyof Party, value: string) => void;
}) {
  const handleGSTINChange = (gstin: string) => {
    onUpdate('gstin', gstin);
    if (gstin.length >= 2) {
      const stateInfo = getStateFromGSTIN(gstin);
      if (stateInfo) {
        onUpdate('state', stateInfo.state);
        onUpdate('stateCode', stateInfo.stateCode);
      }
    }
    if (gstin.length >= 12) {
      onUpdate('pan', gstin.substring(2, 12));
    }
  };

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
      <EditableCell value={party.name} onChange={(v) => onUpdate('name', v)} placeholder="Company / Person Name" className="font-semibold" />
      <EditableCell value={party.address} onChange={(v) => onUpdate('address', v)} placeholder="Address" />
      <div className="flex gap-2">
        <EditableCell value={party.city} onChange={(v) => onUpdate('city', v)} placeholder="City" className="flex-1" />
        <EditableCell value={party.pincode} onChange={(v) => onUpdate('pincode', v)} placeholder="PIN" className="w-24" />
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="font-medium text-gray-600 shrink-0">GSTIN:</span>
        <EditableCell value={party.gstin} onChange={handleGSTINChange} placeholder="Enter GSTIN" />
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="font-medium text-gray-600 shrink-0">State:</span>
        <GSTStateSelect
          value={party.stateCode}
          onValueChange={(code, name) => {
            onUpdate('stateCode', code);
            onUpdate('state', name);
          }}
          className="flex-1"
        />
      </div>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-600">Phone:</span>
          <EditableCell value={party.phone} onChange={(v) => onUpdate('phone', v)} placeholder="Phone" />
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-600">Email:</span>
          <EditableCell value={party.email} onChange={(v) => onUpdate('email', v)} placeholder="Email" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceParties() {
  const invoice = useInvoiceStore(s => s.invoice);
  const updateRecipient = useInvoiceStore(s => s.updateRecipient);
  const updateShipTo = useInvoiceStore(s => s.updateShipTo);
  const toggleShipTo = useInvoiceStore(s => s.toggleShipTo);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PartySection title="Bill To" party={invoice.recipient} onUpdate={updateRecipient} />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Switch
              checked={!!invoice.shipTo}
              onCheckedChange={toggleShipTo}
              id="ship-to-toggle"
            />
            <Label htmlFor="ship-to-toggle" className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer">
              Ship To (Different Address)
            </Label>
          </div>
          {invoice.shipTo && (
            <PartySection title="Ship To" party={invoice.shipTo} onUpdate={updateShipTo} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm bg-blue-50/70 rounded-md px-3 py-1.5">
        <span className="font-medium text-blue-800">Tax Mode:</span>
        <span className="font-semibold text-blue-900">
          {invoice.taxMode === 'intrastate' ? 'Intrastate (CGST + SGST)' : 'Interstate (IGST)'}
        </span>
        <span className="text-blue-600 text-xs">
          (Auto-detected from state codes)
        </span>
      </div>
    </div>
  );
}
