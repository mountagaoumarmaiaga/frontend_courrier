import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
}

/**
 * Fenêtre de numéros : première, dernière, la courante et ses voisines.
 * Avec ~10 000 dossiers (soit des centaines de pages), aligner tous les
 * numéros est impraticable — et un agent navigue de proche en proche ou saute
 * aux extrémités, jamais à la page 143 par hasard.
 */
function pageWindow(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const pages = new Set([1, pageCount, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  const result: (number | 'gap')[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - (sorted[index - 1] as number) > 1) result.push('gap');
    result.push(p);
  });
  return result;
}

/** Pagination de la grille — aucun geste primaire ici, tout est secondaire. */
export function Pagination({ page, pageCount, from, to, total, onPageChange }: PaginationProps) {
  if (total === 0) return null;

  return (
    <nav
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gov-gray-medium pt-5 sm:flex-row"
      aria-label="Pagination des dossiers"
    >
      <p className="text-[13px] text-gov-gray-dark" aria-live="polite">
        Dossiers <span className="font-semibold text-gov-dark">{from}</span>–
        <span className="font-semibold text-gov-dark">{to}</span> sur{' '}
        <span className="font-semibold text-gov-dark">{total.toLocaleString('fr-FR')}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
        >
          <ChevronLeft size={15} strokeWidth={1.75} />
          <span className="hidden sm:inline">Précédent</span>
        </Button>

        {pageWindow(page, pageCount).map((entry, index) =>
          entry === 'gap' ? (
            <span
              key={`gap-${index}`}
              className="px-1.5 text-[13px] text-gov-gray-dark"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-label={`Page ${entry}`}
              aria-current={entry === page ? 'page' : undefined}
              className={[
                'h-8 min-w-8 rounded-[var(--radius-btn)] px-2 text-[13px] transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold',
                entry === page
                  ? 'bg-gov-green/10 font-semibold text-gov-dark ring-1 ring-inset ring-gov-green/20'
                  : 'font-medium text-gov-gray-dark hover:bg-gov-gray hover:text-gov-dark',
              ].join(' ')}
            >
              {entry}
            </button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Page suivante"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight size={15} strokeWidth={1.75} />
        </Button>
      </div>
    </nav>
  );
}
