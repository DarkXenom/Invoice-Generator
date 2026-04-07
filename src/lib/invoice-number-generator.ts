export function generateInvoiceNumber(prefix: string, sequence: number, padLength = 3): string {
  return prefix + String(sequence).padStart(padLength, '0');
}

export function getFinancialYearPrefix(companyCode: string, date: Date = new Date()): string {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  // Indian financial year: April to March
  const fyStart = month >= 3 ? year : year - 1;
  const fyEnd = fyStart + 1;

  const shortEnd = String(fyEnd).slice(-2);
  return `${companyCode}/${fyStart}-${shortEnd}/`;
}
