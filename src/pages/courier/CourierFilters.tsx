import { CalendarDays, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { resolveStatus, type StatusOption } from './statuses';
import {
  DATE_PRESETS,
  EMPTY_FILTERS,
  formatRangeLabel,
  hasActiveFilters,
  type CourierFiltersState,
} from './filters';

interface CourierFiltersProps {
  value: CourierFiltersState;
  onChange: (next: CourierFiltersState) => void;
  /** Statuts réellement présents dans le corpus (déduits, non codés en dur). */
  options: StatusOption[];
}

/**
 * Zone de filtres, à côté de la recherche : chips de statut multi-sélectionnables,
 * plage de dates sur `submissionDate`, réinitialisation.
 *
 * La remise à zéro ne touche pas la recherche : celle-ci a sa propre croix, et
 * un bouton « Réinitialiser les filtres » qui viderait aussi le champ de saisie
 * effacerait un travail que l'agent n'a pas demandé d'effacer.
 */
export function CourierFilters({ value, onChange, options }: CourierFiltersProps) {
  const toggleStatus = (id: string) => {
    const next = value.statusIds.includes(id)
      ? value.statusIds.filter((current) => current !== id)
      : [...value.statusIds, id];
    onChange({ ...value, statusIds: next });
  };

  const active = hasActiveFilters(value);
  const dateActive = Boolean(value.from || value.to);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ─── Statuts ─── */}
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrer par statut">
        {options.map((option) => {
          const selected = value.statusIds.includes(option.id);
          const { icon: Icon } = resolveStatus(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleStatus(option.id)}
              aria-pressed={selected}
              className={[
                'inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 text-[13px] font-medium',
                'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold',
                /*
                 * Sélection portée par trois signaux (fond, liseré, graisse) et
                 * non par la seule couleur — et surtout pas par la couleur du
                 * statut, qui doit rester le langage des pastilles.
                 */
                selected
                  ? 'border-gov-green/30 bg-gov-green/10 font-semibold text-gov-dark ring-1 ring-inset ring-gov-green/20'
                  : 'border-gov-gray-medium bg-gov-surface text-gov-gray-dark hover:border-gov-gray-dark hover:text-gov-dark',
              ].join(' ')}
            >
              <Icon size={13} strokeWidth={2} aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* ─── Plage de dates ─── */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={[
              'inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 text-[13px] font-medium',
              'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold',
              dateActive
                ? 'border-gov-green/30 bg-gov-green/10 font-semibold text-gov-dark ring-1 ring-inset ring-gov-green/20'
                : 'border-gov-gray-medium bg-gov-surface text-gov-gray-dark hover:border-gov-gray-dark hover:text-gov-dark',
            ].join(' ')}
          >
            <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />
            {formatRangeLabel(value.from, value.to)}
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gov-gray-dark">
            Date de dépôt
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange({ ...value, ...preset.range() })}
                className="rounded-[var(--radius-pill)] border border-gov-gray-medium bg-gov-surface px-2.5 py-1 text-[12px] font-medium text-gov-gray-dark transition-colors duration-150 hover:border-gov-gray-dark hover:text-gov-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="my-4 h-px bg-gov-gray-medium" aria-hidden="true" />

          <div className="grid grid-cols-2 gap-2">
            <DateField
              label="Du"
              value={value.from}
              max={value.to || undefined}
              onChange={(from) => onChange({ ...value, from })}
            />
            <DateField
              label="Au"
              value={value.to}
              min={value.from || undefined}
              onChange={(to) => onChange({ ...value, to })}
            />
          </div>

          {dateActive && (
            <button
              type="button"
              onClick={() => onChange({ ...value, from: '', to: '' })}
              className="mt-3 text-[12px] font-medium text-gov-gray-dark underline decoration-gov-gray-medium underline-offset-2 transition-colors hover:text-gov-dark"
            >
              Effacer les dates
            </button>
          )}
        </PopoverContent>
      </Popover>

      {/* ─── Réinitialisation ─── */}
      {active && (
        <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
          <RotateCcw size={14} strokeWidth={1.75} />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}

function DateField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-gov-gray-dark">
        {label}
      </span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-9 w-full rounded-[var(--radius-input)] border border-gov-gray-medium bg-gov-surface px-2 text-[13px] text-gov-dark transition-colors duration-200 focus:border-gov-gold focus:outline-none focus:ring-1 focus:ring-gov-gold"
      />
    </label>
  );
}
