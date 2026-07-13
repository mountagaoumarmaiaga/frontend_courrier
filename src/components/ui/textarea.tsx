import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[84px] w-full rounded-[var(--radius-input)] border border-gov-gray-medium bg-gov-surface px-3 py-2 text-sm text-gov-dark placeholder:text-gov-gray-dark focus:outline-none focus:ring-2 focus:ring-gov-green/25 focus:border-gov-green transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
