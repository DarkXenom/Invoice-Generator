export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;

  supplier: Party;
  recipient: Party;
  shipTo: Party | null;

  poReference: POReference;
  lineItems: LineItem[];

  taxMode: 'intrastate' | 'interstate';
  reverseCharge: boolean;
  placeOfSupply: string;
  placeOfSupplyCode: string;

  bankDetails: BankDetails;
  terms: string;
  notes: string;

  logoUrl: string | null;
  signatureUrl: string | null;
  stampUrl: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface Party {
  name: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
}

export interface POReference {
  poNumber: string;
  poDate: string;
  deliveryDate: string;
  paymentTerms: string;
  transportMode: string;
  vehicleNumber: string;
  eWayBillNumber: string;
}

export interface LineItem {
  id: string;
  serialNumber: number;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  discountType: 'amount' | 'percent';
  taxableAmount: number;
  gstRate: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: string;
}

export interface TaxBreakdown {
  subtotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalTax: number;
  grandTotal: number;
  grandTotalInWords: string;
  rateWiseBreakdown: RateBreakdownEntry[];
}

export interface RateBreakdownEntry {
  gstRate: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
}
