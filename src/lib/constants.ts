import { type GSTStateEntry, type GSTRate } from '@/types/gst';
import { type Party, type BankDetails, type POReference, type LineItem } from '@/types/invoice';
import { type AppSettings } from '@/types/settings';

export const GST_STATES: GSTStateEntry[] = [
  { code: '01', name: 'Jammu & Kashmir', shortCode: 'JK' },
  { code: '02', name: 'Himachal Pradesh', shortCode: 'HP' },
  { code: '03', name: 'Punjab', shortCode: 'PB' },
  { code: '04', name: 'Chandigarh', shortCode: 'CH' },
  { code: '05', name: 'Uttarakhand', shortCode: 'UK' },
  { code: '06', name: 'Haryana', shortCode: 'HR' },
  { code: '07', name: 'Delhi', shortCode: 'DL' },
  { code: '08', name: 'Rajasthan', shortCode: 'RJ' },
  { code: '09', name: 'Uttar Pradesh', shortCode: 'UP' },
  { code: '10', name: 'Bihar', shortCode: 'BR' },
  { code: '11', name: 'Sikkim', shortCode: 'SK' },
  { code: '12', name: 'Arunachal Pradesh', shortCode: 'AR' },
  { code: '13', name: 'Nagaland', shortCode: 'NL' },
  { code: '14', name: 'Manipur', shortCode: 'MN' },
  { code: '15', name: 'Mizoram', shortCode: 'MZ' },
  { code: '16', name: 'Tripura', shortCode: 'TR' },
  { code: '17', name: 'Meghalaya', shortCode: 'ML' },
  { code: '18', name: 'Assam', shortCode: 'AS' },
  { code: '19', name: 'West Bengal', shortCode: 'WB' },
  { code: '20', name: 'Jharkhand', shortCode: 'JH' },
  { code: '21', name: 'Odisha', shortCode: 'OD' },
  { code: '22', name: 'Chhattisgarh', shortCode: 'CG' },
  { code: '23', name: 'Madhya Pradesh', shortCode: 'MP' },
  { code: '24', name: 'Gujarat', shortCode: 'GJ' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu', shortCode: 'DN' },
  { code: '27', name: 'Maharashtra', shortCode: 'MH' },
  { code: '29', name: 'Karnataka', shortCode: 'KA' },
  { code: '30', name: 'Goa', shortCode: 'GA' },
  { code: '31', name: 'Lakshadweep', shortCode: 'LD' },
  { code: '32', name: 'Kerala', shortCode: 'KL' },
  { code: '33', name: 'Tamil Nadu', shortCode: 'TN' },
  { code: '34', name: 'Puducherry', shortCode: 'PY' },
  { code: '35', name: 'Andaman & Nicobar Islands', shortCode: 'AN' },
  { code: '36', name: 'Telangana', shortCode: 'TS' },
  { code: '37', name: 'Andhra Pradesh', shortCode: 'AP' },
  { code: '38', name: 'Ladakh', shortCode: 'LA' },
  { code: '97', name: 'Other Territory', shortCode: 'OT' },
];

export const GST_RATES: GSTRate[] = [0, 5, 12, 18, 28];

export const UNIT_OPTIONS = [
  'Nos', 'Pcs', 'Set', 'Kg', 'Gm', 'Ltr', 'Mtr', 'Sqm', 'Sqft',
  'Box', 'Bag', 'Roll', 'Pair', 'Lot', 'Bundle', 'Pack', 'Drum',
  'Ton', 'Quintal', 'Dozen', 'Unit',
];

export const DEFAULT_SUPPLIER: Party = {
  name: 'OMEGA EQUIPMENT AND PROJECTS',
  address: '',
  city: '',
  state: '',
  stateCode: '',
  pincode: '',
  gstin: '',
  pan: '',
  phone: '',
  email: '',
};

export const DEFAULT_PARTY: Party = {
  name: '',
  address: '',
  city: '',
  state: '',
  stateCode: '',
  pincode: '',
  gstin: '',
  pan: '',
  phone: '',
  email: '',
};

export const DEFAULT_PO_REFERENCE: POReference = {
  poNumber: '',
  poDate: '',
  deliveryDate: '',
  paymentTerms: '',
  transportMode: '',
  vehicleNumber: '',
  eWayBillNumber: '',
};

export const DEFAULT_BANK_DETAILS: BankDetails = {
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  branchName: '',
  accountType: 'Current',
};

export const DEFAULT_TERMS = `1. Payment is due within 30 days from the date of invoice.
2. Goods once sold will not be taken back.
3. Interest @ 18% p.a. will be charged on overdue payments.
4. Subject to jurisdiction of local courts only.`;

export function createDefaultLineItem(serialNumber: number): LineItem {
  return {
    id: crypto.randomUUID(),
    serialNumber,
    description: '',
    hsnSacCode: '',
    quantity: 0,
    unit: 'Nos',
    rate: 0,
    discount: 0,
    discountType: 'amount',
    taxableAmount: 0,
    gstRate: 18,
    cgstRate: 9,
    cgstAmount: 0,
    sgstRate: 9,
    sgstAmount: 0,
    igstRate: 0,
    igstAmount: 0,
    totalAmount: 0,
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  company: { ...DEFAULT_SUPPLIER },
  bankDetails: { ...DEFAULT_BANK_DETAILS },
  invoicePrefix: 'OEP/2026-27/',
  nextInvoiceSequence: 1,
  defaultTerms: DEFAULT_TERMS,
  defaultTaxRate: 18,
};

export function formatINR(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const [intPart, decPart] = abs.toFixed(2).split('.');

  let lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);
  if (otherNumbers !== '') {
    lastThree = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return (isNegative ? '-' : '') + '\u20B9' + lastThree + '.' + decPart;
}

export function getStateFromGSTIN(gstin: string): { stateCode: string; state: string } | null {
  if (!gstin || gstin.length < 2) return null;
  const code = gstin.substring(0, 2);
  const entry = GST_STATES.find(s => s.code === code);
  if (!entry) return null;
  return { stateCode: entry.code, state: entry.name };
}
