import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  Users,
  ChevronLeft,
  Building2,
  Settings,
} from 'lucide-react';
import { BRANDING } from '@/lib/branding';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

/* Trait d'icône unifié (1.75) : plus fin que le défaut, cohérent partout. */
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Général',
    items: [
      { to: '/', label: 'Tableau de bord', icon: <LayoutDashboard size={18} strokeWidth={1.75} /> },
      { to: '/courriers', label: 'Courriers', icon: <Mail size={18} strokeWidth={1.75} /> },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/users', label: 'Utilisateurs', icon: <Users size={18} strokeWidth={1.75} /> },
      { to: '/institutions', label: 'Institutions', icon: <Building2 size={18} strokeWidth={1.75} /> },
      { to: '/settings', label: 'Réglages', icon: <Settings size={18} strokeWidth={1.75} /> },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Barre latérale de l'application — couche neutre du système `gov-*`
 * (adaptative clair/sombre), signature or discrète héritée de l'écran de
 * connexion (filet en dégradé). L'état actif est porté par trois signaux
 * (fond teinté, liseré intérieur, icône verte + graisse), jamais par la
 * couleur seule.
 */
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  // Position globale de chaque groupe dans la liste — pour décaler la
  // cascade d'entrée (`animation-delay`) de façon continue entre groupes.
  const groupOffsets = NAV_GROUPS.map((_, i) =>
    NAV_GROUPS.slice(0, i).reduce((n, g) => n + g.items.length, 0),
  );

  return (
    <aside
      className={[
        'relative flex h-screen flex-col border-r border-gov-gray-medium bg-gov-surface',
        'transition-[width] duration-300 ease-out',
        collapsed ? 'w-[68px]' : 'w-[230px]',
      ].join(' ')}
    >
      {/* ─── Identité ─── */}
      <div
        className={[
          'flex items-center gap-3 px-4 py-5',
          collapsed ? 'justify-center px-0' : '',
        ].join(' ')}
      >
        {/* Sceau officiel — cercle net, légère inclinaison 3D au survol. */}
        <span className="shrink-0 transition-transform duration-300 ease-out hover:[transform:perspective(500px)_rotateY(14deg)]">
          <img
            src={BRANDING.logo}
            alt={`Emblème — ${BRANDING.republic}`}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-inset ring-black/10"
          />
        </span>
        {!collapsed && (
          <span className="font-heading text-[13px] font-bold leading-snug text-gov-dark">
            {BRANDING.shortName}
          </span>
        )}
      </div>

      {/* ─── Filet or — même signature que la carte de connexion ─── */}
      <div
        className="mx-4 h-px bg-gradient-to-r from-transparent via-gov-gold/50 to-transparent"
        aria-hidden="true"
      />

      {/* ─── Navigation ─── */}
      <nav className="mt-4 flex-1 overflow-y-auto px-2" aria-label="Navigation principale">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label} className={groupIndex > 0 ? 'mt-5' : ''}>
            {collapsed ? (
              groupIndex > 0 && (
                <div className="mx-3 mb-3 h-px bg-gov-gray-medium" aria-hidden="true" />
              )
            ) : (
              <p className="mb-1.5 px-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-gov-gray-dark">
                {group.label}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon }, itemIndex) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  /* Cascade d'entrée : 40 ms de décalage par élément. */
                  style={{ animationDelay: `${(groupOffsets[groupIndex] + itemIndex) * 40}ms` }}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px]',
                      'animate-nav-in transition-colors duration-150 active:scale-[0.98]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold',
                      collapsed ? 'justify-center px-0' : '',
                      isActive
                        ? 'bg-gov-green/10 font-semibold text-gov-dark ring-1 ring-inset ring-gov-green/20'
                        : 'font-medium text-gov-gray-dark hover:bg-gov-gray hover:text-gov-dark',
                    ].join(' ')
                  }
                  title={collapsed ? label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={[
                          'shrink-0 transition-[transform,color] duration-200 ease-out',
                          'group-hover:-translate-y-[1px] group-hover:scale-110',
                          isActive ? 'text-gov-green' : '',
                        ].join(' ')}
                      >
                        {icon}
                      </span>
                      {!collapsed && <span className="animate-nav-in">{label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ─── Pied : version ─── */}
      <div className="mt-auto px-4 pb-5">
        <div className="mb-3 h-px bg-gov-gray-medium" aria-hidden="true" />
        {!collapsed && (
          <p className="text-center text-[11px] text-gov-gray-dark">
            {BRANDING.shortName} · v1.0
          </p>
        )}
      </div>

      {/* ─── Bouton réduire/agrandir ─── */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Agrandir' : 'Réduire'}
        aria-label={collapsed ? 'Agrandir le menu' : 'Réduire le menu'}
        className="absolute -right-3.5 top-20 flex h-7 w-7 items-center justify-center rounded-full border border-gov-gray-medium bg-gov-surface text-gov-green shadow-sm transition-colors duration-150 hover:border-gov-green hover:bg-gov-green hover:text-white active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
      >
        {/* Un seul chevron qui pivote : la rotation raconte la bascule. */}
        <ChevronLeft
          size={14}
          strokeWidth={1.75}
          className={[
            'transition-transform duration-300 ease-out',
            collapsed ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>
    </aside>
  );
}
