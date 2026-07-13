import { useState, useEffect, useId } from 'react';
import { KeyRound, X, Mail, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import { BRANDING } from '@/lib/branding';

/**
 * « Mot de passe oublié » — récupération gérée par l'administrateur.
 *
 * L'API n'expose pas de réinitialisation en libre-service : seul un admin
 * connecté peut réinitialiser un compte (POST /auth/reset-password/{id}), et
 * le backend envoie alors le nouveau mot de passe par e-mail. Ce dialogue
 * explique la marche à suivre et propose de contacter l'admin, avec
 * l'identifiant pré-rempli dans l'e-mail.
 *
 * Composant autonome : il rend son propre déclencheur (le lien « Mot de passe
 * oublié ? ») et gère son ouverture/fermeture (Échap, clic sur le fond).
 */
export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const titleId = useId();

  /** Copie l'adresse admin dans le presse-papiers, avec repli si l'API échoue. */
  const copyAdminEmail = async () => {
    try {
      await navigator.clipboard.writeText(BRANDING.adminEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé) : on ignore
      // silencieusement, l'adresse reste lisible et sélectionnable à l'écran.
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    // Empêche le défilement de l'arrière-plan tant que le dialogue est ouvert.
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      // Reset le statut quand on ferme
      setIsSent(false);
    };
  }, [open]);

  const mailtoHref =
    `mailto:${BRANDING.adminEmail}` +
    `?subject=${encodeURIComponent('Réinitialisation de mot de passe')}` +
    `&body=${encodeURIComponent(
      `Bonjour,\n\nJe souhaite réinitialiser mon mot de passe.\n` +
        `Mon identifiant : ${login.trim() || '[à compléter]'}\n\nMerci.`,
    )}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm text-[13px] font-semibold text-[#C9A227] transition-colors hover:text-[#E0B84C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
      >
        Mot de passe oublié ?
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[#0B2E24]/45 backdrop-blur-[2px] animate-fade-in"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[420px] animate-rise rounded-[16px] bg-[#FAFBF9] p-7 text-left"
            style={{
              boxShadow:
                '0 1px 3px rgba(11,46,36,.06), 0 12px 32px rgba(11,46,36,.12), 0 32px 64px rgba(11,46,36,.14)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute right-3.5 top-3.5 rounded-lg p-1.5 text-[#5B6B63] transition-colors hover:bg-[#F2F5F0] hover:text-[#1A231F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              <X size={18} />
            </button>

            {isSent ? (
              <div className="flex flex-col items-center py-6 text-center animate-fade-in">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#127A52]/10 mb-4">
                  <CheckCircle2 size={32} className="text-[#127A52]" aria-hidden="true" />
                </span>
                <h2 className="font-heading text-[20px] font-semibold text-[#1A231F] mb-2">
                  Demande préparée
                </h2>
                <p className="text-[15px] leading-relaxed text-[#5B6B63]">
                  Votre application de messagerie va s'ouvrir. Il ne vous reste plus qu'à <strong>envoyer l'e-mail</strong>. L'administrateur vous répondra dès que votre mot de passe sera réinitialisé.
                </p>

                {/* Repli : si aucune messagerie n'est configurée, l'adresse
                    reste lisible et copiable en un clic. */}
                <p className="mt-5 text-[12px] text-[#5B6B63]">
                  Aucune messagerie ne s'est ouverte ? Écrivez directement à :
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-[10px] border border-[#D5D8D2] bg-white px-3.5 py-2.5">
                  <Mail size={15} className="shrink-0 text-[#127A52]" aria-hidden="true" />
                  <span className="flex-1 truncate text-[15px] font-medium text-[#1A231F]">
                    {BRANDING.adminEmail}
                  </span>
                  <button
                    type="button"
                    onClick={copyAdminEmail}
                    aria-label="Copier l'adresse de l'administrateur"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-semibold text-[#127A52] transition-colors hover:bg-[#127A52]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
                  >
                    {copied ? (
                      <><Check size={14} aria-hidden="true" /> Copié</>
                    ) : (
                      <><Copy size={14} aria-hidden="true" /> Copier</>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-6 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#E9ECE7] text-[15px] font-semibold text-[#1A231F] transition-colors hover:bg-[#DFE3DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227]/12 ring-1 ring-[#C9A227]/25">
                  <KeyRound size={20} className="text-[#C9A227]" aria-hidden="true" />
                </span>

                <h2 id={titleId} className="mt-4 font-heading text-[18px] font-semibold text-[#1A231F]">
                  Mot de passe oublié
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#5B6B63]">
                  Votre mot de passe est <strong className="font-semibold text-[#1A231F]">géré par
                  l'administrateur du système</strong>. Communiquez-lui votre identifiant : il
                  réinitialise votre accès et vous recevez votre nouveau mot de passe par e-mail.
                </p>

                <label
                  htmlFor={`${titleId}-login`}
                  className="mt-5 mb-2 block text-[12px] font-bold uppercase tracking-[0.08em] text-[#1A231F]/80"
                >
                  Votre identifiant / e-mail (optionnel)
                </label>
                <input
                  id={`${titleId}-login`}
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="prenom.nom@courrier.gouv.ml"
                  autoComplete="username"
                  className="h-11 w-full rounded-[10px] border border-[#D5D8D2] bg-white px-3.5 text-[15px] text-[#1A231F] outline-none transition-colors placeholder:text-[#5B6B63]/50 focus:border-[#C9A227] focus:ring-[3px] focus:ring-[#C9A227]/15"
                />

                <a
                  href={mailtoHref}
                  onClick={() => setIsSent(true)}
                  className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#127A52] text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(18,122,82,0.25)] transition-colors hover:bg-[#0E6644] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
                >
                  <Mail size={16} /> Contacter l'administrateur
                </a>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[#5B6B63]">
                  <ShieldCheck size={13} className="text-[#127A52]" aria-hidden="true" />
                  Pour votre sécurité, aucun mot de passe n'est réinitialisé en ligne.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
