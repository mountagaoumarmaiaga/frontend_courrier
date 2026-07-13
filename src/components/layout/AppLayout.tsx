import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

/**
 * Layout principal après connexion :
 *  ┌──────────┬──────────────────────────────────┐
 *  │          │  Navbar (top)                    │
 *  │ Sidebar  ├──────────────────────────────────┤
 *  │ (left)   │  Contenu de la page (Outlet)     │
 *  └──────────┴──────────────────────────────────┘
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gov-gray">
      {/* Sidebar gauche */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Zone droite : Navbar + contenu */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Barre dorée institutionnelle */}
        <div className="h-1 w-full shrink-0 bg-gov-gold" aria-hidden="true" />

        {/* Navbar top */}
        <Navbar />

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
