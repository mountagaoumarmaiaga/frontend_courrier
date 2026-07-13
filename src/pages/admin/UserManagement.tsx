import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api/endpoints';
import { authService } from '@/lib/auth/auth-service';
import type { User } from '@/lib/types';
import { KeyRound, Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingId, setResettingId] = useState<string | null>(null);
  
  // State for the modal displaying the new password
  const [newPasswordData, setNewPasswordData] = useState<{ user: User, password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userApi.index();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (user: User) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir réinitialiser le mot de passe de ${user.firstName} ${user.lastName} ?`)) {
      return;
    }
    
    setResettingId(user.id);
    try {
      const newPassword = await authService.resetPassword(user.id);
      setNewPasswordData({ user, password: newPassword });
      toast.success('Mot de passe réinitialisé avec succès');
    } catch (error: any) {
      toast.error(error?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setResettingId(null);
    }
  };

  const copyPassword = async () => {
    if (!newPasswordData) return;
    try {
      await navigator.clipboard.writeText(newPasswordData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-gov-gray-dark">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gov-dark">Gestion des Utilisateurs</h1>
          <p className="text-gov-gray-dark mt-1 text-sm">Gérez les accès et réinitialisez les mots de passe si nécessaire.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gov-gray text-gov-gray-dark border-b border-gov-gray-medium">
              <tr>
                <th className="px-6 py-4 font-semibold">Nom</th>
                <th className="px-6 py-4 font-semibold">Identifiant</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-gray-medium">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gov-ivory">
                  <td className="px-6 py-4 font-medium text-gov-dark">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-gov-gray-dark">{user.login}</td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gov-success/10 px-2.5 py-1 text-xs font-medium text-gov-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-gov-success" /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gov-error/10 px-2.5 py-1 text-xs font-medium text-gov-error">
                        <span className="h-1.5 w-1.5 rounded-full bg-gov-error" /> Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleResetPassword(user)}
                      disabled={resettingId === user.id}
                      className="inline-flex items-center gap-2 rounded-md bg-gov-surface border border-gov-gray-medium px-3 py-1.5 text-xs font-semibold text-gov-dark transition-colors hover:bg-gov-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold disabled:opacity-50"
                    >
                      <KeyRound size={14} className="text-gov-gold" />
                      {resettingId === user.id ? 'Patientez...' : 'Réinitialiser'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gov-gray-dark">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal d'affichage du nouveau mot de passe */}
      {newPasswordData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gov-green-deep/45 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-gov-surface rounded-[var(--radius-card)] p-7 shadow-[var(--shadow-card-lg)] animate-rise">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gov-gold/12 text-gov-gold">
                <KeyRound size={24} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gov-dark">Mot de passe généré</h2>
                <p className="text-sm text-gov-gray-dark">Pour {newPasswordData.user.firstName} {newPasswordData.user.lastName}</p>
              </div>
            </div>
            
            <div className="bg-gov-warning/10 border border-gov-warning/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-gov-warning shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-gov-warning">
                  Ce mot de passe n'est affiché qu'une seule fois. Veuillez le copier et le transmettre de manière sécurisée à l'utilisateur.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <code className="flex-1 rounded-[var(--radius-input)] bg-gov-gray border border-gov-gray-medium px-4 py-3 text-base font-mono font-bold text-gov-dark text-center tracking-widest">
                {newPasswordData.password}
              </code>
              <button
                onClick={copyPassword}
                className="flex h-[46px] items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-gov-success px-4 text-sm font-semibold text-white transition-colors hover:bg-gov-green-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>

            <button
              onClick={() => setNewPasswordData(null)}
              className="w-full rounded-[var(--radius-btn)] bg-gov-gray border border-gov-gray-medium py-3 text-sm font-semibold text-gov-dark transition-colors hover:bg-gov-gray-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
