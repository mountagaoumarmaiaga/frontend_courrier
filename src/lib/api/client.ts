import axios, { AxiosError } from 'axios';

/**
 * Client HTTP prêt à brancher sur le backend du projet.
 *
 * Conventions supposées :
 *   - Authentification par jeton JWT → en-tête `Authorization: Bearer <token>`
 *   - Erreurs de validation         → { message } ou { errors: { champ: [...] } }
 *
 * L'URL de base vient de la variable d'environnement `VITE_API_URL`.
 * Si elle est absente, l'application tourne en mode démonstration (voir
 * `auth-service.ts`) : aucune requête réseau n'est émise.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Injecte le jeton d'authentification sur chaque requête.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Format d'erreur normalisé, indépendant du backend. */
export interface ApiError {
  status: number;
  message: string;
  fieldErrors: Record<string, string[]>;
}

function normalizeError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data as Record<string, unknown> | undefined;

  if (status === 0) {
    return { status, message: 'Serveur injoignable. Vérifiez votre connexion.', fieldErrors: {} };
  }

  const fieldErrors: Record<string, string[]> = {};
  let serverMessage: string | undefined;

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) serverMessage = data.message;
    const errors = data.errors as Record<string, unknown> | undefined;
    if (errors && typeof errors === 'object') {
      for (const [key, value] of Object.entries(errors)) {
        if (Array.isArray(value)) fieldErrors[key] = value.map(String);
        else if (typeof value === 'string') fieldErrors[key] = [value];
      }
    }
  }

  // Le message renvoyé par l'API prime ; repli générique seulement s'il est absent.
  const fallback =
    status === 401 ? 'Session expirée. Veuillez vous reconnecter.'
    : status === 403 ? 'Accès refusé.'
    : status >= 500 ? 'Erreur du serveur. Réessayez plus tard.'
    : 'Une erreur est survenue.';

  return { status, message: serverMessage ?? fallback, fieldErrors };
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Un jeton expiré/invalide (401) est purgé pour éviter une boucle d'échecs.
    if (error.response?.status === 401) tokenStorage.clear();
    return Promise.reject(normalizeError(error));
  }
);

/** Réponse paginée générique, si le backend en fournit. */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
