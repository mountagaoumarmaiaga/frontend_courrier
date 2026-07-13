import { BRANDING } from '@/lib/branding';

interface EmblemProps {
  className?: string;
  /**
   * Forcer une variante (utile sur un fond fixe, ex. le volet marine qui est
   * toujours sombre). Sans `fixed`, l'emblème suit le thème clair/sombre.
   */
  fixed?: 'light' | 'dark';
}

/**
 * Emblème de la République, affiché à partir d'une image.
 * Les fichiers se trouvent dans `public/` (voir `BRANDING.emblem`) : il suffit
 * de remplacer `emblem-light.svg` / `emblem-dark.svg` par les images réelles.
 */
export function Emblem({ className, fixed }: EmblemProps) {
  const base = `object-contain ${className ?? ''}`.trim();

  if (fixed) {
    return (
      <img src={BRANDING.emblem[fixed]} alt="Emblème de la République du Mali" className={base} />
    );
  }

  return (
    <>
      <img
        src={BRANDING.emblem.light}
        alt="Emblème de la République du Mali"
        className={`${base} block dark:hidden`}
      />
      <img
        src={BRANDING.emblem.dark}
        alt=""
        aria-hidden="true"
        className={`${base} hidden dark:block`}
      />
    </>
  );
}
