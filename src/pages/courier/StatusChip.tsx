import { cn } from '@/lib/utils';
import { resolveStatus, type StatusTone } from './statuses';
import type { Status } from '@/lib/types';

/**
 * Pastille de statut — icône + libellé, jamais la couleur seule.
 *
 * Les fonds restent des teintes à 10 % : quatre aplats saturés répétés sur 50
 * cartes feraient un damier. La couleur signale, elle ne remplit pas.
 */
const TONE_CLASSES: Record<StatusTone, string> = {
  warning: 'border-gov-warning/25 bg-gov-warning/10 text-gov-warning',
  error: 'border-gov-error/25 bg-gov-error/10 text-gov-error',
  info: 'border-gov-info/25 bg-gov-info/10 text-gov-info',
  success: 'border-gov-green/25 bg-gov-green/10 text-gov-green',
  neutral: 'border-gov-gray-medium bg-gov-gray text-gov-gray-dark',
};

interface StatusChipProps {
  id?: string;
  status?: Status;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusChip({ id, status, size = 'md', className }: StatusChipProps) {
  const { label, icon: Icon, tone } = resolveStatus(id, status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        TONE_CLASSES[tone],
        className
      )}
    >
      <Icon size={size === 'sm' ? 12 : 13} strokeWidth={2} aria-hidden="true" />
      {label}
    </span>
  );
}
