import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a5f',
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 180,
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    marginBottom: 6,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 8,
    color: '#444',
    marginBottom: 1,
  },
  invoiceInfoLabel: {
    fontSize: 8,
    color: '#666',
    width: 65,
  },
  invoiceInfoValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  invoiceInfoRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'center',
  },

  // Parties
  partiesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 15,
  },
  partyBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 3,
    padding: 6,
  },
  partyTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    marginBottom: 3,
    textTransform: 'uppercase' as const,
  },
  partyName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  partyDetail: {
    fontSize: 8,
    color: '#444',
    marginBottom: 0.5,
  },

  // PO Reference
  poRefContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f8f9fa',
    padding: 5,
    borderRadius: 3,
    marginBottom: 8,
    gap: 4,
  },
  poRefItem: {
    flexDirection: 'row',
    marginRight: 15,
  },
  poRefLabel: {
    fontSize: 7,
    color: '#666',
    marginRight: 3,
  },
  poRefValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  // Table
  table: {
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e3a5f',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 3,
    paddingHorizontal: 2,
    minHeight: 18,
  },
  tableRowAlt: {
    backgroundColor: '#f8f9fa',
  },
  thText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  tdText: {
    fontSize: 8,
  },
  tdRight: {
    fontSize: 8,
    textAlign: 'right',
  },
  tdCenter: {
    fontSize: 8,
    textAlign: 'center',
  },

  // Column widths
  colSno: { width: 22 },
  colDesc: { flex: 1, minWidth: 100 },
  colHsn: { width: 50 },
  colQty: { width: 35 },
  colUnit: { width: 30 },
  colRate: { width: 55 },
  colTaxable: { width: 65 },
  colGstRate: { width: 35 },
  colTax: { width: 55 },
  colTotal: { width: 65 },

  // Summary
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  summaryBox: {
    width: 250,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 8,
    color: '#444',
  },
  summaryValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#1e3a5f',
    borderRadius: 2,
    marginTop: 2,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
  },
  grandTotalValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
    textAlign: 'right',
  },
  amountInWords: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#444',
    marginTop: 3,
    paddingHorizontal: 4,
  },

  // Tax Summary Table
  taxSummaryTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#666',
    textTransform: 'uppercase' as const,
    marginBottom: 3,
  },

  // Bank Details
  bankContainer: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 3,
    padding: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    marginBottom: 3,
    textTransform: 'uppercase' as const,
  },
  bankRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  bankLabel: {
    fontSize: 7,
    color: '#666',
    width: 80,
  },
  bankValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  // Terms
  termsText: {
    fontSize: 7,
    color: '#555',
    lineHeight: 1.4,
  },

  // Footer / Signature
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  signatureBox: {
    alignItems: 'center',
    width: 160,
  },
  signatureImage: {
    height: 50,
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 7,
    color: '#666',
    marginTop: 2,
  },
  forCompany: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    marginBottom: 8,
  },

  // Logo
  logo: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
});
