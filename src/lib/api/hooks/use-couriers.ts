import { useQuery, useQueryClient } from '@tanstack/react-query';
import { courierApi } from '../endpoints';
import { queryKeys } from '../query-keys';
import type { ApiEnvelope, Courier, CourierHistory, CourierListParams } from '@/lib/types';

/**
 * Hooks TanStack Query du module « Courrier ».
 *
 * Convention de l'équipe : le hook gère le cache, le composant gère l'UX.
 */

/** Vrai si la réponse est enveloppée `{ success, data, message }`. */
function isEnvelope<T>(payload: ApiEnvelope<T> | T): payload is ApiEnvelope<T> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    'success' in payload
  );
}

/**
 * Normalise les deux formes de réponse (tableau nu du dossier technique vs
 * enveloppe archimind) en une valeur unique.
 */
function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  return isEnvelope(payload) ? payload.data : payload;
}

/**
 * GET /couriers — dataset complet des courriers.
 *
 * Volontairement appelé **sans `search`** par la page liste : la recherche est
 * une affaire cliente (Fuse.js, voir `useCourierSearch`) et doit porter sur
 * tout le corpus, pas sur la page affichée. Les `params` restent disponibles
 * pour les filtres serveur (statut, service), qui eux réduisent légitimement
 * le dataset.
 *
 * Cache long : jusqu'à ~10 000 dossiers transitent ici, on évite de refaire
 * l'aller-retour à chaque montage (retour depuis le détail, par exemple).
 */
export function useCouriers(params: CourierListParams = {}) {
  return useQuery({
    queryKey: queryKeys.couriers.list(params),
    queryFn: async (): Promise<Courier[]> => unwrap((await courierApi.index(params)).data),
    staleTime: 5 * 60_000,
  });
}

/** GET /couriers/{id} — détail d'un dossier. */
export function useCourier(id: string | undefined) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: queryKeys.couriers.detail(id ?? ''),
    queryFn: async (): Promise<Courier> => unwrap((await courierApi.show(id!)).data),
    enabled: Boolean(id),
    /*
     * Le dossier vient d'être ouvert depuis la grille : on affiche
     * immédiatement l'exemplaire déjà en cache pendant que le détail complet
     * se charge. L'en-tête (référence) est ainsi visible sans attente.
     */
    placeholderData: () =>
      qc
        .getQueryData<Courier[]>(queryKeys.couriers.list())
        ?.find((courier) => courier.id === id),
  });
}

/**
 * GET /couriers/{id}/history — journal d'étapes (`Courier_Histories`).
 *
 * Les étapes sont triées par `stepNumber` à la lecture : la timeline se lit du
 * dépôt à l'étape courante, et rien ne garantit que le backend les rende dans
 * cet ordre.
 */
export function useCourierHistory(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.couriers.history(id ?? ''),
    queryFn: async (): Promise<CourierHistory[]> => {
      const steps = (await courierApi.history(id!)).data.data;
      return [...steps].sort((a, b) => a.stepNumber - b.stepNumber);
    },
    enabled: Boolean(id),
  });
}
