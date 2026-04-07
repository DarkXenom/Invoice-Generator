'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Trash2, FileText, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDraftsStore } from '@/stores/drafts-store';
import { formatINR } from '@/lib/constants';
import { toast } from 'sonner';

export default function DraftsPage() {
  const drafts = useDraftsStore(s => s.drafts);
  const loadDraftsList = useDraftsStore(s => s.loadDraftsList);
  const deleteDraft = useDraftsStore(s => s.deleteDraft);

  useEffect(() => {
    loadDraftsList();
  }, [loadDraftsList]);

  const handleDelete = (id: string, invoiceNumber: string) => {
    if (confirm(`Delete draft "${invoiceNumber || 'Untitled'}"? This cannot be undone.`)) {
      deleteDraft(id);
      toast.success('Draft deleted');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Saved Drafts</h2>
          <p className="text-sm text-gray-500">{drafts.length} invoice{drafts.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Link href="/create">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Invoice
          </Button>
        </Link>
      </div>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No drafts yet</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">Create your first invoice to get started</p>
            <Link href="/create">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Create Invoice
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {drafts.map((draft) => (
            <Card key={draft.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between py-3 px-4">
                <Link
                  href={`/create?draft=${draft.id}`}
                  className="flex-1 flex items-center gap-4 min-w-0"
                >
                  <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {draft.invoiceNumber || 'Untitled Invoice'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {draft.recipientName || 'No recipient'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 mr-4">
                    <p className="font-mono text-sm font-medium">{formatINR(draft.grandTotal)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(draft.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                  onClick={() => handleDelete(draft.id, draft.invoiceNumber)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
