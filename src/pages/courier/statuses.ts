import { Ban, CheckCircle2, CircleDashed, Hourglass, LoaderCircle, type LucideIcon } from 'lucide-react';
import type { Courier, Status } from '@/lib/types';

/**
 * Vocabulaire des statuts (`Statuses`).
 *
 * `GET /statuses` n'existe pas (404 vérifié) : le référentiel est donc local.
 *
 * La résolution se fait sur **l'identifiant ET le libellé, normalisés**, parce
 * que la forme réelle est ambiguë : l'API renvoie « Terminé », « Bloqué »… mais
 * rien ne dit si c'est `id_status` qui porte ce texte ou la relation
 * `status.name`. Chercher les deux couvre les deux cas sans deviner, et les
 * alias encaissent un backend qui basculerait un jour sur des codes anglais.
 *
 * Chaque statut est doublé d'un libellé et d'une icône : jamais porté par la
 * seule couleur (exigence RGAA/AAA du produit).
 */

export type StatusKey = 'pending' | 'blocked' | 'progress' | 'done' | 'unknown';

export type StatusTone = 'warning' | 'error' | 'info' | 'success' | 'neutral';

export interface StatusVisual {
  key: StatusKey;
  label: string;
  icon: LucideIcon;
  tone: StatusTone;
}

/** Ordre d'affichage des chips de filtre, fixé par le métier. */
export const STATUS_ORDER: StatusKey[] = ['pending', 'progress', 'done', 'blocked'];

const VISUALS: Record<Exclude<StatusKey, 'unknown'>, Omit<StatusVisual, 'key'>> = {
  pending: { label: 'En attente', icon: Hourglass, tone: 'warning' },
  blocked: { label: 'Bloqué', icon: Ban, tone: 'error' },
  progress: { label: 'En cours', icon: LoaderCircle, tone: 'info' },
  done: { label: 'Terminé', icon: CheckCircle2, tone: 'success' },
};

/** Formes rencontrées (FR) ou plausibles (codes du cahier des charges). */
const ALIASES: Record<string, Exclude<StatusKey, 'unknown'>> = {
  'en attente': 'pending',
  attente: 'pending',
  pending: 'pending',
  waiting: 'pending',
  recu: 'pending',
  received: 'pending',

  bloque: 'blocked',
  blocked: 'blocked',
  rejete: 'blocked',
  rejected: 'blocked',
  suspendu: 'blocked',

  'en cours': 'progress',
  'in progress': 'progress',
  processing: 'progress',
  transmis: 'progress',
  transmitted: 'progress',

  termine: 'done',
  completed: 'done',
  done: 'done',
  valide: 'done',
  validated: 'done',
  clos: 'done',
  closed: 'done',
};

/** minuscules, sans accents, séparateurs unifiés — « IN_PROGRESS » → « in progress ». */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .trim();
}

const FALLBACK: StatusVisual = {
  key: 'unknown',
  label: 'Statut inconnu',
  icon: CircleDashed,
  tone: 'neutral',
};

/**
 * Résout le rendu d'un statut. Le libellé renvoyé par l'API prime sur le
 * libellé local : c'est le back qui fait foi côté vocabulaire.
 */
export function resolveStatus(id?: string, status?: Status): StatusVisual {
  const key = (id && ALIASES[normalize(id)]) || (status?.name && ALIASES[normalize(status.name)]);

  if (!key) {
    return { ...FALLBACK, label: status?.name ?? id ?? FALLBACK.label };
  }
  return { key, ...VISUALS[key], label: status?.name ?? VISUALS[key].label };
}

export interface StatusOption {
  id: string;
  label: string;
  key: StatusKey;
}

/**
 * Options du filtre, **déduites du dataset** plutôt que codées en dur : les
 * identifiants réels des statuts ne sont pas documentés, et les lire dans les
 * dossiers évite de les deviner. Triées selon `STATUS_ORDER`.
 */
export function statusOptions(couriers: Courier[]): StatusOption[] {
  const seen = new Map<string, StatusOption>();

  for (const courier of couriers) {
    if (!courier.id_status || seen.has(courier.id_status)) continue;
    const { key, label } = resolveStatus(courier.id_status, courier.status);
    seen.set(courier.id_status, { id: courier.id_status, label, key });
  }

  return [...seen.values()].sort((a, b) => {
    const rankA = STATUS_ORDER.indexOf(a.key);
    const rankB = STATUS_ORDER.indexOf(b.key);
    // Les statuts hors référentiel se rangent en fin de liste, par ordre alpha.
    if (rankA !== rankB) return (rankA < 0 ? 99 : rankA) - (rankB < 0 ? 99 : rankB);
    return a.label.localeCompare(b.label, 'fr');
  });
}
