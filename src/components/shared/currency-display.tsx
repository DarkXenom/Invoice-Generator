import { formatINR } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
}

export function CurrencyDisplay({ amount, className }: CurrencyDisplayProps) {
  return (
    <span className={cn('font-mono tabular-nums', className)}>
      {formatINR(amount)}
    </span>
  );
}
