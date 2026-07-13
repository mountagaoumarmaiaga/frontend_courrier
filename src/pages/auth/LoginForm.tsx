import {
  Eye, EyeOff, AlertCircle, Loader2,
  Lock, ShieldCheck, Mail,
} from 'lucide-react';
import { BRANDING } from '@/lib/branding';
import { Emblem } from './Emblem';
import { LoginField } from './LoginField';
import { useLoginForm } from './useLoginForm';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';

/* ═══════════════════════════════════════════════════════════════
 * FORMULAIRE DE CONNEXION — La carte d'accès
 * ──────────────────────────────────────────────────────────────
 * Surface #FAFBF9 · Ombre multi-couches · Radius 16px
 * Figé en mode clair (pas de dark: sur cet écran).
 * ═══════════════════════════════════════════════════════════════ */

export function LoginForm() {
  const {
    register, errors, isSubmitting, submit,
    showPassword, setShowPassword,
  } = useLoginForm();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#F2F5F0] px-5 py-12 sm:px-8">

      {/* ════════════════════════════════════════════════════════════
       *  CARTE FLOTTANTE
       * ════════════════════════════════════════════════════════════ */}
      <div
        className="w-full max-w-[440px] animate-rise"
        style={{
          background: '#FAFBF9',
          borderRadius: '16px',
          boxShadow:
            '0 1px 3px rgba(11,46,36,.03), ' +
            '0 6px 16px rgba(11,46,36,.05), ' +
            '0 20px 48px rgba(11,46,36,.07)',
        }}
      >
        {/* ── EN-TÊTE ── */}
        <div className="flex flex-col items-center px-10 pt-10 pb-2">

          {/* Emblème mobile (caché sur desktop, le panneau gauche l'affiche) */}
          <div className="mb-6 lg:hidden">
            <Emblem className="h-14 w-14" />
          </div>

          <h2 className="text-center text-[24px] font-semibold leading-tight tracking-[-0.01em] text-[#1A231F]">
            Connexion à votre espace
          </h2>
          <p className="mt-2 text-center text-[13px] leading-relaxed text-[#5B6B63]">
            Portail sécurisé du {BRANDING.shortName}
          </p>

          {/* Filet doré */}
          <div
            className="mt-6 h-[2px] w-10 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }}
            aria-hidden="true"
          />
        </div>

        {/* ── CORPS DU FORMULAIRE ── */}
        <div className="px-10 pb-10 pt-6">

          {/* Erreur globale */}
          {errors.root && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px] animate-shake"
              style={{
                background: 'rgba(178,58,46,0.04)',
                border: '1px solid rgba(178,58,46,0.15)',
              }}
            >
              <AlertCircle
                size={18}
                className="mt-[2px] shrink-0 text-[#B23A2E]"
                aria-hidden="true"
              />
              <span className="font-medium text-[#B23A2E] leading-relaxed">
                {errors.root.message}
              </span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5" noValidate>

            {/* ── Email ── */}
            <LoginField
              id="login-email"
              label="Identifiant / Email professionnel"
              type="text"
              autoComplete="username"
              icon={<Mail size={18} strokeWidth={1.5} />}
              error={errors.email?.message}
              registration={register('email', {
                required: "L'identifiant est obligatoire.",
                // Le backend authentifie sur `login` : nom d'utilisateur
                // (« superadmin ») OU adresse e-mail. On n'impose donc pas
                // de format e-mail, seulement une saisie non vide.
              })}
            />

            {/* ── Mot de passe ── */}
            <LoginField
              id="login-password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              icon={<Lock size={18} strokeWidth={1.5} />}
              error={errors.password?.message}
              registration={register('password', {
                required: 'Le mot de passe est obligatoire.',
                minLength: { value: 6, message: 'Au moins 6 caractères.' },
              })}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="rounded-lg p-2 text-[#5B6B63] transition-colors duration-150 hover:text-[#1A231F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
                  aria-label={
                    showPassword
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.5} />
                  ) : (
                    <Eye size={18} strokeWidth={1.5} />
                  )}
                </button>
              }
            />

            {/* ── Se souvenir / Oublié ── */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2.5 select-none text-[13px] text-[#1A231F] transition-colors hover:text-[#127A52]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#D5D8D2] accent-[#127A52] focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-1"
                  {...register('remember')}
                />
                Se souvenir de moi
              </label>
              <ForgotPasswordDialog />
            </div>

            {/* ── BOUTON SE CONNECTER ── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                'relative mt-2 flex h-[52px] w-full items-center justify-center gap-2.5',
                'rounded-[var(--radius-btn)] text-[15px] font-semibold text-white',
                'transition-all duration-200 ease-out',
                'bg-[#127A52] shadow-[0_4px_12px_rgba(18,122,82,0.25)]',
                'hover:bg-[#0E6644] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(18,122,82,0.30)]',
                'active:translate-y-0 active:shadow-[0_2px_6px_rgba(18,122,82,0.20)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2',
                'disabled:opacity-65 disabled:pointer-events-none',
              ].join(' ')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Connexion…
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* ── Bandeau sécurité ── */}
          <div className="mt-7 flex items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-medium text-[#5B6B63]">
            <ShieldCheck size={14} className="text-[#127A52]" aria-hidden="true" />
            Connexion chiffrée · Accès réservé aux agents de l'État
          </div>
        </div>
      </div>

      {/* ── Aide : la réinitialisation est gérée par l'administrateur ── */}
      <p className="mt-6 w-full max-w-[440px] text-center text-[13px] text-[#5B6B63]">
        Mot de passe oublié ou perdu ?{' '}
        <a
          href={`mailto:${BRANDING.adminEmail}`}
          className="font-semibold text-[#127A52] underline-offset-2 transition-colors hover:text-[#0E6644] hover:underline"
        >
          Contactez votre administrateur
        </a>
      </p>

      {/* ── Devise mobile (visible uniquement sous lg) ── */}
      <p className="mt-8 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#5B6B63]/50 lg:hidden">
        <span>Un Peuple</span>
        <span className="inline-block h-1 w-1 rounded-full bg-[#C9A227]" aria-hidden="true" />
        <span>Un But</span>
        <span className="inline-block h-1 w-1 rounded-full bg-[#C9A227]" aria-hidden="true" />
        <span>Une Foi</span>
      </p>
    </main>
  );
}
