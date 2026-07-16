import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

/**
 * Onglets accessibles (Radix Tabs) au style « souligné » institutionnel :
 * onglet actif = texte vert + filet vert dessous. Clavier & ARIA gérés par
 * Radix. Cohérent avec le système `gov-*` (adaptatif clair/sombre).
 */
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'flex items-center gap-1 border-b border-gov-gray-medium',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      '-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-4 py-2.5',
      // On ne transitionne QUE le filet (border) : la couleur du texte prend
      // sa valeur tout de suite, évitant tout flash clair→sombre au montage.
      'text-sm font-medium text-gov-gray-dark transition-[border-color] duration-150',
      'hover:text-gov-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold focus-visible:ring-offset-1',
      // Actif : libellé en encre (fort contraste) + filet vert comme indicateur.
      'data-[state=active]:border-gov-green data-[state=active]:font-semibold data-[state=active]:text-gov-dark',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-6 animate-fade-in focus-visible:outline-none',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
