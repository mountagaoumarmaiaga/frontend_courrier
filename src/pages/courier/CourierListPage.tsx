import { useEffect, useMemo, useState } from 'react';
import { FolderOpen, RotateCw, Search, SearchX, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCouriers } from '@/lib/api/hooks/use-couriers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { CourierFilters } from './CourierFilters';
import { CourierFolderTile } from './CourierFolderTile';
import { Pagination } from './Pagination';
import { searchWithin, useCourierIndex } from './useCourierSearch';
import { usePagination } from './usePagination';
import { statusOptions } from './statuses';
import { EMPTY_FILTERS, hasActiveFilters, withinRange } from './filters';
import type { Courier } from '@/lib/types';

/**
 * `courier.index` — le registre, en grille de dossiers.
 *
 * Le dataset complet est chargé **une seule fois** (`useCouriers`, cache 5 min)
 * et tout se joue ensuite en mémoire : changer un filtre ou de page ne
 * redemande rien au serveur. C'est aussi le seul choix disponible aujourd'hui —
 * `courier.index` n'expose ni `page` ni `per_page`, seulement `id_status`,
 * `id_currentService` et `search`.
 */
const PAGE_SIZE = 50;

/**
 * Tri du registre : du dépôt le plus récent au plus ancien.
 *
 * Note : ce tri s'applique aussi aux résultats de recherche, donc il écrase le
 * classement par pertinence de Fuse. C'est voulu — sur un registre, on cherche
 * une référence précise, pas le « meilleur » résultat.
 */
function byDateDesc(a: Courier, b: Courier): number {
  return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
}

/**
 * Aperçu affiché dans la grille — **un seul à la fois**, d'où un état unique
 * ici plutôt qu'un état par carte.
 *
 * Arbitrage : un aperçu épinglé garde la main. Survoler une autre carte ne le
 * chasse pas, sinon on perdrait l'aperçu qu'on venait justement de fixer pour
 * en recopier le téléphone.
 */
interface Preview {
  id: string;
  pinned: boolean;
}

