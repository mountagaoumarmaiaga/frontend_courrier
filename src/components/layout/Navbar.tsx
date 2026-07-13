import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { BRANDING } from '@/lib/branding';
import { toast } from 'sonner';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Vous êtes déconnecté.');
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gov-gray-medium bg-gov-surface px-6">
      {/* Titre de l'institution */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-gov-gray-dark">
          {BRANDING.republic}
        </p>
        <p className="font-heading text-[15px] font-semibold text-gov-dark leading-tight">
          {BRANDING.system}
        </p>
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-1">
        {/* Notifications (placeholder) */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gov-gray-dark transition-colors hover:bg-gov-gray hover:text-gov-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Thème */}
        <button
          onClick={toggleTheme}
          aria-label="Changer le thème"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gov-gray-dark transition-colors hover:bg-gov-gray hover:text-gov-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Séparateur */}
        <div className="mx-2 h-6 w-px bg-gov-gray-medium" />

        {/* Profil utilisateur */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227]/15 text-[12px] font-bold text-[#C9A227]">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-semibold text-gov-dark leading-none">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-0.5 text-[11px] text-gov-gray-dark leading-none">
                {user.role?.name ?? 'Utilisateur'}
              </p>
            </div>
          </div>
        )}

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          aria-label="Déconnexion"
          title="Déconnexion"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-gov-gray-dark transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
