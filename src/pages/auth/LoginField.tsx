import type { ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import {
  fieldWrapperClass,
  fieldInputClass,
  fieldLabelClass,
  fieldIconClass,
} from './theme';

/* ── Types ── */
interface LoginFieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'email' | 'text';
  error?: string;
  registration: UseFormRegisterReturn;
  /** Icône fine à gauche du champ. */
  icon: ReactNode;
  /** Bouton à droite (ex. œil mot de passe). */
  trailing?: ReactNode;
}

/**
 * Champ à label flottant, icône gauche, et erreur avec shake.
 *
 * Le `placeholder=" "` (un espace) est obligatoire pour que la
 * pseudo-classe CSS `:placeholder-shown` fonctionne — il est rendu
 * invisible par `placeholder:text-transparent` dans le token.
 */
export function LoginField({
  id,
  label,
  type = 'text',
  autoComplete,
  inputMode,
  error,
  registration,
  icon,
  trailing,
}: LoginFieldProps) {
  return (
    <div className={fieldWrapperClass} aria-invalid={!!error || undefined}>
      <div className="relative">
        {/* ── Champ ── */}
        <input
          id={id}
          type={type}
          placeholder=" "
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`${fieldInputClass}${trailing ? ' pr-12' : ''}`}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          {...registration}
        />

        {/* ── Label flottant ── */}
        <label htmlFor={id} className={fieldLabelClass}>
          {label}
        </label>

        {/* ── Icône gauche ── */}
        <span className={fieldIconClass} aria-hidden="true">
          {icon}
        </span>

        {/* ── Trailing (droite) ── */}
        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailing}
          </span>
        )}
      </div>

      {/* ── Message d'erreur ── */}
      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-[#B23A2E] animate-slide-up"
        >
          <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
