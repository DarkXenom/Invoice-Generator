'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoiceStore } from '@/stores/invoice-store';
import { InvoiceLineItemRow } from './invoice-line-item-row';

export function InvoiceLineItems() {
  const lineItems = useInvoiceStore(s => s.invoice.lineItems);
  const taxMode = useInvoiceStore(s => s.invoice.taxMode);
  const addLineItem = useInvoiceStore(s => s.addLineItem);
  const removeLineItem = useInvoiceStore(s => s.removeLineItem);
  const updateLineItem = useInvoiceStore(s => s.updateLineItem);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 w-10">#</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 min-w-[180px]">Description</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 w-24">HSN/SAC</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-600 w-20">Qty</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 w-20">Unit</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-600 w-24">Rate</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-600 w-20">Disc.</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-600 w-28">Taxable Amt</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 w-20">GST%</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-600 w-24">
                {taxMode === 'intrastate' ? 'CGST/SGST' : 'IGST'}
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-600 w-28">Total</th>
              <th className="px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <InvoiceLineItemRow
                key={item.id}
                item={item}
                index={index}
                taxMode={taxMode}
                onUpdate={updateLineItem}
                onRemove={removeLineItem}
                canRemove={lineItems.length > 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addLineItem}
        className="gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Line Item
      </Button>
    </div>
  );
}
