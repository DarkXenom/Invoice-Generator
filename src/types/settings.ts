import { type BankDetails, type Party } from './invoice';

export type CompanySettings = Party;

export interface AppSettings {
  company: CompanySettings;
  bankDetails: BankDetails;
  invoicePrefix: string;
  nextInvoiceSequence: number;
  defaultTerms: string;
  defaultTaxRate: number;
}
