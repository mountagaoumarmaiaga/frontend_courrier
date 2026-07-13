import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

/**
 * Tableau de bord — page d'accueil après connexion. Rendue dans la coque
 * commune (Sidebar + Navbar) via AppLayout. Les modules métier (courriers,
 * expéditeurs, institutions…) viendront enrichir cet espace.
 */
export function Home() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-gov-success">
            <CheckCircle2 size={18} aria-hidden="true" />
            <span className="text-sm font-semibold">Connexion réussie</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-gov-dark">
            Bonjour, {user?.firstName} {user?.lastName}
          </h1>
          {user?.role && (
            <p className="mt-1 text-sm text-gov-gray-dark">
              Rôle : <span className="font-medium text-gov-dark">{user.role.name}</span>
            </p>
          )}

          <p className="mt-6 rounded-[var(--radius-btn)] border border-gov-gray-medium bg-gov-gray/50 p-4 text-sm text-gov-gray-dark">
            Bienvenue dans l'espace de gestion du courrier. Utilisez le menu de
            gauche pour accéder aux modules. Les Réglages (services et types de
            soumissionnaires) sont accessibles depuis la barre latérale.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
