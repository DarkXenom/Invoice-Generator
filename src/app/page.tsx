'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Plus, FileText, Archive, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDraftsStore } from '@/stores/drafts-store';
import { formatINR } from '@/lib/constants';

export default function DashboardPage() {
  const drafts = useDraftsStore(s => s.drafts);
  const loadDraftsList = useDraftsStore(s => s.loadDraftsList);

  useEffect(() => {
    loadDraftsList();
  }, [loadDraftsList]);

  const recentDrafts = drafts.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">OMEGA EQUIPMENT AND PROJECTS - Invoice Management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/create">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-blue-50/50">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">New Invoice</p>
                <p className="text-xs text-gray-500">Create from PO or blank</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/drafts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center">
                <Archive className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Saved Drafts</p>
                <p className="text-xs text-gray-500">{drafts.length} invoice{drafts.length !== 1 ? 's' : ''}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Settings</p>
                <p className="text-xs text-gray-500">Company & bank details</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Total Invoices</p>
              <p className="text-xs text-gray-500">{drafts.length} created</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {recentDrafts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {recentDrafts.map((draft) => (
                <Link
                  key={draft.id}
                  href={`/create?draft=${draft.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{draft.invoiceNumber || 'Untitled'}</p>
                    <p className="text-xs text-gray-500">{draft.recipientName || 'No recipient'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium">{formatINR(draft.grandTotal)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(draft.updatedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
