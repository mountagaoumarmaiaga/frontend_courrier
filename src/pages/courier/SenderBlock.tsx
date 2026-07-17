import { AtSign, MapPin, Phone, User2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Sender } from '@/lib/types';

/**
 * Bloc soumissionnaire + contact.
 *
 * Deux dépendances pas encore branchées, traitées séparément parce qu'elles
 * tomberont séparément :
 *  · `sender` absent   → l'API ne joint pas encore `Senders` ;
 *  · `sender.contact`  → le module `Contacts` n'existe pas côté back.
 *
 * Dans les deux cas on rend un état « à venir » explicite. Un `sender.contact.phone`
 * lu sans garde ferait planter la page sur un module dont c'est le cœur.
 */
export function SenderBlock({ sender, isLoading }: { sender?: Sender; isLoading?: boolean }) {
  return (
    <Card className="p-6">
      <h2 className="font-heading text-lg font-semibold text-gov-dark">Soumissionnaire</h2>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : sender ? (
        <div className="mt-4">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-gov-green/10 text-gov-green"
              aria-hidden="true"
            >
              <User2 size={17} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-gov-dark">{sender.name}</p>
              {sender.sender_type && (
                <p className="text-[13px] text-gov-gray-dark">{sender.sender_type.name}</p>
              )}
            </div>
          </div>

          <div className="my-5 h-px bg-gov-gray-medium" aria-hidden="true" />

          <h3 className="text-[12px] font-bold uppercase tracking-[0.08em] text-gov-gray-dark">
            Contact
          </h3>

          {sender.contact ? (
            <dl className="mt-3 space-y-3 text-sm">
              <ContactLine
                icon={<Phone size={15} strokeWidth={1.75} />}
                label="Téléphone"
                value={sender.contact.phone}
                href={`tel:${sender.contact.phone}`}
              />
              <ContactLine
                icon={<AtSign size={15} strokeWidth={1.75} />}
                label="Email"
                value={sender.contact.email}
                href={sender.contact.email ? `mailto:${sender.contact.email}` : undefined}
              />
              <ContactLine
                icon={<MapPin size={15} strokeWidth={1.75} />}
                label="Adresse"
                value={sender.contact.address}
              />
            </dl>
          ) : (
            <ContactPending />
          )}
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-gov-gray-dark">
            L'identité du soumissionnaire n'est pas encore jointe à ce dossier par l'API.
          </p>
          <ContactPending />
        </div>
      )}
    </Card>
  );
}

function ContactLine({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  /** `null` autant que `undefined` : l'API renvoie `null` sur les champs vides. */
  value?: string | null;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-gov-gray-dark" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-gov-gray-dark">
          {label}
        </dt>
        <dd className="mt-0.5 break-words text-gov-dark">
          {value ? (
            href ? (
              <a
                href={href}
                className="underline decoration-gov-gray-medium underline-offset-2 transition-colors hover:decoration-gov-green"
              >
                {value}
              </a>
            ) : (
              value
            )
          ) : (
            <span className="italic text-gov-gray-dark">Non renseigné</span>
          )}
        </dd>
      </div>
    </div>
  );
}

/**
 * État d'attente du module `Contacts`. Le squelette dit « ça viendra ici »,
 * la mention dit pourquoi — sans quoi l'agent croit à un dossier incomplet.
 */
function ContactPending() {
  return (
    <div className="mt-3">
      <div className="space-y-2.5" aria-hidden="true">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-32" />
      </div>
      <p className="mt-3 rounded-[var(--radius-btn)] border border-gov-gray-medium bg-gov-gray px-3 py-2 text-[12px] text-gov-gray-dark">
        Coordonnées indisponibles : le module <strong className="font-semibold">Contacts</strong> n'est
        pas encore branché à l'API.
      </p>
    </div>
  );
}
