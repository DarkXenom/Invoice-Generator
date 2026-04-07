'use client';

import { create } from 'zustand';
import { type Invoice, type LineItem, type Party, type POReference, type BankDetails } from '@/types/invoice';
import { type TaxType } from '@/types/gst';
import { DEFAULT_SUPPLIER, DEFAULT_PARTY, DEFAULT_PO_REFERENCE, DEFAULT_BANK_DETAILS, DEFAULT_TERMS, createDefaultLineItem } from '@/lib/constants';
import { calculateLineItemTax, determineTaxMode } from '@/lib/tax-calculator';
import { type ParsedPurchaseOrder } from '@/types/purchase-order';

function createBlankInvoice(): Invoice {
  return {
    id: crypto.randomUUID(),
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    supplier: { ...DEFAULT_SUPPLIER },
    recipient: { ...DEFAULT_PARTY },
    shipTo: null,
    poReference: { ...DEFAULT_PO_REFERENCE },
    lineItems: [createDefaultLineItem(1)],
    taxMode: 'intrastate',
    reverseCharge: false,
    placeOfSupply: '',
    placeOfSupplyCode: '',
    bankDetails: { ...DEFAULT_BANK_DETAILS },
    terms: DEFAULT_TERMS,
    notes: '',
    logoUrl: null,
    signatureUrl: null,
    stampUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function recalcAllLineItems(items: LineItem[], taxMode: TaxType): LineItem[] {
  return items.map(item => ({
    ...item,
    ...calculateLineItemTax(item, taxMode),
  }));
}

interface InvoiceStore {
  invoice: Invoice;
  isDirty: boolean;
  lastSavedAt: string | null;

  setInvoice: (invoice: Invoice) => void;
  resetInvoice: () => void;
  loadFromDraft: (invoice: Invoice) => void;
  loadFromPO: (poData: ParsedPurchaseOrder) => void;
  markSaved: () => void;

  updateHeader: (field: 'invoiceNumber' | 'invoiceDate', value: string) => void;
  updateSupplier: (field: keyof Party, value: string) => void;
  updateRecipient: (field: keyof Party, value: string) => void;
  updateShipTo: (field: keyof Party, value: string) => void;
  toggleShipTo: (enabled: boolean) => void;
  updatePOReference: (field: keyof POReference, value: string) => void;
  updateBankDetails: (field: keyof BankDetails, value: string) => void;
  updateTerms: (terms: string) => void;
  updateNotes: (notes: string) => void;
  setReverseCharge: (value: boolean) => void;

  addLineItem: () => void;
  removeLineItem: (index: number) => void;
  updateLineItem: (index: number, field: keyof LineItem, value: string | number) => void;

  setTaxMode: (mode: TaxType) => void;

  setLogo: (dataUrl: string | null) => void;
  setSignature: (dataUrl: string | null) => void;
  setStamp: (dataUrl: string | null) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoice: createBlankInvoice(),
  isDirty: false,
  lastSavedAt: null,

  setInvoice: (invoice) => set({ invoice, isDirty: false }),

  resetInvoice: () => set({ invoice: createBlankInvoice(), isDirty: false, lastSavedAt: null }),

  loadFromDraft: (invoice) => set({ invoice, isDirty: false }),

  loadFromPO: (poData) => {
    const { invoice } = get();
    const newRecipient: Party = {
      ...DEFAULT_PARTY,
      name: poData.buyerName,
      address: poData.buyerAddress,
      gstin: poData.buyerGSTIN,
      state: poData.buyerState,
      stateCode: poData.buyerStateCode,
    };

    const taxMode = determineTaxMode(invoice.supplier.stateCode, newRecipient.stateCode);

    const lineItems: LineItem[] = poData.lineItems.map((item, idx) => {
      const base = createDefaultLineItem(idx + 1);
      base.description = item.description;
      base.hsnSacCode = item.hsnCode;
      base.quantity = item.quantity;
      base.unit = item.unit || 'Nos';
      base.rate = item.rate;
      return { ...base, ...calculateLineItemTax(base, taxMode) };
    });

    if (lineItems.length === 0) {
      lineItems.push(createDefaultLineItem(1));
    }

    set({
      invoice: {
        ...invoice,
        recipient: newRecipient,
        poReference: {
          ...invoice.poReference,
          poNumber: poData.poNumber,
          poDate: poData.poDate,
        },
        lineItems,
        taxMode,
        placeOfSupply: newRecipient.state,
        placeOfSupplyCode: newRecipient.stateCode,
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    });
  },

  markSaved: () => set({ isDirty: false, lastSavedAt: new Date().toISOString() }),

  updateHeader: (field, value) => set(state => ({
    invoice: { ...state.invoice, [field]: value, updatedAt: new Date().toISOString() },
    isDirty: true,
  })),

  updateSupplier: (field, value) => {
    set(state => {
      const supplier = { ...state.invoice.supplier, [field]: value };
      const taxMode = determineTaxMode(supplier.stateCode, state.invoice.recipient.stateCode);
      const lineItems = taxMode !== state.invoice.taxMode
        ? recalcAllLineItems(state.invoice.lineItems, taxMode)
        : state.invoice.lineItems;
      return {
        invoice: { ...state.invoice, supplier, taxMode, lineItems, updatedAt: new Date().toISOString() },
        isDirty: true,
      };
    });
  },

  updateRecipient: (field, value) => {
    set(state => {
      const recipient = { ...state.invoice.recipient, [field]: value };
      const taxMode = determineTaxMode(state.invoice.supplier.stateCode, recipient.stateCode);
      const lineItems = taxMode !== state.invoice.taxMode
        ? recalcAllLineItems(state.invoice.lineItems, taxMode)
        : state.invoice.lineItems;
      return {
        invoice: {
          ...state.invoice, recipient, taxMode, lineItems,
          placeOfSupply: recipient.state,
          placeOfSupplyCode: recipient.stateCode,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
    });
  },

  updateShipTo: (field, value) => set(state => ({
    invoice: {
      ...state.invoice,
      shipTo: state.invoice.shipTo ? { ...state.invoice.shipTo, [field]: value } : null,
      updatedAt: new Date().toISOString(),
    },
    isDirty: true,
  })),

  toggleShipTo: (enabled) => set(state => ({
    invoice: {
      ...state.invoice,
      shipTo: enabled ? { ...DEFAULT_PARTY } : null,
      updatedAt: new Date().toISOString(),
    },
    isDirty: true,
  })),

  updatePOReference: (field, value) => set(state => ({
    invoice: {
      ...state.invoice,
      poReference: { ...state.invoice.poReference, [field]: value },
      updatedAt: new Date().toISOString(),
    },
    isDirty: true,
  })),

  updateBankDetails: (field, value) => set(state => ({
    invoice: {
      ...state.invoice,
      bankDetails: { ...state.invoice.bankDetails, [field]: value },
      updatedAt: new Date().toISOString(),
    },
    isDirty: true,
  })),

  updateTerms: (terms) => set(state => ({
    invoice: { ...state.invoice, terms, updatedAt: new Date().toISOString() },
    isDirty: true,
  })),

  updateNotes: (notes) => set(state => ({
    invoice: { ...state.invoice, notes, updatedAt: new Date().toISOString() },
    isDirty: true,
  })),

  setReverseCharge: (value) => set(state => ({
    invoice: { ...state.invoice, reverseCharge: value, updatedAt: new Date().toISOString() },
    isDirty: true,
  })),

  addLineItem: () => set(state => {
    const nextSerial = state.invoice.lineItems.length + 1;
    return {
      invoice: {
        ...state.invoice,
        lineItems: [...state.invoice.lineItems, createDefaultLineItem(nextSerial)],
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    };
  }),

  removeLineItem: (index) => set(state => {
    const lineItems = state.invoice.lineItems
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, serialNumber: i + 1 }));
    return {
      invoice: { ...state.invoice, lineItems, updatedAt: new Date().toISOString() },
      isDirty: true,
    };
  }),

  updateLineItem: (index, field, value) => set(state => {
    const lineItems = [...state.invoice.lineItems];
    const item = { ...lineItems[index], [field]: value };

    const taxFields = calculateLineItemTax(item, state.invoice.taxMode);
    lineItems[index] = { ...item, ...taxFields };

    return {
      invoice: { ...state.invoice, lineItems, updatedAt: new Date().toISOString() },
      isDirty: true,
    };
  }),

  setTaxMode: (mode) => set(state => ({
    invoice: {
      ...state.invoice,
      taxMode: mode,
      lineItems: recalcAllLineItems(state.invoice.lineItems, mode),
      updatedAt: new Date().toISOString(),
    },
    isDirty: true,
  })),

  setLogo: (dataUrl) => set(state => ({
    invoice: { ...state.invoice, logoUrl: dataUrl, updatedAt: new Date().toISOString() },
    isDirty: true,
  })),

  setSignature: (dataUrl) => set(state => ({
    invoice: { ...state.invoice, signatureUrl: dataUrl, updatedAt: new Date().toISOString() },
    isDirty: true,
  })),

  setStamp: (dataUrl) => set(state => ({
    invoice: { ...state.invoice, stampUrl: dataUrl, updatedAt: new Date().toISOString() },
    isDirty: true,
  })),
}));
