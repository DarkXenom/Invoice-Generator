'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EditableCellProps {
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  align?: 'left' | 'center' | 'right';
  disabled?: boolean;
}

export function EditableCell({
  value,
  onChange,
  type = 'text',
  placeholder = '-',
  className,
  inputClassName,
  align = 'left',
  disabled = false,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    setIsEditing(false);
    if (editValue !== String(value)) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      setEditValue(String(value));
      setIsEditing(false);
    } else if (e.key === 'Tab') {
      handleConfirm();
    }
  };

  if (disabled) {
    return (
      <span className={cn('block px-2 py-1 text-sm text-muted-foreground', className)}>
        {value || placeholder}
      </span>
    );
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleConfirm}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-8 text-sm rounded-sm border-blue-400 focus-visible:ring-blue-400',
          align === 'right' && 'text-right',
          align === 'center' && 'text-center',
          inputClassName
        )}
        step={type === 'number' ? 'any' : undefined}
      />
    );
  }

  const displayValue = value === 0 && type === 'number' ? '0' : value;

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={cn(
        'block px-2 py-1 text-sm cursor-pointer rounded hover:bg-blue-50 transition-colors min-h-[2rem] flex items-center',
        align === 'right' && 'justify-end',
        align === 'center' && 'justify-center',
        !displayValue && 'text-muted-foreground italic',
        className
      )}
    >
      {displayValue || placeholder}
    </span>
  );
}
