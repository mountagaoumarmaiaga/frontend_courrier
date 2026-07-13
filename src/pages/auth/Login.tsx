import { InstitutionalPanel } from './InstitutionalPanel';
import { LoginForm } from './LoginForm';

/**
 * Page de connexion — deux colonnes sur desktop :
 *  · Gauche  : volet vert profond institutionnel (République du Mali)
 *  · Droite  : formulaire sur fond ivoire avec carte flottante blanche
 * Mobile : uniquement le formulaire (volet masqué sous lg).
 */
export function Login() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[55%_45%]">
      <InstitutionalPanel />
      <LoginForm />
    </div>
  );
}
