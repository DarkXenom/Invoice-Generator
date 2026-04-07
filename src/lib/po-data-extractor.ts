import { type ParsedPurchaseOrder, type ParsedLineItem } from '@/types/purchase-order';

const GSTIN_REGEX = /\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]/g;
const PO_NUMBER_REGEX = /(?:P\.?O\.?\s*(?:No|Number|#|Ref)?|Purchase\s*Order\s*(?:No|Number|#)?)\s*[:\-.]?\s*([A-Z0-9\-\/]+)/i;
const DATE_REGEX = /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{2,4})/gi;
// Available for future use: extract amounts like Rs. 1,234.56
// const AMOUNT_REGEX = /(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/g;

function extractGSTINs(text: string): string[] {
  return [...new Set(text.match(GSTIN_REGEX) || [])];
}

function extractPONumber(text: string): string {
  const match = text.match(PO_NUMBER_REGEX);
  return match ? match[1].trim() : '';
}

function extractDates(text: string): string[] {
  return (text.match(DATE_REGEX) || []).map(d => d.trim());
}

function extractBuyerInfo(text: string, gstins: string[]): { name: string; address: string; gstin: string; state: string; stateCode: string } {
  // Try to find "Bill To", "Buyer", "Ship To", "Consignee" sections
  const buyerSection = text.match(/(?:Bill\s*To|Buyer|Purchaser|Consignee|To)[:\s]*\n?([\s\S]*?)(?:\n\s*\n|(?:Ship|Deliver|Vendor|Seller|From))/i);

  let name = '';
  let address = '';

  if (buyerSection) {
    const lines = buyerSection[1].split('\n').map(l => l.trim()).filter(Boolean);
    name = lines[0] || '';
    address = lines.slice(1, 4).join(', ');
  }

  // Use second GSTIN as buyer's (first is usually seller's)
  const buyerGSTIN = gstins.length > 1 ? gstins[1] : gstins[0] || '';
  const stateCode = buyerGSTIN ? buyerGSTIN.substring(0, 2) : '';

  return { name, address, gstin: buyerGSTIN, state: '', stateCode };
}

function extractLineItems(text: string): ParsedLineItem[] {
  const items: ParsedLineItem[] = [];
  const lines = text.split('\n');

  // Look for table-like patterns: serial number + description + quantity + rate + amount
  const lineItemRegex = /^\s*(\d+)\s*[.\)]\s*(.+?)\s+(\d+(?:\.\d+)?)\s+(?:Nos|Pcs|Set|Kg|Ltr|Mtr|Unit|Lot)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s+(\d+(?:,\d+)*(?:\.\d+)?)/i;

  for (const line of lines) {
    const match = line.match(lineItemRegex);
    if (match) {
      const parseNum = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;
      items.push({
        description: match[2].trim(),
        hsnCode: '',
        quantity: parseNum(match[3]),
        unit: 'Nos',
        rate: parseNum(match[4]),
        amount: parseNum(match[5]),
      });
    }
  }

  // Try alternate pattern: HSN code included
  if (items.length === 0) {
    const altRegex = /^\s*(\d+)\s*[.\)]\s*(.+?)\s+(\d{4,8})\s+(\d+(?:\.\d+)?)\s+\w+\s+(\d+(?:,\d+)*(?:\.\d+)?)\s+(\d+(?:,\d+)*(?:\.\d+)?)/i;
    for (const line of lines) {
      const match = line.match(altRegex);
      if (match) {
        const parseNum = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;
        items.push({
          description: match[2].trim(),
          hsnCode: match[3],
          quantity: parseNum(match[4]),
          unit: 'Nos',
          rate: parseNum(match[5]),
          amount: parseNum(match[6]),
        });
      }
    }
  }

  return items;
}

export function extractPOData(rawText: string): ParsedPurchaseOrder {
  const gstins = extractGSTINs(rawText);
  const poNumber = extractPONumber(rawText);
  const dates = extractDates(rawText);
  const buyer = extractBuyerInfo(rawText, gstins);
  const lineItems = extractLineItems(rawText);

  const confidence: Record<string, number> = {
    poNumber: poNumber ? 0.9 : 0.1,
    poDate: dates.length > 0 ? 0.7 : 0.1,
    buyerName: buyer.name ? 0.7 : 0.2,
    buyerGSTIN: buyer.gstin ? 0.95 : 0.1,
    lineItems: lineItems.length > 0 ? 0.8 : 0.2,
  };

  return {
    poNumber,
    poDate: dates[0] || '',
    buyerName: buyer.name,
    buyerAddress: buyer.address,
    buyerGSTIN: buyer.gstin,
    buyerState: buyer.state,
    buyerStateCode: buyer.stateCode,
    deliveryAddress: '',
    lineItems,
    totalAmount: '',
    rawText,
    confidence,
  };
}
