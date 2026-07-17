import { useEffect, useState } from 'react';

/**
 * Retarde la propagation d'une valeur qui change vite (saisie clavier).
 *
 * Sur un corpus de ~10 000 dossiers, relancer Fuse à chaque frappe fait
 * ramer la grille : on attend la fin du mot.
 */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
