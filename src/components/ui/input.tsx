import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[var(--radius-input)] border border-gov-gray-medium bg-gov-surface px-3 py-2 text-sm text-gov-dark placeholder:text-gov-gray-dark focus:outline-none focus:ring-2 focus:ring-gov-green/25 focus:border-gov-green transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
