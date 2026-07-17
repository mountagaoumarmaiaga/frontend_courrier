import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

/**
 * Popover (Radix) — surface flottante d'information rapide.
 *
 * Suit le vocabulaire du système : ivoire posé sur le papier, filet 1px,
 * coins de carte et l'unique ombre « Carte posée ». `Anchor` permet
 * d'accrocher le panneau à un élément autre que le déclencheur (ex. la
 * vignette entière, alors que le déclencheur est l'icône œil).
 */
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-[var(--radius-card)] border border-gov-gray-medium',
        'bg-gov-surface p-4 shadow-[var(--shadow-card)] outline-none animate-fade-in',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
