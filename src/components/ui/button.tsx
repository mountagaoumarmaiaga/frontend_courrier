import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-sm',
  {
    variants: {
      variant: {
        default: 'bg-gov-green text-white hover:bg-gov-green-hover shadow-sm hover:shadow-md active:scale-[0.98]',
        secondary: 'bg-gov-surface text-gov-dark border border-gov-gray-medium hover:bg-gov-gray-medium hover:border-gov-gray-dark',
        outline: 'border border-gov-green text-gov-green hover:bg-gov-green hover:text-white',
        ghost: 'text-gov-dark hover:bg-gov-gray-medium',
        destructive: 'bg-gov-error text-white hover:bg-red-700 shadow-sm',
        success: 'bg-gov-success text-white hover:bg-emerald-700 shadow-sm',
        gold: 'bg-gov-gold text-white hover:bg-gov-gold-light shadow-sm',
      },
      size: {
        default: 'h-10 px-5 rounded-[var(--radius-btn)]',
        sm: 'h-8 px-3 text-xs rounded-[var(--radius-btn)]',
        lg: 'h-12 px-8 text-base rounded-[var(--radius-btn)]',
        icon: 'h-9 w-9 rounded-[var(--radius-btn)]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
