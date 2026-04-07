'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceEditor } from '@/components/invoice/invoice-editor';
import { POUploadZone } from '@/components/po-upload/po-upload-zone';
import { PDFPreviewDialog } from '@/components/pdf-export/pdf-preview-dialog';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useDraftsStore } from '@/stores/drafts-store';
import { useInvoiceTotals } from '@/hooks/use-invoice-totals';
import { toast } from 'sonner';

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6"><p className="text-gray-500">Loading...</p></div>}>
      <CreateInvoiceContent />
    </Suspense>
  );
}

function CreateInvoiceContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft');
  const [showUpload, setShowUpload] = useState(!draftId);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const setInvoice = useInvoiceStore(s => s.setInvoice);
  const resetInvoice = useInvoiceStore(s => s.resetInvoice);
  const updateHeader = useInvoiceStore(s => s.updateHeader);
  const updateSupplier = useInvoiceStore(s => s.updateSupplier);
  const updateBankDetails = useInvoiceStore(s => s.updateBankDetails);
  const updateTerms = useInvoiceStore(s => s.updateTerms);
  const invoice = useInvoiceStore(s => s.invoice);
  const loadDraft = useDraftsStore(s => s.loadDraft);
  const totals = useInvoiceTotals();

  const settings = useSettingsStore(s => s.getSettings());
  const generateNextInvoiceNumber = useSettingsStore(s => s.generateNextInvoiceNumber);

  // Load draft or initialize new invoice
  useEffect(() => {
    if (draftId) {
      const draft = loadDraft(draftId);
      if (draft) {
        setInvoice(draft);
        setShowUpload(false);
        toast.success('Draft loaded');
      } else {
        toast.error('Draft not found');
      }
    } else {
      resetInvoice();
      // Pre-populate from settings
      const invoiceNumber = generateNextInvoiceNumber();
      updateHeader('invoiceNumber', invoiceNumber);
      // Set supplier info from settings
      const company = settings.company;
      if (company.name) updateSupplier('name', company.name);
      if (company.address) updateSupplier('address', company.address);
      if (company.city) updateSupplier('city', company.city);
      if (company.state) updateSupplier('state', company.state);
      if (company.stateCode) updateSupplier('stateCode', company.stateCode);
      if (company.pincode) updateSupplier('pincode', company.pincode);
      if (company.gstin) updateSupplier('gstin', company.gstin);
      if (company.pan) updateSupplier('pan', company.pan);
      if (company.phone) updateSupplier('phone', company.phone);
      if (company.email) updateSupplier('email', company.email);
      // Bank details
      const bank = settings.bankDetails;
      if (bank.bankName) updateBankDetails('bankName', bank.bankName);
      if (bank.accountNumber) updateBankDetails('accountNumber', bank.accountNumber);
      if (bank.ifscCode) updateBankDetails('ifscCode', bank.ifscCode);
      if (bank.branchName) updateBankDetails('branchName', bank.branchName);
      if (bank.accountType) updateBankDetails('accountType', bank.accountType);
      // Terms
      if (settings.defaultTerms) updateTerms(settings.defaultTerms);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  const handleStartBlank = useCallback(() => {
    setShowUpload(false);
  }, []);

  const handlePOProcessed = useCallback(() => {
    setShowUpload(false);
    toast.success('PO data imported into invoice');
  }, []);

  const handleExportPDF = useCallback(() => {
    setShowPDFPreview(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {draftId ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <p className="text-sm text-gray-500">
          {draftId ? `Editing: ${invoice.invoiceNumber}` : 'Upload a PO or start with a blank invoice'}
        </p>
      </div>

      {showUpload && (
        <POUploadZone
          onStartBlank={handleStartBlank}
          onPOProcessed={handlePOProcessed}
        />
      )}

      {!showUpload && (
        <InvoiceEditor onExportPDF={handleExportPDF} />
      )}

      <PDFPreviewDialog
        open={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        invoice={invoice}
        totals={totals}
      />
    </div>
  );
}
