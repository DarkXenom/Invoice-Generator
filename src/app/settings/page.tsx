'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GSTStateSelect } from '@/components/shared/gst-state-select';
import { useSettingsStore } from '@/stores/settings-store';
import { GST_RATES } from '@/lib/constants';

export default function SettingsPage() {
  const company = useSettingsStore(s => s.company);
  const bankDetails = useSettingsStore(s => s.bankDetails);
  const invoicePrefix = useSettingsStore(s => s.invoicePrefix);
  const nextInvoiceSequence = useSettingsStore(s => s.nextInvoiceSequence);
  const defaultTerms = useSettingsStore(s => s.defaultTerms);
  const defaultTaxRate = useSettingsStore(s => s.defaultTaxRate);

  const updateCompany = useSettingsStore(s => s.updateCompany);
  const updateBankDetails = useSettingsStore(s => s.updateBankDetails);
  const setInvoicePrefix = useSettingsStore(s => s.setInvoicePrefix);
  const setDefaultTerms = useSettingsStore(s => s.setDefaultTerms);
  const setDefaultTaxRate = useSettingsStore(s => s.setDefaultTaxRate);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Configure your company details, bank info, and invoice defaults</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Defaults</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>This information appears on all your invoices as the supplier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Company Name</Label>
                  <Input value={company.name} onChange={(e) => updateCompany('name', e.target.value)} placeholder="OMEGA EQUIPMENT AND PROJECTS" />
                </div>
                <div className="space-y-1.5">
                  <Label>GSTIN</Label>
                  <Input value={company.gstin} onChange={(e) => updateCompany('gstin', e.target.value)} placeholder="15-digit GSTIN" maxLength={15} />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Address</Label>
                  <Input value={company.address} onChange={(e) => updateCompany('address', e.target.value)} placeholder="Street Address" />
                </div>
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input value={company.city} onChange={(e) => updateCompany('city', e.target.value)} placeholder="City" />
                </div>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <GSTStateSelect
                    value={company.stateCode}
                    onValueChange={(code, name) => {
                      updateCompany('stateCode', code);
                      updateCompany('state', name);
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Pincode</Label>
                  <Input value={company.pincode} onChange={(e) => updateCompany('pincode', e.target.value)} placeholder="Pincode" maxLength={6} />
                </div>
                <div className="space-y-1.5">
                  <Label>PAN</Label>
                  <Input value={company.pan} onChange={(e) => updateCompany('pan', e.target.value)} placeholder="PAN Number" maxLength={10} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={company.phone} onChange={(e) => updateCompany('phone', e.target.value)} placeholder="Phone Number" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={company.email} onChange={(e) => updateCompany('email', e.target.value)} placeholder="Email Address" type="email" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Bank account info shown on invoices for payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Bank Name</Label>
                  <Input value={bankDetails.bankName} onChange={(e) => updateBankDetails('bankName', e.target.value)} placeholder="Bank Name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Account Number</Label>
                  <Input value={bankDetails.accountNumber} onChange={(e) => updateBankDetails('accountNumber', e.target.value)} placeholder="Account Number" />
                </div>
                <div className="space-y-1.5">
                  <Label>IFSC Code</Label>
                  <Input value={bankDetails.ifscCode} onChange={(e) => updateBankDetails('ifscCode', e.target.value)} placeholder="IFSC Code" />
                </div>
                <div className="space-y-1.5">
                  <Label>Branch</Label>
                  <Input value={bankDetails.branchName} onChange={(e) => updateBankDetails('branchName', e.target.value)} placeholder="Branch Name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Account Type</Label>
                  <Select value={bankDetails.accountType} onValueChange={(v) => { if (v) updateBankDetails('accountType', v); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Defaults</CardTitle>
              <CardDescription>These values are pre-filled when you create a new invoice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Invoice Number Prefix</Label>
                  <Input value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} placeholder="OEP/2026-27/" />
                  <p className="text-xs text-gray-500">Next invoice: {invoicePrefix}{String(nextInvoiceSequence).padStart(3, '0')}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Default GST Rate</Label>
                  <Select value={String(defaultTaxRate)} onValueChange={(v) => setDefaultTaxRate(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GST_RATES.map((rate) => (
                        <SelectItem key={rate} value={String(rate)}>{rate}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Default Terms & Conditions</Label>
                <Textarea
                  value={defaultTerms}
                  onChange={(e) => setDefaultTerms(e.target.value)}
                  placeholder="Terms and conditions..."
                  rows={5}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
