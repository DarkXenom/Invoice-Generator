'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GST_STATES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GSTStateSelectProps {
  value: string;
  onValueChange: (stateCode: string, stateName: string) => void;
  className?: string;
  placeholder?: string;
}

export function GSTStateSelect({ value, onValueChange, className, placeholder = 'Select State' }: GSTStateSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(code) => {
        const entry = GST_STATES.find(s => s.code === code);
        if (entry) {
          onValueChange(entry.code, entry.name);
        }
      }}
    >
      <SelectTrigger className={cn('h-8 text-sm', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {GST_STATES.map((state) => (
          <SelectItem key={state.code} value={state.code}>
            {state.code} - {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
