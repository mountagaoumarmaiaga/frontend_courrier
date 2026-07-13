import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from './client';

/**
 * Instance unique de TanStack Query, partagée par toute l'application.
 *
 * Réglages adaptés à un guichet métier interne (application ministérielle) :
 *   · `refetchOnWindowFocus` désactivé — les agents basculent souvent de
 *     fenêtre ; on évite les rechargements intempestifs ;
 *   · `staleTime` d'une minute — limite les appels réseau redondants ;
 *   · pas de nouvel essai sur une erreur client 4xx (401/403/404/422) : la
 *     réponse ne changera pas en réessayant. On ne retente que les erreurs
 *     réseau/serveur, deux fois au maximum.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = (error as unknown as ApiError)?.status;
        if (typeof status === 'number' && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
