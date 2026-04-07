import { type BankDetails, type Party } from './invoice';

export interface CompanySettings extends Party {}

export interface AppSettings {
  company: CompanySettings;
  bankDetails: BankDetails;
  invoicePrefix: string;
  nextInvoiceSequence: number;
  defaultTerms: string;
  defaultTaxRate: number;
}
