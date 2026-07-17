import { cn } from '@/lib/utils';

/**
 * Dossier — l'icône de la carte, façon Finder.
 *
 * Deux tons : la languette arrière plus claire, le rabat avant plus soutenu.
 * C'est ce léger décalage qui fait lire « dossier » plutôt que « rectangle »,
 * sans recourir au relief ni au dégradé.
 *
 * Le parent doit porter la classe `group` pour que l'état de survol joue.
 */
export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      className={cn('h-auto w-full', className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* Languette + corps arrière. */}
      <path
        d="M2 8a4 4 0 0 1 4-4h11.4a4 4 0 0 1 2.83 1.17L23 8h19a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z"
        className="fill-gov-folder-tab"
      />
      {/* Rabat avant. */}
      <path
        d="M2 14a2 2 0 0 1 2-2h40a2 2 0 0 1 2 2v18a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z"
        className="fill-gov-folder transition-transform duration-200 ease-out group-hover:translate-y-[1px]"
      />
    </svg>
  );
}
