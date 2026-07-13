import * as React from 'react';

/** Les trois modes disponibles : clair forcé, sombre forcé, ou suivre l'OS. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Le thème résolu effectivement appliqué (jamais 'system'). */
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** Le mode sélectionné par l'utilisateur (peut être 'system'). */
  mode: ThemeMode;
  /** Le thème effectivement appliqué (light ou dark). */
  resolved: ResolvedTheme;
  /** Changer le mode (light → dark → system → light). */
  cycleTheme: () => void;
  /** Forcer un mode. */
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'cc_theme_mode';
const CYCLE: ThemeMode[] = ['light', 'dark', 'system'];

/** Résout le mode 'system' en lisant prefers-color-scheme. */
function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode !== 'system') return mode;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyToDOM(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored && CYCLE.includes(stored) ? stored : 'system';
  });

  const resolved = resolveTheme(mode);

  // Appliquer immédiatement sur le DOM
  React.useEffect(() => {
    applyToDOM(resolved);
  }, [resolved]);

  // Persister le choix
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  // Écouter les changements prefers-color-scheme quand mode = 'system'
  React.useEffect(() => {
    if (mode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      applyToDOM(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolved,
      setMode: setModeState,
      cycleTheme: () =>
        setModeState((prev) => {
          const idx = CYCLE.indexOf(prev);
          return CYCLE[(idx + 1) % CYCLE.length];
        }),
    }),
    [mode, resolved],
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}

/**
 * Thème partagé par toute l'application.
 * Retourne `mode` (light | dark | system), `resolved` (light | dark),
 * plus `theme` et `toggleTheme` pour la rétro-compatibilité.
 */
export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans un <ThemeProvider>');
  return {
    ...ctx,
    /** @deprecated Utiliser `resolved` à la place */
    theme: ctx.resolved,
    /** @deprecated Utiliser `cycleTheme` à la place */
    toggleTheme: ctx.cycleTheme,
    setTheme: ctx.setMode,
  };
}

// ── Rétro-compatibilité : `theme` et `toggleTheme` ──
// Certains composants existants utilisent `theme` et `toggleTheme` :
// on exporte un wrapper compatible.
export function useThemeCompat() {
  const { mode, resolved, cycleTheme, setMode } = useTheme();
  return {
    theme: resolved,
    mode,
    toggleTheme: cycleTheme,
    cycleTheme,
    setMode,
    setTheme: (t: ResolvedTheme) => setMode(t),
  };
}
