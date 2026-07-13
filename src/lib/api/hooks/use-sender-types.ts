import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { senderTypeApi } from '../endpoints';
import { queryKeys } from '../query-keys';
import type { SenderType, SenderTypePayload } from '@/lib/types';

/**
 * Hooks TanStack Query du module « Réglages › Types de soumissionnaires ».
 * Même convention que les services : le hook gère le cache, le composant l'UX.
 */

/** GET /sender-types — liste des types de soumissionnaires. */
export function useSenderTypes() {
  return useQuery({
    queryKey: queryKeys.senderTypes.list(),
    queryFn: async (): Promise<SenderType[]> =>
      (await senderTypeApi.index()).data.data,
  });
}

/** POST /sender-types — création. */
export function useCreateSenderType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SenderTypePayload) => senderTypeApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.senderTypes.all }),
  });
}

/** PUT /sender-types/{id} — modification. */
export function useUpdateSenderType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SenderTypePayload }) =>
      senderTypeApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.senderTypes.all }),
  });
}

/** DELETE /sender-types/{id} — suppression (à câbler par l'affichage). */
export function useDeleteSenderType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => senderTypeApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.senderTypes.all }),
  });
}
