'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AppSettings } from '@/types/settings';
import { type Party, type BankDetails } from '@/types/invoice';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { generateInvoiceNumber } from '@/lib/invoice-number-generator';

interface SettingsStore extends AppSettings {
  updateCompany: (field: keyof Party, value: string) => void;
  updateBankDetails: (field: keyof BankDetails, value: string) => void;
  setInvoicePrefix: (prefix: string) => void;
  setDefaultTerms: (terms: string) => void;
  setDefaultTaxRate: (rate: number) => void;
  generateNextInvoiceNumber: () => string;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,

      updateCompany: (field, value) => set(state => ({
        company: { ...state.company, [field]: value },
      })),

      updateBankDetails: (field, value) => set(state => ({
        bankDetails: { ...state.bankDetails, [field]: value },
      })),

      setInvoicePrefix: (prefix) => set({ invoicePrefix: prefix }),

      setDefaultTerms: (terms) => set({ defaultTerms: terms }),

      setDefaultTaxRate: (rate) => set({ defaultTaxRate: rate }),

      generateNextInvoiceNumber: () => {
        const { invoicePrefix, nextInvoiceSequence } = get();
        const number = generateInvoiceNumber(invoicePrefix, nextInvoiceSequence);
        set({ nextInvoiceSequence: nextInvoiceSequence + 1 });
        return number;
      },
    }),
    { name: 'omega_settings' }
  )
);
