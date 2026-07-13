import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../endpoints';
import { queryKeys } from '../query-keys';
import type { Service, ServicePayload } from '@/lib/types';

/**
 * Hooks TanStack Query du module « Réglages › Services ».
 *
 * Convention de l'équipe : **le hook gère le cache** (invalidation après
 * mutation) ; **le composant gère l'UX** (toasts de succès, mapping des
 * erreurs de validation sur les champs, fermeture du modal). Les mutations
 * ne déclenchent donc pas de toast elles-mêmes — l'appelant fait `mutateAsync`
 * puis affiche le retour comme il l'entend.
 */

/** GET /services — liste des services (affichage : tableau / cartes). */
export function useServices() {
  return useQuery({
    queryKey: queryKeys.services.list(),
    queryFn: async (): Promise<Service[]> => (await serviceApi.index()).data.data,
  });
}

/** POST /services — création (formulaire d'ajout). */
export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServicePayload) => serviceApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
}

/** PUT /services/{id} — modification (formulaire d'édition). */
export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ServicePayload }) =>
      serviceApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
}

/** DELETE /services/{id} — suppression (à câbler par l'affichage). */
export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
}
