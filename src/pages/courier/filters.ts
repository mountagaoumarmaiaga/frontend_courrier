/**
 * État et helpers des filtres de la liste. Volontairement séparé de l'UI :
 * le pipeline d'affichage (`CourierListPage`) consomme `withinRange` sans
 * rien savoir des chips ni des sélecteurs.
 */

export interface CourierFiltersState {
  /** Identifiants de statut retenus. Vide = tous les statuts. */
  statusIds: string[];
  /** Bornes incluses, au format `YYYY-MM-DD` de `<input type="date">`. */
  from: string;
  to: string;
}

export const EMPTY_FILTERS: CourierFiltersState = { statusIds: [], from: '', to: '' };

export function hasActiveFilters(filters: CourierFiltersState): boolean {
  return filters.statusIds.length > 0 || Boolean(filters.from) || Boolean(filters.to);
}

/** `Date` → `YYYY-MM-DD` **local** — `toISOString()` décalerait d'un jour à l'ouest de Greenwich. */
export function toInputDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Test d'appartenance à la plage, bornes incluses.
 *
 * Les bornes sont interprétées en heure locale (`T00:00:00` sans `Z`) : l'agent
 * qui choisit « aujourd'hui » pense à sa journée, pas à celle d'UTC.
 */
export function withinRange(iso: string, from: string, to: string): boolean {
  if (!from && !to) return true;

  const time = new Date(iso).getTime();
  // Date illisible : on montre le dossier plutôt que de l'escamoter d'un filtre.
  if (Number.isNaN(time)) return true;

  if (from && time < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && time > new Date(`${to}T23:59:59.999`).getTime()) return false;
  return true;
}

export interface DatePreset {
  id: string;
  label: string;
  range: () => { from: string; to: string };
}

export const DATE_PRESETS: DatePreset[] = [
  {
    id: 'today',
    label: "Aujourd'hui",
    range: () => {
      const today = toInputDate(new Date());
      return { from: today, to: today };
    },
  },
  {
    id: 'last7',
    label: '7 derniers jours',
    range: () => {
      const now = new Date();
      const start = new Date(now);
      // 6 et non 7 : aujourd'hui compte dans les sept jours.
      start.setDate(now.getDate() - 6);
      return { from: toInputDate(start), to: toInputDate(now) };
    },
  },
  {
    id: 'month',
    label: 'Ce mois-ci',
    range: () => {
      const now = new Date();
      return {
        from: toInputDate(new Date(now.getFullYear(), now.getMonth(), 1)),
        to: toInputDate(now),
      };
    },
  },
];

/** Libellé compact de la plage, pour le bouton du filtre. */
export function formatRangeLabel(from: string, to: string): string {
  const short = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });

  if (from && to) return from === to ? short(from) : `${short(from)} – ${short(to)}`;
  if (from) return `Depuis le ${short(from)}`;
  if (to) return `Jusqu'au ${short(to)}`;
  return 'Toutes les dates';
}
