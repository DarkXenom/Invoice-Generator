export interface ParsedPurchaseOrder {
  poNumber: string;
  poDate: string;
  buyerName: string;
  buyerAddress: string;
  buyerGSTIN: string;
  buyerState: string;
  buyerStateCode: string;
  deliveryAddress: string;
  lineItems: ParsedLineItem[];
  totalAmount: string;
  rawText: string;
  confidence: Record<string, number>;
}

export interface ParsedLineItem {
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}
