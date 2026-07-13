import { tokenStorage } from '@/lib/api/client';
import { authApi } from '@/lib/api/endpoints';
import type { LoginCredentials, User } from '@/lib/types';

/**
 * Logique d'authentification, branchée sur le module `auth` du backend
 * (login · logout · me · reset-password). Persiste le jeton et l'utilisateur
 * dans le stockage local ; aucune donnée fictive.
 */
const USER_KEY = 'auth_user';

export const authService = {
  /** Connexion : POST /auth/login → { token, user }. */
  async login(credentials: LoginCredentials): Promise<User> {
    const { token, user } = (await authApi.login(credentials)).data.data;
    tokenStorage.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  /** Déconnexion : notifie le backend puis purge la session locale. */
  async logout(): Promise<void> {
    await authApi.logout().catch(() => undefined); // ne bloque pas la déconnexion locale
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
  },

  /** Restaure la session au démarrage : revalide le jeton via GET /auth/me. */
  async restore(): Promise<User | null> {
    if (!tokenStorage.get()) return null;
    try {
      const user = (await authApi.me()).data.data;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      tokenStorage.clear();
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  /**
   * Réinitialisation du mot de passe d'un utilisateur par un administrateur
   * (POST /auth/reset-password/{id}). L'API régénère le mot de passe et
   * le renvoie en clair dans la réponse.
   */
  async resetPassword(id: string): Promise<string> {
    const response = await authApi.resetPassword(id);
    return response.data.data.plain_password;
  },
};
