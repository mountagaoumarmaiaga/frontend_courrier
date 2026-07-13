import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Login } from '@/pages/auth/Login';
import { Home } from '@/pages/Home';
import { SettingsPage } from '@/pages/settings/SettingsPage';

/** Empêche d'afficher /login à un utilisateur déjà connecté. */
function LoginRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Login />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      {/* Application connectée : coque commune Sidebar + Navbar (AppLayout). */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
