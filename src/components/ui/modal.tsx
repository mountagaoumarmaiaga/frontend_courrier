import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Modal réutilisable, bâti sur Radix Dialog — accessible par défaut
 * (piège de focus, fermeture par Échap et clic sur le fond, attributs ARIA).
 *
 * Fournit la coque (fond assombri + panneau ivoire + en-tête avec titre,
 * description, icône et bouton de fermeture). Le contenu (`children`) reste
 * libre : on y place le formulaire avec ses propres champs et boutons
 * d'action. Style calqué sur le système `gov-*` du projet.
 *
 * Contrôlé : l'appelant pilote `open` / `onOpenChange`.
 */
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Icône affichée dans une pastille dorée à gauche du titre. */
  icon?: React.ReactNode;
  /** Corps du modal (typiquement un `<form>`). */
  children: React.ReactNode;
  /** Largeur maximale du panneau. */
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gov-green-deep/45 backdrop-blur-[2px] animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-[var(--radius-card)] bg-gov-surface p-7 shadow-[var(--shadow-card-lg)] animate-rise',
            'focus:outline-none',
            className,
          )}
        >
          <div className="mb-5 flex items-start gap-3">
            {icon && (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gov-gold/12 text-gov-gold">
                {icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-lg font-bold text-gov-dark">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-0.5 text-sm text-gov-gray-dark">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Fermer"
              className="shrink-0 rounded-lg p-1.5 text-gov-gray-dark transition-colors hover:bg-gov-gray hover:text-gov-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
