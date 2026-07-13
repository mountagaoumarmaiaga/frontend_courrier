import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth/auth-service';
import { queryKeys } from '@/lib/api/query-keys';
import type { LoginCredentials, User } from '@/lib/types';

/** Lecture synchrone du cache local — évite l'écran de chargement au refresh. */
function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** true tant que la session initiale n'a pas été restaurée. */
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const cachedUser = React.useRef(readCachedUser());
  const [user, setUser] = React.useState<User | null>(cachedUser.current);
  // Si un utilisateur en cache existe, on ne bloque pas l'affichage.
  const [isLoading, setIsLoading] = React.useState(cachedUser.current === null);

  /** Reflète l'utilisateur de session dans le cache TanStack Query (`auth.me`). */
  const syncCache = React.useCallback(
    (next: User | null) => {
      if (next) queryClient.setQueryData(queryKeys.auth.me(), next);
      else queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    },
    [queryClient],
  );

  // Revalide le jeton en arrière-plan sans bloquer l'affichage.
  React.useEffect(() => {
    let actif = true;
    authService
      .restore()
      .then((restored) => {
        if (!actif) return;
        setUser(restored);
        syncCache(restored);
      })
      .finally(() => actif && setIsLoading(false));
    return () => {
      actif = false;
    };
  }, [syncCache]);

  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      const loggedIn = await authService.login(credentials);
      setUser(loggedIn);
      syncCache(loggedIn);
      return loggedIn;
    },
    [syncCache],
  );

  const logout = React.useCallback(async () => {
    await authService.logout();
    setUser(null);
    syncCache(null);
  }, [syncCache]);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
  return ctx;
}
