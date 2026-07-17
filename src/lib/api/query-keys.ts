import type { CourierListParams } from '@/lib/types';

/**
 * Fabrique centralisée des clés de requête TanStack Query.
 *
 * Chaque module de l'API a son espace de noms. Dériver les clés depuis un
 * seul endroit évite les collisions et permet des invalidations ciblées :
 *   · `queryKeys.auth.all`   → invalide tout le module auth ;
 *   · `queryKeys.auth.me()`  → invalide uniquement l'utilisateur courant.
 *
 * À compléter au fil des modules du backend (courriers, services,
 * institutions, employés…), en suivant la même forme `{ all, …détails }`.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  couriers: {
    all: ['couriers'] as const,
    /**
     * `params` fait partie de la clé : la liste filtrée côté serveur et la
     * liste complète (recherche + pagination client) sont deux caches
     * distincts.
     */
    list: (params: CourierListParams = {}) =>
      [...queryKeys.couriers.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.couriers.all, 'detail', id] as const,
    history: (id: string) => [...queryKeys.couriers.all, 'history', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => [...queryKeys.users.all, 'list'] as const,
  },
  services: {
    all: ['services'] as const,
    list: () => [...queryKeys.services.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.services.all, 'detail', id] as const,
  },
  senderTypes: {
    all: ['sender-types'] as const,
    list: () => [...queryKeys.senderTypes.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.senderTypes.all, 'detail', id] as const,
  },
} as const;
