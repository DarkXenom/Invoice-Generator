'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { InvoiceLineItemRow } from './invoice-line-item-row';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatINR } from '@/lib/constants';

export function InvoiceLineItems() {
  const invoice = useInvoiceStore(s => s.invoice);
  const addLineItem = useInvoiceStore(s => s.addLineItem);
  const isIntrastate = invoice.taxMode === 'intrastate';

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-2 py-2 text-center w-10">S.No</th>
              <th className="border px-2 py-2 text-left min-w-[200px]">Description</th>
              <th className="border px-2 py-2 text-center w-24">HSN/SAC</th>
              <th className="border px-2 py-2 text-center w-16">Qty</th>
              <th className="border px-2 py-2 text-center w-16">Unit</th>
              <th className="border px-2 py-2 text-right w-24">Rate</th>
              <th className="border px-2 py-2 text-right w-24">Taxable Amt</th>
              {isIntrastate ? (
                <>
                  <th className="border px-2 py-2 text-center w-20">CGST %</th>
                  <th className="border px-2 py-2 text-right w-20">CGST Amt</th>
                  <th className="border px-2 py-2 text-center w-20">SGST %</th>
                  <th className="border px-2 py-2 text-right w-20">SGST Amt</th>
                </>
              ) : (
                <>
                  <th className="border px-2 py-2 text-center w-20">IGST %</th>
                  <th className="border px-2 py-2 text-right w-20">IGST Amt</th>
                </>
              )}
              <th className="border px-2 py-2 text-right w-24">Total</th>
              <th className="border px-2 py-2 text-center w-10"></th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, index) => (
              <InvoiceLineItemRow
                key={item.id}
                item={item}
                index={index}
                isIntrastate={isIntrastate}
                canDelete={invoice.lineItems.length > 1}
              />
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td colSpan={6} className="border px-2 py-2 text-right">Sub Total:</td>
              <td className="border px-2 py-2 text-right font-mono">
                {formatINR(invoice.lineItems.reduce((s, i) => s + i.taxableAmount, 0))}
              </td>
              {isIntrastate ? (
                <>
                  <td className="border px-2 py-2"></td>
                  <td className="border px-2 py-2 text-right font-mono">
                    {formatINR(invoice.lineItems.reduce((s, i) => s + i.cgstAmount, 0))}
                  </td>
                  <td className="border px-2 py-2"></td>
                  <td className="border px-2 py-2 text-right font-mono">
                    {formatINR(invoice.lineItems.reduce((s, i) => s + i.sgstAmount, 0))}
                  </td>
                </>
              ) : (
                <>
                  <td className="border px-2 py-2"></td>
                  <td className="border px-2 py-2 text-right font-mono">
                    {formatINR(invoice.lineItems.reduce((s, i) => s + i.igstAmount, 0))}
                  </td>
                </>
              )}
              <td className="border px-2 py-2 text-right font-mono">
                {formatINR(invoice.lineItems.reduce((s, i) => s + i.totalAmount, 0))}
              </td>
              <td className="border px-2 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Button variant="outline" size="sm" onClick={addLineItem} className="gap-1">
        <Plus className="h-4 w-4" /> Add Item
      </Button>
    </div>
  );
}
