import { type LineItem, type TaxBreakdown, type RateBreakdownEntry } from '@/types/invoice';
import { type TaxType } from '@/types/gst';
import { numberToWordsINR } from './number-to-words';

function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100;
}

export function calculateLineItemTax(
  item: Pick<LineItem, 'quantity' | 'rate' | 'discount' | 'discountType' | 'gstRate'>,
  taxMode: TaxType
): Pick<LineItem, 'taxableAmount' | 'cgstRate' | 'cgstAmount' | 'sgstRate' | 'sgstAmount' | 'igstRate' | 'igstAmount' | 'totalAmount'> {
  const grossAmount = item.quantity * item.rate;
  const discountAmount = item.discountType === 'percent'
    ? grossAmount * (item.discount / 100)
    : item.discount;
  const taxableAmount = roundToTwo(Math.max(0, grossAmount - discountAmount));

  let cgstRate = 0, cgstAmount = 0, sgstRate = 0, sgstAmount = 0, igstRate = 0, igstAmount = 0;

  if (taxMode === 'intrastate') {
    cgstRate = item.gstRate / 2;
    sgstRate = item.gstRate / 2;
    cgstAmount = Math.round(taxableAmount * cgstRate / 100);
    sgstAmount = Math.round(taxableAmount * sgstRate / 100);
  } else {
    igstRate = item.gstRate;
    igstAmount = Math.round(taxableAmount * igstRate / 100);
  }

  const totalAmount = taxableAmount + cgstAmount + sgstAmount + igstAmount;

  return { taxableAmount, cgstRate, cgstAmount, sgstRate, sgstAmount, igstRate, igstAmount, totalAmount };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function calculateInvoiceTotals(lineItems: LineItem[], _taxMode: TaxType): TaxBreakdown {
  let subtotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  const rateMap = new Map<number, RateBreakdownEntry>();

  for (const item of lineItems) {
    subtotal += item.taxableAmount;
    cgstTotal += item.cgstAmount;
    sgstTotal += item.sgstAmount;
    igstTotal += item.igstAmount;

    const existing = rateMap.get(item.gstRate);
    if (existing) {
      existing.taxableAmount += item.taxableAmount;
      existing.cgstAmount += item.cgstAmount;
      existing.sgstAmount += item.sgstAmount;
      existing.igstAmount += item.igstAmount;
      existing.totalTax += item.cgstAmount + item.sgstAmount + item.igstAmount;
    } else {
      rateMap.set(item.gstRate, {
        gstRate: item.gstRate,
        taxableAmount: item.taxableAmount,
        cgstAmount: item.cgstAmount,
        sgstAmount: item.sgstAmount,
        igstAmount: item.igstAmount,
        totalTax: item.cgstAmount + item.sgstAmount + item.igstAmount,
      });
    }
  }

  const totalTax = cgstTotal + sgstTotal + igstTotal;
  const grandTotal = Math.round(subtotal + totalTax);

  const rateWiseBreakdown = Array.from(rateMap.values()).sort((a, b) => a.gstRate - b.gstRate);

  return {
    subtotal: roundToTwo(subtotal),
    cgstTotal,
    sgstTotal,
    igstTotal,
    totalTax,
    grandTotal,
    grandTotalInWords: numberToWordsINR(grandTotal),
    rateWiseBreakdown,
  };
}

export function determineTaxMode(supplierStateCode: string, recipientStateCode: string): TaxType {
  if (!supplierStateCode || !recipientStateCode) return 'intrastate';
  return supplierStateCode === recipientStateCode ? 'intrastate' : 'interstate';
}
