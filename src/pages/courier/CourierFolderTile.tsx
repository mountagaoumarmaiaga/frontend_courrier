import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { formatDate } from '@/lib/utils';
import { FolderIcon } from './FolderIcon';
import { StatusChip } from './StatusChip';
import { resolveStatus } from './statuses';
import type { Courier } from '@/lib/types';

/**
 * Délais d'intention. Sans eux, traverser la grille à la souris ouvre une
 * bulle sur chaque carte survolée au passage : ça clignote. On n'ouvre que si
 * le pointeur s'attarde, et on ferme avec un léger retard pour ne pas hacher
 * un déplacement rapide.
 */
const OPEN_DELAY = 180;
const CLOSE_DELAY = 120;

export interface CourierFolderTileProps {
  courier: Courier;
  /** L'aperçu de cette carte est-il affiché ? Décidé par la grille. */
  open: boolean;
  /** Affiché parce qu'épinglé (et non par simple survol). */
  pinned: boolean;
  /** Survol confirmé / terminé, une fois le délai d'intention écoulé. */
  onHoverChange: (hovered: boolean) => void;
  onPinToggle: () => void;
  /** Échap ou clic extérieur. */
  onDismiss: () => void;
}

/**
 * Une carte de la grille : un dossier, sa référence, son statut, le service
 * qui l'a en main — et un aperçu qui évite d'ouvrir le pli pour vérifier une
 * info.
 *
 * La carte ne décide pas si sa bulle s'affiche : elle signale une intention
 * (survol, clic sur l'œil) et la grille tranche. C'est ce qui garantit **un
 * seul aperçu ouvert à la fois** — avec un état par carte, épingler l'une puis
 * en survoler une autre en affichait deux.
 *
 *  · **survol** → bulle de lecture seule, transparente au pointeur ;
 *  · **clic sur l'œil** → bulle épinglée et interactive (le téléphone devient
 *    cliquable). C'est le seul chemin au clavier et au doigt, où le survol
 *    n'existe pas.
 */
export function CourierFolderTile({
  courier,
  open,
  pinned,
  onHoverChange,
  onPinToggle,
  onDismiss,
}: CourierFolderTileProps) {
  const eyeRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHover = (next: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onHoverChange(next), next ? OPEN_DELAY : CLOSE_DELAY);
  };

  // Une carte démontée (changement de page, filtre) ne doit pas s'ouvrir après coup.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const senderName = courier.sender?.name;
  const phone = courier.sender?.contact?.phone;

  // Un dossier clos n'est chez personne : afficher un service y serait faux.
  const { key } = resolveStatus(courier.id_status, courier.status);
  const service =
    key === 'done' ? '—' : (courier.current_service?.name ?? 'Non assigné');

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        // Radix ne parle ici que pour congédier (Échap, clic extérieur).
        if (!next) {
          if (timer.current) clearTimeout(timer.current);
          onDismiss();
        }
      }}
    >
      <PopoverAnchor asChild>
        <Card
          className="group relative flex h-full flex-col gap-3 p-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-lg)]"
          onPointerEnter={() => scheduleHover(true)}
          onPointerLeave={() => scheduleHover(false)}
        >
          {/*
            Lien étendu : toute la carte est cliquable sans imbriquer de bouton
            dans un lien (HTML invalide). L'œil repasse au-dessus.
          */}
          <Link
            to={`/courriers/${courier.id}`}
            className="absolute inset-0 z-10 rounded-[var(--radius-card)]"
            aria-label={`Ouvrir le dossier ${courier.referenceNumber} — ${courier.subject}`}
          />

          <div className="flex items-start justify-between gap-2">
            <FolderIcon className="w-11 shrink-0" />

            {/* Œil : discret au survol, toujours là sans survol (tactile) et au clavier. */}
            <button
              ref={eyeRef}
              type="button"
              aria-label={`Aperçu du dossier ${courier.referenceNumber}`}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={onPinToggle}
              className="relative z-20 -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-pill)] text-gov-gray-dark opacity-0 transition-[opacity,background-color,color] duration-200 hover:bg-gov-gray hover:text-gov-dark focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
            >
              <Eye size={15} strokeWidth={1.75} />
            </button>
          </div>

          <div>
            {/*
              Pas de troncature : une référence tronquée ne sert plus à rien —
              c'est l'identifiant qu'on recopie sur le pli et qu'on épelle au
              téléphone. La carte est dimensionnée pour qu'elle tienne sur une
              ligne, et `break-words` rattrape une référence anormalement
              longue en la repliant plutôt qu'en la coupant.
            */}
            <p className="break-words text-[13.5px] font-semibold leading-tight text-gov-dark">
              {courier.referenceNumber}
            </p>
            <StatusChip
              id={courier.id_status}
              status={courier.status}
              size="sm"
              className="mt-2"
            />
          </div>

          <div className="mt-auto flex items-center gap-1.5 pt-0.5 text-[12px] text-gov-gray-dark">
            <Building2 size={13} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
            <span className="truncate" title={service}>
              {service}
            </span>
          </div>
        </Card>
      </PopoverAnchor>

      <PopoverContent
        side="top"
        align="center"
        collisionPadding={12}
        /*
         * Au survol, la bulle est transparente au pointeur. Sans ça, dès
         * qu'elle recouvre sa propre carte, elle vole le survol → la carte
         * croit qu'on est parti → fermeture → la bulle disparaît → le survol
         * revient : la boucle de clignotement. Épinglée, elle redevient
         * interactive (le téléphone est cliquable).
         */
        className={pinned ? undefined : 'pointer-events-none'}
        /* Ouvert au survol : voler le focus déplacerait le clavier sans raison. */
        onOpenAutoFocus={(event) => event.preventDefault()}
        /* L'œil n'est pas « dehors » : c'est lui qui pilote la bulle. */
        onPointerDownOutside={(event) => {
          if (eyeRef.current?.contains(event.target as Node)) event.preventDefault();
        }}
      >
        <p className="font-heading text-[15px] font-semibold leading-snug text-gov-dark">
          {courier.subject}
        </p>

        <dl className="mt-3 space-y-2 text-[13px]">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-gov-gray-dark">
              Soumissionnaire
            </dt>
            <dd className="mt-0.5 text-gov-dark">{senderName ?? <Unknown />}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-gov-gray-dark">
              Téléphone
            </dt>
            <dd className="mt-0.5 text-gov-dark">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="underline decoration-gov-gray-medium underline-offset-2 hover:decoration-gov-green"
                >
                  {phone}
                </a>
              ) : (
                <Unknown />
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gov-gray-medium pt-3">
          <StatusChip id={courier.id_status} status={courier.status} size="sm" />
          <span className="text-[11px] text-gov-gray-dark">
            Déposé le {formatDate(courier.submissionDate)}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Unknown() {
  return <span className="italic text-gov-gray-dark">Non renseigné</span>;
}
