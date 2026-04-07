'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInvoiceStore } from '@/stores/invoice-store';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { extractPOData } from '@/lib/po-data-extractor';
import { toast } from 'sonner';

interface POUploadZoneProps {
  onStartBlank: () => void;
  onPOProcessed: () => void;
}

export function POUploadZone({ onStartBlank, onPOProcessed }: POUploadZoneProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const loadFromPO = useInvoiceStore(s => s.loadFromPO);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);
    try {
      const rawText = await extractTextFromPDF(file);

      if (!rawText || rawText.trim().length < 20) {
        toast.warning('Could not extract text from PDF. The file may be a scanned image. Starting blank invoice instead.');
        onStartBlank();
        return;
      }

      const poData = extractPOData(rawText);
      loadFromPO(poData);
      onPOProcessed();
    } catch (error) {
      console.error('PO processing error:', error);
      toast.error('Failed to process PO file. Starting blank invoice.');
      onStartBlank();
    } finally {
      setIsProcessing(false);
    }
  }, [loadFromPO, onPOProcessed, onStartBlank]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 mb-8">
      <Card>
        <CardContent className="p-8">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            {isProcessing ? (
              <div className="space-y-3">
                <Loader2 className="h-10 w-10 mx-auto text-blue-500 animate-spin" />
                <p className="text-sm font-medium text-gray-700">Processing Purchase Order...</p>
                <p className="text-xs text-gray-500">Extracting text and identifying fields</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <div>
                  <p className="text-base font-medium text-gray-700">
                    Drop your Purchase Order PDF here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to browse. We&apos;ll extract the data automatically.
                  </p>
                </div>
                <label className="cursor-pointer inline-block">
                  <span className="inline-flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors">
                    <FileText className="h-3.5 w-3.5" />
                    Select PDF File
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <Button
        variant="ghost"
        className="w-full gap-2 text-gray-600 hover:text-gray-900"
        onClick={onStartBlank}
      >
        Start with a blank invoice
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
