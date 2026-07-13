import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../endpoints';
import { queryKeys } from '../query-keys';
import { tokenStorage } from '../client';
import type { ApiError } from '../client';
import type { User } from '@/lib/types';

/**
 * Hooks TanStack Query pour le module `auth` du backend.
 *
 * La *session* (login / logout / restauration) reste gérée par
 * `AuthContext`, qui synchronise le cache de `me`. Ces hooks servent aux
 * composants qui veulent lire l'utilisateur courant à la demande, ou
 * déclencher la réinitialisation d'un mot de passe côté administrateur.
 */

/**
 * GET /auth/me — utilisateur courant, mis en cache par TanStack Query.
 * Désactivé automatiquement en l'absence de jeton.
 */
export function useMe(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async (): Promise<User> => (await authApi.me()).data.data,
    enabled: enabled && !!tokenStorage.get(),
  });
}

/**
 * POST /auth/reset-password/{id} — réinitialisation par un administrateur.
 * Le backend régénère le mot de passe et l'envoie par e-mail à l'agent.
 * Destiné à la future page de gestion des employés.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (id: string) => authApi.resetPassword(id),
    onSuccess: () =>
      toast.success(
        'Mot de passe réinitialisé. Le nouveau mot de passe a été envoyé par e-mail à l’agent.',
      ),
    onError: (error: ApiError) =>
      toast.error(error.message ?? 'Réinitialisation impossible.'),
  });
}
