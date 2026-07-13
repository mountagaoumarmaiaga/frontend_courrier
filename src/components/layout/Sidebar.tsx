import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2,
  Settings,
} from 'lucide-react';
import { BRANDING } from '@/lib/branding';
import { Emblem } from '@/pages/auth/Emblem';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',        label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
  { to: '/courriers', label: 'Courriers',      icon: <Mail size={18} /> },
  { to: '/users',   label: 'Utilisateurs',    icon: <Users size={18} /> },
  { to: '/institutions', label: 'Institutions', icon: <Building2 size={18} /> },
  { to: '/settings', label: 'Réglages',       icon: <Settings size={18} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={[
        'relative flex h-screen flex-col border-r border-gov-gray-medium bg-gov-surface transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[230px]',
      ].join(' ')}
    >
      {/* ─── Logo ─── */}
      <div
        className={[
          'flex items-center gap-3 px-4 py-5',
          collapsed ? 'justify-center' : '',
        ].join(' ')}
      >
        <Emblem className="h-8 w-8 shrink-0" />
        {!collapsed && (
          <span className="font-heading text-[13px] font-bold leading-tight text-gov-dark">
            {BRANDING.shortName}
          </span>
        )}
      </div>

      {/* ─── Filet or institutionnel ─── */}
      <div className="mx-4 h-px bg-gov-gold/30" aria-hidden="true" />

      {/* ─── Navigation ─── */}
      <nav className="mt-3 flex-1 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-gov-green/12 font-semibold text-gov-dark'
                  : 'font-medium text-gov-gray-dark hover:bg-gov-gray hover:text-gov-dark',
              ].join(' ')
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'shrink-0 text-gov-green' : 'shrink-0'}>
                  {icon}
                </span>
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ─── Bas : version de l'app ─── */}
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
        className="absolute -right-3.5 top-20 flex h-7 w-7 items-center justify-center rounded-full border border-gov-gray-medium bg-gov-surface text-gov-green shadow-md transition-colors hover:border-gov-green hover:bg-gov-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-gold"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
