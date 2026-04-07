'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { useInvoiceTotals } from '@/hooks/use-invoice-totals';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { Separator } from '@/components/ui/separator';

export function InvoiceSummary() {
  const taxMode = useInvoiceStore(s => s.invoice.taxMode);
  const totals = useInvoiceTotals();

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div className="w-full max-w-md space-y-1">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal (Taxable Value)</span>
            <CurrencyDisplay amount={totals.subtotal} className="font-medium" />
          </div>

          {/* Rate-wise tax breakdown */}
          {totals.rateWiseBreakdown.map((entry) => (
            <div key={entry.gstRate} className="space-y-0.5">
              {taxMode === 'intrastate' ? (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="pl-2">CGST @ {entry.gstRate / 2}%</span>
                    <CurrencyDisplay amount={entry.cgstAmount} />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="pl-2">SGST @ {entry.gstRate / 2}%</span>
                    <CurrencyDisplay amount={entry.sgstAmount} />
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="pl-2">IGST @ {entry.gstRate}%</span>
                  <CurrencyDisplay amount={entry.igstAmount} />
                </div>
              )}
            </div>
          ))}

          {/* Total Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Tax</span>
            <CurrencyDisplay amount={totals.totalTax} className="font-medium" />
          </div>

          <Separator />

          {/* Grand Total */}
          <div className="flex justify-between text-base font-bold pt-1">
            <span className="text-gray-900">Grand Total</span>
            <CurrencyDisplay amount={totals.grandTotal} className="text-blue-800" />
          </div>

          {/* Amount in Words */}
          <div className="bg-gray-50 rounded-md px-3 py-2 mt-2">
            <p className="text-xs text-gray-500 mb-0.5">Amount in Words</p>
            <p className="text-sm font-medium text-gray-800 italic">
              {totals.grandTotalInWords}
            </p>
          </div>
        </div>
      </div>

      {/* Rate-wise summary table */}
      {totals.rateWiseBreakdown.length > 0 && (
        <div className="overflow-x-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Tax Summary (Rate-wise)
          </p>
          <table className="w-full text-xs border rounded">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-1.5 text-left font-semibold text-gray-600">GST Rate</th>
                <th className="px-3 py-1.5 text-right font-semibold text-gray-600">Taxable Value</th>
                {taxMode === 'intrastate' ? (
                  <>
                    <th className="px-3 py-1.5 text-right font-semibold text-gray-600">CGST</th>
                    <th className="px-3 py-1.5 text-right font-semibold text-gray-600">SGST</th>
                  </>
                ) : (
                  <th className="px-3 py-1.5 text-right font-semibold text-gray-600">IGST</th>
                )}
                <th className="px-3 py-1.5 text-right font-semibold text-gray-600">Total Tax</th>
              </tr>
            </thead>
            <tbody>
              {totals.rateWiseBreakdown.map((entry) => (
                <tr key={entry.gstRate} className="border-b">
                  <td className="px-3 py-1.5 font-medium">{entry.gstRate}%</td>
                  <td className="px-3 py-1.5 text-right">
                    <CurrencyDisplay amount={entry.taxableAmount} />
                  </td>
                  {taxMode === 'intrastate' ? (
                    <>
                      <td className="px-3 py-1.5 text-right">
                        <CurrencyDisplay amount={entry.cgstAmount} />
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <CurrencyDisplay amount={entry.sgstAmount} />
                      </td>
                    </>
                  ) : (
                    <td className="px-3 py-1.5 text-right">
                      <CurrencyDisplay amount={entry.igstAmount} />
                    </td>
                  )}
                  <td className="px-3 py-1.5 text-right font-medium">
                    <CurrencyDisplay amount={entry.totalTax} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
