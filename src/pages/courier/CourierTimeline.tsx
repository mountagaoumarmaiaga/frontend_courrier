import { useMemo } from 'react';
import { RotateCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/lib/api/hooks/use-services';
import { useUsers } from '@/lib/api/hooks/use-users';
import { formatDateTime } from '@/lib/utils';
import { StatusChip } from './StatusChip';
import type { CourierHistory } from '@/lib/types';

/**
 * Historique du dossier (`Courier_Histories`) — le héros de l'écran :
 * « où en est ce pli, chez qui, depuis quand ».
 *
 * `GET /couriers/{id}/history` ne renvoie que des clés étrangères (`id_user`,
 * `id_service`) : les libellés sont résolus ici contre l'annuaire et les
 * services. Ces deux appels sont **facultatifs** — s'ils échouent (403 selon le
 * rôle), l'étape s'affiche sans le nom plutôt que de faire tomber la timeline,
 * qui reste lisible par son action, son statut et sa date.
 */

interface CourierTimelineProps {
  histories?: CourierHistory[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function CourierTimeline({ histories, isLoading, isError, onRetry }: CourierTimelineProps) {
  const users = useUsers();
  const services = useServices();

  const userNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const user of users.data ?? []) {
      map.set(user.id, `${user.firstName} ${user.lastName}`.trim());
    }
    return map;
  }, [users.data]);

  const serviceNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const service of services.data ?? []) map.set(service.id, service.name);
    return map;
  }, [services.data]);

  return (
    <Card className="p-6">
      <h2 className="font-heading text-lg font-semibold text-gov-dark">Historique du dossier</h2>

      {isLoading ? (
        <TimelineSkeleton />
      ) : isError ? (
        <div className="mt-4">
          <p className="text-sm text-gov-gray-dark">
            L'historique n'a pas pu être chargé.
          </p>
          {onRetry && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
              <RotateCw size={14} strokeWidth={1.75} /> Réessayer
            </Button>
          )}
        </div>
      ) : !histories || histories.length === 0 ? (
        <p className="mt-4 text-sm text-gov-gray-dark">
          Aucune étape enregistrée pour ce dossier.
        </p>
      ) : (
        <ol className="mt-5">
          {histories.map((step, index) => {
            const isLatest = index === histories.length - 1;
            const agent = step.id_user ? userNames.get(step.id_user) : undefined;
            const service = step.id_service ? serviceNames.get(step.id_service) : undefined;

            return (
              <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Rail : relie les étapes, s'arrête à la dernière. */}
                {!isLatest && (
                  <span
                    className="absolute bottom-0 left-[15px] top-9 w-px bg-gov-gray-medium"
                    aria-hidden="true"
                  />
                )}

                <span
                  className={[
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center',
                    'rounded-[var(--radius-pill)] border text-[12px] font-bold tabular-nums',
                    isLatest
                      ? 'border-gov-gold bg-gov-surface text-gov-dark ring-1 ring-gov-gold'
                      : 'border-gov-gray-medium bg-gov-gray text-gov-gray-dark',
                  ].join(' ')}
                >
                  {step.stepNumber}
                </span>

                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {/* `action` arrive déjà lisible de l'API (« Clôture », « Lecture »). */}
                    <p className="font-medium text-gov-dark">{step.action}</p>
                    <StatusChip id={step.id_status} size="sm" />
                    {isLatest && (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gov-gold">
                        Étape actuelle
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[13px] text-gov-gray-dark">
                    {service ?? 'Service non précisé'}
                    {agent && <> · {agent}</>}
                    {' · '}
                    <time dateTime={step.created_at}>{formatDateTime(step.created_at)}</time>
                  </p>

                  {step.comment && (
                    <p className="mt-2 border-l-2 border-gov-gray-medium pl-3 text-[13px] leading-relaxed text-gov-dark">
                      {step.comment}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}

function TimelineSkeleton() {
  return (
    <div className="mt-5 space-y-6" aria-label="Chargement de l'historique">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <Skeleton className="h-8 w-8 shrink-0 rounded-[var(--radius-pill)]" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      ))}
    </div>
  );
}
