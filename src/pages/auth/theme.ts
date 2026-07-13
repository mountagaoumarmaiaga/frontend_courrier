/** ═══════════════════════════════════════════════════════════════════
 * DESIGN TOKENS — Champs de saisie (Design Souverain SGC)
 * ──────────────────────────────────────────────────────────────────
 * Floating label · Icône gauche · Focus or 2px · Shake on error
 * ═══════════════════════════════════════════════════════════════════ */

/** Wrapper du champ — porte `group/field` et `aria-invalid` */
export const fieldWrapperClass = 'relative w-full group/field';

/**
 * Input — 56px de haut, padding adapté au floating-label + icône gauche.
 * `placeholder:text-transparent` masque le placeholder natif pour que
 * `:placeholder-shown` reste exploitable en CSS.
 */
export const fieldInputClass = [
  // Dimensions & forme
  'peer h-[56px] w-full rounded-[var(--radius-input)] pl-11 pr-4 pt-5 pb-1.5',
  // Typo
  'text-[15px] font-medium text-[#1A231F]',
  // Fond & bordure
  'bg-white border-[1.5px] border-[#D5D8D2] outline-none',
  // Placeholder caché
  'placeholder:text-transparent',
  // Transitions
  'transition-all duration-200 ease-out',
  // Hover
  'hover:border-[#5B6B63]/50',
  // Focus — liseré or 2px + élévation
  'focus:border-[#C9A227] focus:shadow-[0_0_0_2px_rgba(201,162,39,0.15),0_2px_8px_rgba(201,162,39,0.08)]',
  // Erreur
  'aria-[invalid=true]:border-[#B23A2E] aria-[invalid=true]:shadow-[0_0_0_2px_rgba(178,58,46,0.12)]',
  'aria-[invalid=true]:animate-shake',
].join(' ');

/**
 * Floating label — positionné *au centre* quand le champ est vide,
 * remonte en petite taille au focus ou quand le champ est rempli.
 */
export const fieldLabelClass = [
  'pointer-events-none absolute left-11 top-[17px] origin-left',
  'text-[15px] font-normal text-[#5B6B63]',
  'transition-all duration-200 ease-out',
  // Focus → miniature
  'peer-focus:-translate-y-2.5 peer-focus:scale-[0.72] peer-focus:font-semibold peer-focus:text-[#C9A227]',
  // Rempli → miniature (même position que focus)
  'peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.72] peer-[:not(:placeholder-shown)]:font-semibold',
  // Erreur → rouge
  'group-aria-[invalid=true]/field:text-[#B23A2E]',
].join(' ');

/** Icône à gauche — suit le focus et l'erreur */
export const fieldIconClass = [
  'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2',
  'text-[#5B6B63]/60 transition-colors duration-200',
  'peer-focus:text-[#C9A227]',
  'group-aria-[invalid=true]/field:text-[#B23A2E]',
].join(' ');
