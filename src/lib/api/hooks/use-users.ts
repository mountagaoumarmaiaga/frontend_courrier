import { useQuery } from '@tanstack/react-query';
import { userApi } from '../endpoints';
import { queryKeys } from '../query-keys';
import type { User } from '@/lib/types';

/**
 * GET /users — annuaire des employés.
 *
 * Utilisé par la timeline pour nommer l'agent d'une étape : `/history` ne
 * renvoie qu'un `id_user`. L'endpoint peut être réservé aux administrateurs
 * (403 selon le rôle) — les appelants doivent donc traiter l'échec comme
 * « pas de nom à afficher », jamais comme une erreur bloquante.
 */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: async (): Promise<User[]> => (await userApi.index()).data.data,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
