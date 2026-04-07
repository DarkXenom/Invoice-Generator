export interface GSTStateEntry {
  code: string;
  name: string;
  shortCode: string;
}

export type GSTRate = 0 | 5 | 12 | 18 | 28;
export type TaxType = 'intrastate' | 'interstate';
