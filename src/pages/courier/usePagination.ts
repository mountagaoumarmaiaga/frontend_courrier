import { useCallback, useMemo, useState } from 'react';

export interface PaginationResult<T> {
  /** Les éléments de la page courante — c'est tout ce que la grille rend. */
  items: T[];
  page: number;
  pageCount: number;
  /** Rang du premier / dernier élément affiché (1-indexé, pour « x–y sur N »). */
  from: number;
  to: number;
  total: number;
  setPage: (page: number) => void;
  reset: () => void;
}

/**
 * Découpe une collection en pages. Ne sait **rien** de la recherche : on lui
 * passe une liste, elle en rend une tranche. C'est ce qui permet de brancher
 * la même pagination sur le corpus complet ou sur un résultat de recherche.
 *
 * Le numéro de page est borné à la lecture plutôt que corrigé par un effet :
 * quand une recherche fait fondre 10 000 dossiers à 3, la page 37 n'existe
 * plus et l'on rend la dernière page valide sans rendu intermédiaire vide.
 */
export function usePagination<T>(items: T[], pageSize: number): PaginationResult<T> {
  const [requestedPage, setRequestedPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(requestedPage, 1), pageCount);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  const reset = useCallback(() => setRequestedPage(1), []);

  return {
    items: pageItems,
    page,
    pageCount,
    from: items.length === 0 ? 0 : (page - 1) * pageSize + 1,
    to: Math.min(page * pageSize, items.length),
    total: items.length,
    setPage: setRequestedPage,
    reset,
  };
}