export function CourierListPage() {
  const couriers = useCouriers();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [preview, setPreview] = useState<Preview | null>(null);
  const debouncedQuery = useDebouncedValue(query, 250);

  const handleHoverChange = (id: string, hovered: boolean) =>
    setPreview((current) => {
      if (current?.pinned) return current;
      if (hovered) return { id, pinned: false };
      return current?.id === id ? null : current;
    });

  const handlePinToggle = (id: string) =>
    setPreview((current) => (current?.id === id && current.pinned ? null : { id, pinned: true }));

  const handleDismiss = (id: string) =>
    setPreview((current) => (current?.id === id ? null : current));

  // Index Fuse : lié au corpus seul, jamais reconstruit par un filtre.
  const fuse = useCourierIndex(couriers.data);

  const options = useMemo(() => statusOptions(couriers.data ?? []), [couriers.data]);

  /**
   * Pipeline unique — statut → dates → recherche → tri. Un seul état dérivé
   * pilote l'affichage : impossible que « filtré » et « paginé » divergent,
   * puisque la pagination n'est qu'une tranche de ce résultat.
   */
  const visible = useMemo(() => {
    const all = couriers.data ?? [];

    // 1. Statut — sur l'ensemble des dossiers.
    let result =
      filters.statusIds.length > 0
        ? all.filter((courier) => filters.statusIds.includes(courier.id_status))
        : all;

    // 2. Plage de dates — sur le résultat de l'étape 1.
    if (filters.from || filters.to) {
      result = result.filter((courier) =>
        withinRange(courier.submissionDate, filters.from, filters.to)
      );
    }

    // 3. Recherche — sur le résultat de l'étape 2, index réutilisé.
    const trimmed = debouncedQuery.trim();
    if (trimmed) result = searchWithin(fuse, trimmed, result);

    // 4. Tri — sur le résultat final.
    return [...result].sort(byDateDesc);
  }, [couriers.data, filters, debouncedQuery, fuse]);

  // 5. Pagination — en dernier, sur le résultat final uniquement.
  const pagination = usePagination(visible, PAGE_SIZE);

  // Tout changement de filtre ou de recherche ramène page 1 : rester page 12
  // d'un résultat qui n'en compte plus que 2 n'a aucun sens.
  const { reset } = pagination;
  useEffect(() => reset(), [filters, debouncedQuery, reset]);

  const narrowed = debouncedQuery.trim().length > 0 || hasActiveFilters(filters);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gov-dark">Courriers</h1>
        <p className="mt-1 text-sm text-gov-gray-dark">
          Le registre des plis déposés. Ouvrez un dossier, ou survolez-le pour un aperçu.
        </p>
      </header>

      {/* ─── Recherche + filtres ─── */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gov-gray-dark"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Référence, référence physique, soumissionnaire, téléphone, email…"
            aria-label="Rechercher un dossier dans tout le registre"
            className="h-11 w-full rounded-[var(--radius-input)] border border-gov-gray-medium bg-gov-surface pl-9 pr-9 text-sm text-gov-dark transition-colors duration-200 placeholder:text-gov-gray-dark focus:border-gov-gold focus:outline-none focus:ring-1 focus:ring-gov-gold [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Effacer la recherche"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[var(--radius-pill)] text-gov-gray-dark transition-colors duration-150 hover:bg-gov-gray hover:text-gov-dark"
            >
              <X size={14} strokeWidth={1.75} />
            </button>
          )}
        </div>

        <CourierFilters value={filters} onChange={setFilters} options={options} />
      </div>

      {/* ─── Chargement ─── */}
      {couriers.isLoading && <FolderGridSkeleton />}

      {/* ─── Erreur API ─── */}
      {couriers.isError && (
        <Card className="p-8 text-center">
          <p className="font-heading text-lg font-semibold text-gov-dark">
            Le registre n'a pas pu être chargé
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gov-gray-dark">
            {(couriers.error as { message?: string })?.message ??
              'Une erreur est survenue lors du chargement des dossiers.'}
          </p>
          <Button className="mt-5" onClick={() => couriers.refetch()}>
            <RotateCw size={15} strokeWidth={1.75} /> Réessayer
          </Button>
        </Card>
      )}

      {/* ─── Registre vide ─── */}
      {couriers.data?.length === 0 && (
        <Card className="p-10 text-center">
          <FolderOpen
            size={32}
            strokeWidth={1.5}
            className="mx-auto text-gov-gray-dark"
            aria-hidden="true"
          />
          <p className="mt-3 font-heading text-lg font-semibold text-gov-dark">
            Aucun dossier au registre
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gov-gray-dark">
            Les courriers déposés au guichet ou via le portail usager apparaîtront ici.
          </p>
        </Card>
      )}

      {/* ─── Grille ─── */}
      {couriers.data && couriers.data.length > 0 && (
        <>
          <p className="sr-only" aria-live="polite">
            {pagination.total} dossier(s) {narrowed ? 'correspondent aux critères' : 'au registre'}
          </p>

          {pagination.total === 0 ? (
            <Card className="p-10 text-center">
              <SearchX
                size={32}
                strokeWidth={1.5}
                className="mx-auto text-gov-gray-dark"
                aria-hidden="true"
              />
              <p className="mt-3 font-heading text-lg font-semibold text-gov-dark">
                Aucun dossier ne correspond
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-gov-gray-dark">
                Élargissez la plage de dates, décochez un statut, ou vérifiez la recherche —
                elle porte sur la référence, la référence physique, le nom du soumissionnaire,
                son téléphone et son email.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {hasActiveFilters(filters) && (
                  <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>
                    Réinitialiser les filtres
                  </Button>
                )}
                {query && (
                  <Button variant="secondary" onClick={() => setQuery('')}>
                    Effacer la recherche
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
              {pagination.items.map((courier) => (
                <li key={courier.id}>
                  <CourierFolderTile
                    courier={courier}
                    open={preview?.id === courier.id}
                    pinned={preview?.id === courier.id && preview.pinned}
                    onHoverChange={(hovered) => handleHoverChange(courier.id, hovered)}
                    onPinToggle={() => handlePinToggle(courier.id)}
                    onDismiss={() => handleDismiss(courier.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          <Pagination
            page={pagination.page}
            pageCount={pagination.pageCount}
            from={pagination.from}
            to={pagination.to}
            total={pagination.total}
            onPageChange={pagination.setPage}
          />
        </>
      )}
    </div>
  );
}

/** Squelette calé sur la grille réelle — même gabarit, pas de saut au chargement. */
function FolderGridSkeleton() {
  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3"
      aria-label="Chargement des dossiers"
    >
      {Array.from({ length: 18 }).map((_, index) => (
        <Card key={index} className="flex flex-col gap-3 p-4">
          <Skeleton className="h-9 w-11 rounded-[8px]" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-5 w-20 rounded-[var(--radius-pill)]" />
          </div>
          <Skeleton className="h-3 w-24" />
        </Card>
      ))}
    </div>
  );
}
