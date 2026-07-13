import { ShieldCheck } from 'lucide-react';
import { BRANDING } from '@/lib/branding';
import { Emblem } from './Emblem';
import { Guilloche } from './Guilloche';

/**
 * Volet gauche institutionnel (masqué sous `lg`) : emblème, République,
 * devise, ministère et titre du système, sur fond marine.
 */
export function InstitutionalPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-gov-navy lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      {/* Prêt pour une photographie : définir la variable CSS `--login-photo`. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'var(--login-photo)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gov-navy/90" aria-hidden="true" />
      <Guilloche />

      <div className="relative flex items-center gap-4 text-white">
        <Emblem fixed="dark" className="h-16 w-16 shrink-0" />
        <div className="leading-tight">
          <p className="font-heading text-[15px] font-semibold tracking-tight">{BRANDING.republic}</p>
          <p className="mt-0.5 text-[12px] font-medium uppercase tracking-[0.18em] text-gov-gold-light">
            {BRANDING.motto}
          </p>
        </div>
      </div>

      <div className="relative max-w-lg text-white">
        <div className="mb-6 h-px w-14 bg-gov-gold" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          {BRANDING.ministry}
        </p>
        <h1 className="mt-4 font-heading text-[clamp(2rem,4vw,2.375rem)] font-semibold leading-[1.15] tracking-tight text-white">
          {BRANDING.system}
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
          Une plateforme unique pour l'enregistrement, l'aiguillage et le suivi des
          correspondances officielles - au service des institutions, de leurs agents
          et des usagers.
        </p>
      </div>

      <div className="relative flex items-center gap-2.5 border-t border-white/12 pt-6 text-xs text-white/70">
        <ShieldCheck size={15} className="text-gov-gold" aria-hidden="true" />
        Accès strictement réservé au personnel habilité · Connexion chiffrée
      </div>
    </aside>
  );
}
