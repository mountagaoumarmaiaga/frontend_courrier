import * as React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Empêche qu'une erreur de rendu (typiquement un graphique démonté en cours
 * d'animation) fasse disparaître toute l'application au profit d'un écran blanc.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Remplacer par un envoi vers Sentry ou l'API de journalisation le moment venu.
    console.error('Erreur de rendu :', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md rounded-[var(--radius-card)] border border-gov-gray-medium bg-gov-surface p-8 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/25">
            <AlertTriangle className="h-6 w-6 text-gov-error" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
          <p className="mt-2 text-sm text-gov-gray-dark">
            L'affichage de cette section a échoué. Vos données ne sont pas perdues.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[var(--radius-btn)] bg-gov-gray p-3 text-left text-xs text-gov-gray-dark">
            {this.state.error.message}
          </pre>
          <div className="mt-6 flex justify-center gap-2">
            <Button size="sm" onClick={() => this.setState({ error: null })}>
              <RotateCcw size={15} /> Réessayer
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
