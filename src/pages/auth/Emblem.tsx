import { BRANDING } from '@/lib/branding';

interface EmblemProps {
  className?: string;
  /**
   * Conservé pour compatibilité d'API. L'emblème officiel (sceau de la
   * République) possède son propre fond et reste lisible sur tout fond ;
   * la variante clair/sombre n'est donc plus nécessaire.
   */
  fixed?: 'light' | 'dark';
}

/**
 * Emblème officiel de la République du Mali (sceau), affiché en cercle net.
 * Source unique : `BRANDING.logo` (public/). Utilisé sur l'écran de connexion.
 */
export function Emblem({ className }: EmblemProps) {
  return (
    <img
      src={BRANDING.logo}
      alt="Emblème de la République du Mali"
      className={`rounded-full object-cover ring-1 ring-inset ring-black/10 ${className ?? ''}`.trim()}
    />
  );
}
