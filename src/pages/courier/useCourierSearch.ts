import { useMemo } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Courier } from '@/lib/types';

/**
 * Recherche floue (Fuse.js) sur **tout le corpus**, jamais sur la page
 * affichée : chercher « 0072 » doit trouver le dossier même s'il dort page 37.
 * C'est pour cette raison que `useCouriers()` est appelé sans `search` — le
 * filtrage serveur ne rendrait qu'une page à indexer.
 */

const FUSE_OPTIONS: IFuseOptions<Courier> = {
  keys: [
    { name: 'referenceNumber', weight: 3 },
    { name: 'physicalReference', weight: 2 },
    { name: 'sender.name', weight: 2 },
    { name: 'sender.contact.phone', weight: 1 },
    { name: 'sender.contact.email', weight: 1 },
  ],
  /*
   * `ignoreLocation` : une référence ou un numéro se reconnaît à n'importe
   * quel endroit de la chaîne (« 0072 » dans « CR-2026-0072 »), pas seulement
   * au début. Sans lui, Fuse pénalise les correspondances tardives.
   *
   * Seuil serré (0.3) : sur des références et des téléphones, un flou
   * généreux ramène surtout du bruit.
   */
  ignoreLocation: true,
  threshold: 0.3,
  minMatchCharLength: 2,
};

/**
 * Index Fuse, construit **une seule fois** par corpus.
 *
 * Il ne dépend que du dataset : ni les filtres ni la saisie ne le
 * reconstruisent. Sur ~10 000 dossiers, l'indexation coûte quelques centaines
 * de millisecondes — la refaire à chaque chip cochée rendrait les filtres
 * poussifs.
 */
export function useCourierIndex(couriers: Courier[] | undefined): Fuse<Courier> {
  return useMemo(() => new Fuse(couriers ?? [], FUSE_OPTIONS), [couriers]);
}

/**
 * Recherche restreinte à un sous-ensemble déjà filtré.
 *
 * Fuse ne sait pas interroger une partie de son index : on interroge donc tout
 * le corpus, puis on ne retient que ce qui a survécu aux filtres. Le résultat
 * est identique à « filtrer puis chercher », sans reconstruire l'index à
 * chaque changement de filtre.
 */
export function searchWithin(fuse: Fuse<Courier>, query: string, subset: Courier[]): Courier[] {
  const kept = new Set(subset.map((courier) => courier.id));
  return fuse
    .search(query)
    .map((result) => result.item)
    .filter((courier) => kept.has(courier.id));
}
