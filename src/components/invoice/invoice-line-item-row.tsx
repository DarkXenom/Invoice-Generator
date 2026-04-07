'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditableCell } from '@/components/shared/editable-cell';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { type LineItem } from '@/types/invoice';
import { GST_RATES, UNIT_OPTIONS } from '@/lib/constants';

interface InvoiceLineItemRowProps {
  item: LineItem;
  index: number;
  taxMode: 'intrastate' | 'interstate';
  onUpdate: (index: number, field: keyof LineItem, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function InvoiceLineItemRow({
  item,
  index,
  taxMode,
  onUpdate,
  onRemove,
  canRemove,
}: InvoiceLineItemRowProps) {
  const handleNumberChange = (field: keyof LineItem, value: string) => {
    const num = parseFloat(value);
    onUpdate(index, field, isNaN(num) ? 0 : num);
  };

  return (
    <tr className="border-b hover:bg-gray-50/50 transition-colors group">
      {/* S.No */}
      <td className="px-2 py-1.5 text-center text-sm text-gray-500 w-10">
        {item.serialNumber}
      </td>

      {/* Description */}
      <td className="px-1 py-1.5 min-w-[180px]">
        <EditableCell
          value={item.description}
          onChange={(v) => onUpdate(index, 'description', v)}
          placeholder="Item description"
        />
      </td>

      {/* HSN/SAC */}
      <td className="px-1 py-1.5 w-24">
        <EditableCell
          value={item.hsnSacCode}
          onChange={(v) => onUpdate(index, 'hsnSacCode', v)}
          placeholder="HSN"
          align="center"
        />
      </td>

      {/* Qty */}
      <td className="px-1 py-1.5 w-20">
        <EditableCell
          value={item.quantity}
          onChange={(v) => handleNumberChange('quantity', v)}
          type="number"
          placeholder="0"
          align="right"
        />
      </td>

      {/* Unit */}
      <td className="px-1 py-1.5 w-20">
        <Select
          value={item.unit}
          onValueChange={(v) => { if (v) onUpdate(index, 'unit', v); }}
        >
          <SelectTrigger className="h-8 text-xs border-none shadow-none hover:bg-blue-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNIT_OPTIONS.map((unit) => (
              <SelectItem key={unit} value={unit} className="text-xs">
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      {/* Rate */}
      <td className="px-1 py-1.5 w-24">
        <EditableCell
          value={item.rate}
          onChange={(v) => handleNumberChange('rate', v)}
          type="number"
          placeholder="0.00"
          align="right"
        />
      </td>

      {/* Discount */}
      <td className="px-1 py-1.5 w-20">
        <EditableCell
          value={item.discount}
          onChange={(v) => handleNumberChange('discount', v)}
          type="number"
          placeholder="0"
          align="right"
        />
      </td>

      {/* Taxable Amount */}
      <td className="px-2 py-1.5 text-right w-28">
        <CurrencyDisplay amount={item.taxableAmount} className="text-sm" />
      </td>

      {/* GST Rate */}
      <td className="px-1 py-1.5 w-20">
        <Select
          value={String(item.gstRate)}
          onValueChange={(v) => { if (v) handleNumberChange('gstRate', v); }}
        >
          <SelectTrigger className="h-8 text-xs border-none shadow-none hover:bg-blue-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GST_RATES.map((rate) => (
              <SelectItem key={rate} value={String(rate)} className="text-xs">
                {rate}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      {/* Tax Amount */}
      <td className="px-2 py-1.5 text-right w-24">
        {taxMode === 'intrastate' ? (
          <div className="text-xs space-y-0.5">
            <div>C: <CurrencyDisplay amount={item.cgstAmount} /></div>
            <div>S: <CurrencyDisplay amount={item.sgstAmount} /></div>
          </div>
        ) : (
          <CurrencyDisplay amount={item.igstAmount} className="text-sm" />
        )}
      </td>

      {/* Total */}
      <td className="px-2 py-1.5 text-right w-28 font-semibold">
        <CurrencyDisplay amount={item.totalAmount} className="text-sm" />
      </td>

      {/* Actions */}
      <td className="px-1 py-1.5 w-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  );
}
