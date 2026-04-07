/* eslint-disable jsx-a11y/alt-text */
// @react-pdf/renderer Image component doesn't support alt prop
'use client';

import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { type Invoice, type TaxBreakdown } from '@/types/invoice';
import { styles } from './pdf-styles';
import { formatINR } from '@/lib/constants';

interface InvoicePDFDocumentProps {
  invoice: Invoice;
  totals: TaxBreakdown;
}

function PDFHeader({ invoice }: { invoice: Invoice }) {
  return (
    <>
      <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {invoice.logoUrl && <Image src={invoice.logoUrl} style={styles.logo} />}
          <Text style={styles.companyName}>{invoice.supplier.name}</Text>
          {invoice.supplier.address && <Text style={styles.companyDetail}>{invoice.supplier.address}</Text>}
          <Text style={styles.companyDetail}>
            {[invoice.supplier.city, invoice.supplier.state, invoice.supplier.pincode].filter(Boolean).join(', ')}
          </Text>
          {invoice.supplier.gstin && <Text style={styles.companyDetail}>GSTIN: {invoice.supplier.gstin}</Text>}
          {invoice.supplier.pan && <Text style={styles.companyDetail}>PAN: {invoice.supplier.pan}</Text>}
          {invoice.supplier.phone && <Text style={styles.companyDetail}>Ph: {invoice.supplier.phone}</Text>}
          {invoice.supplier.email && <Text style={styles.companyDetail}>Email: {invoice.supplier.email}</Text>}
        </View>
        <View style={styles.headerRight}>
          <View style={styles.invoiceInfoRow}>
            <Text style={styles.invoiceInfoLabel}>Invoice No:</Text>
            <Text style={styles.invoiceInfoValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.invoiceInfoRow}>
            <Text style={styles.invoiceInfoLabel}>Date:</Text>
            <Text style={styles.invoiceInfoValue}>{invoice.invoiceDate}</Text>
          </View>
          {invoice.supplier.stateCode && (
            <View style={styles.invoiceInfoRow}>
              <Text style={styles.invoiceInfoLabel}>State Code:</Text>
              <Text style={styles.invoiceInfoValue}>{invoice.supplier.stateCode}</Text>
            </View>
          )}
          <View style={styles.invoiceInfoRow}>
            <Text style={styles.invoiceInfoLabel}>Reverse Charge:</Text>
            <Text style={styles.invoiceInfoValue}>{invoice.reverseCharge ? 'Yes' : 'No'}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

function PDFParties({ invoice }: { invoice: Invoice }) {
  const renderParty = (title: string, party: typeof invoice.recipient) => (
    <View style={styles.partyBox}>
      <Text style={styles.partyTitle}>{title}</Text>
      <Text style={styles.partyName}>{party.name}</Text>
      {party.address && <Text style={styles.partyDetail}>{party.address}</Text>}
      <Text style={styles.partyDetail}>
        {[party.city, party.state, party.pincode].filter(Boolean).join(', ')}
      </Text>
      {party.gstin && <Text style={styles.partyDetail}>GSTIN: {party.gstin}</Text>}
      {party.stateCode && <Text style={styles.partyDetail}>State Code: {party.stateCode}</Text>}
      {party.phone && <Text style={styles.partyDetail}>Ph: {party.phone}</Text>}
    </View>
  );

  return (
    <View style={styles.partiesContainer}>
      {renderParty('Bill To', invoice.recipient)}
      {invoice.shipTo && renderParty('Ship To', invoice.shipTo)}
    </View>
  );
}

function PDFPORef({ invoice }: { invoice: Invoice }) {
  const po = invoice.poReference;
  const items = [
    { label: 'PO No:', value: po.poNumber },
    { label: 'PO Date:', value: po.poDate },
    { label: 'Delivery:', value: po.deliveryDate },
    { label: 'Payment:', value: po.paymentTerms },
    { label: 'Transport:', value: po.transportMode },
    { label: 'Vehicle:', value: po.vehicleNumber },
    { label: 'E-Way Bill:', value: po.eWayBillNumber },
  ].filter(i => i.value);

  if (items.length === 0) return null;

  return (
    <View style={styles.poRefContainer}>
      {items.map((item, i) => (
        <View key={i} style={styles.poRefItem}>
          <Text style={styles.poRefLabel}>{item.label}</Text>
          <Text style={styles.poRefValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function PDFLineItems({ invoice }: { invoice: Invoice }) {
  const isIntra = invoice.taxMode === 'intrastate';
  const fmt = (n: number) => formatINR(n).replace('\u20B9', '');

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.tableHeader}>
        <View style={styles.colSno}><Text style={styles.thText}>#</Text></View>
        <View style={styles.colDesc}><Text style={[styles.thText, { textAlign: 'left' }]}>Description</Text></View>
        <View style={styles.colHsn}><Text style={styles.thText}>HSN/SAC</Text></View>
        <View style={styles.colQty}><Text style={styles.thText}>Qty</Text></View>
        <View style={styles.colUnit}><Text style={styles.thText}>Unit</Text></View>
        <View style={styles.colRate}><Text style={styles.thText}>Rate</Text></View>
        <View style={styles.colTaxable}><Text style={styles.thText}>Taxable</Text></View>
        <View style={styles.colGstRate}><Text style={styles.thText}>GST%</Text></View>
        <View style={styles.colTax}><Text style={styles.thText}>{isIntra ? 'CGST+SGST' : 'IGST'}</Text></View>
        <View style={styles.colTotal}><Text style={styles.thText}>Total</Text></View>
      </View>

      {/* Rows */}
      {invoice.lineItems.map((item, idx) => (
        <View key={item.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
          <View style={styles.colSno}><Text style={styles.tdCenter}>{item.serialNumber}</Text></View>
          <View style={styles.colDesc}><Text style={styles.tdText}>{item.description}</Text></View>
          <View style={styles.colHsn}><Text style={styles.tdCenter}>{item.hsnSacCode}</Text></View>
          <View style={styles.colQty}><Text style={styles.tdRight}>{item.quantity}</Text></View>
          <View style={styles.colUnit}><Text style={styles.tdCenter}>{item.unit}</Text></View>
          <View style={styles.colRate}><Text style={styles.tdRight}>{fmt(item.rate)}</Text></View>
          <View style={styles.colTaxable}><Text style={styles.tdRight}>{fmt(item.taxableAmount)}</Text></View>
          <View style={styles.colGstRate}><Text style={styles.tdCenter}>{item.gstRate}%</Text></View>
          <View style={styles.colTax}>
            <Text style={styles.tdRight}>
              {isIntra ? fmt(item.cgstAmount + item.sgstAmount) : fmt(item.igstAmount)}
            </Text>
          </View>
          <View style={styles.colTotal}><Text style={[styles.tdRight, { fontFamily: 'Helvetica-Bold' }]}>{fmt(item.totalAmount)}</Text></View>
        </View>
      ))}
    </View>
  );
}

function PDFSummary({ invoice, totals }: { invoice: Invoice; totals: TaxBreakdown }) {
  const isIntra = invoice.taxMode === 'intrastate';
  const fmt = (n: number) => formatINR(n).replace('\u20B9', '');

  return (
    <View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{fmt(totals.subtotal)}</Text>
          </View>

          {totals.rateWiseBreakdown.map((entry) => (
            <View key={entry.gstRate}>
              {isIntra ? (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>  CGST @ {entry.gstRate / 2}%</Text>
                    <Text style={styles.summaryValue}>{fmt(entry.cgstAmount)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>  SGST @ {entry.gstRate / 2}%</Text>
                    <Text style={styles.summaryValue}>{fmt(entry.sgstAmount)}</Text>
                  </View>
                </>
              ) : (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>  IGST @ {entry.gstRate}%</Text>
                  <Text style={styles.summaryValue}>{fmt(entry.igstAmount)}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{'\u20B9'} {fmt(totals.grandTotal)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.amountInWords}>{totals.grandTotalInWords}</Text>
    </View>
  );
}

function PDFBankDetails({ invoice }: { invoice: Invoice }) {
  const bank = invoice.bankDetails;
  if (!bank.bankName && !bank.accountNumber) return null;

  return (
    <View style={styles.bankContainer}>
      <Text style={styles.sectionTitle}>Bank Details</Text>
      {bank.bankName && (
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Bank Name:</Text>
          <Text style={styles.bankValue}>{bank.bankName}</Text>
        </View>
      )}
      {bank.accountNumber && (
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Account No:</Text>
          <Text style={styles.bankValue}>{bank.accountNumber}</Text>
        </View>
      )}
      {bank.ifscCode && (
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>IFSC Code:</Text>
          <Text style={styles.bankValue}>{bank.ifscCode}</Text>
        </View>
      )}
      {bank.branchName && (
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Branch:</Text>
          <Text style={styles.bankValue}>{bank.branchName}</Text>
        </View>
      )}
      {bank.accountType && (
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Account Type:</Text>
          <Text style={styles.bankValue}>{bank.accountType}</Text>
        </View>
      )}
    </View>
  );
}

function PDFTerms({ invoice }: { invoice: Invoice }) {
  if (!invoice.terms) return null;
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.sectionTitle}>Terms & Conditions</Text>
      <Text style={styles.termsText}>{invoice.terms}</Text>
    </View>
  );
}

function PDFFooter({ invoice }: { invoice: Invoice }) {
  return (
    <View style={styles.footerContainer}>
      <View>
        {invoice.notes && (
          <View>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.termsText}>{invoice.notes}</Text>
          </View>
        )}
      </View>
      <View style={styles.signatureBox}>
        <Text style={styles.forCompany}>For {invoice.supplier.name || 'OMEGA EQUIPMENT AND PROJECTS'}</Text>
        {invoice.signatureUrl && <Image src={invoice.signatureUrl} style={styles.signatureImage} />}
        {invoice.stampUrl && <Image src={invoice.stampUrl} style={styles.signatureImage} />}
        <Text style={styles.signatureLabel}>Authorized Signatory</Text>
      </View>
    </View>
  );
}

export function InvoicePDFDocument({ invoice, totals }: InvoicePDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader invoice={invoice} />
        <PDFParties invoice={invoice} />
        <PDFPORef invoice={invoice} />
        <PDFLineItems invoice={invoice} />
        <PDFSummary invoice={invoice} totals={totals} />
        <PDFBankDetails invoice={invoice} />
        <PDFTerms invoice={invoice} />
        <PDFFooter invoice={invoice} />
      </Page>
    </Document>
  );
}
