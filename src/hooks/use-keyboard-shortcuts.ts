'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
}

export function useKeyboardShortcuts({ onSave, onExportPDF, onPrint }: ShortcutHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === 's') {
        e.preventDefault();
        onSave?.();
      } else if (isCtrl && e.key === 'e') {
        e.preventDefault();
        onExportPDF?.();
      } else if (isCtrl && e.key === 'p') {
        e.preventDefault();
        onPrint?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSave, onExportPDF, onPrint]);
}
