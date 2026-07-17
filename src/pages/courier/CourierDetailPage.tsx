import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Boxes, Building2, CalendarDays, RotateCw, UserRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourier, useCourierHistory } from '@/lib/api/hooks/use-couriers';
import { formatDate } from '@/lib/utils';
import { CourierTimeline } from './CourierTimeline';
import { SenderBlock } from './SenderBlock';
import { StatusChip } from './StatusChip';
import type { ApiError } from '@/lib/api/client';

/**
 * Dossier ouvert — détail d'un courrier.
 *
 * La référence reste visible en permanence : c'est elle qu'on recopie sur le
 * pli physique et qu'on épelle au téléphone. L'en-tête est donc collant, pas
 * seulement présent en haut de page.
 */
export function CourierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courier = useCourier(id);
  const history = useCourierHistory(id);

  const error = courier.error as ApiError | null;

  if (courier.isError) {
    return (
      <div className="mx-auto max-w-5xl">
        <BackLink />
        <Card className="mt-6 p-10 text-center">
          <p className="font-heading text-lg font-semibold text-gov-dark">
            {error?.status === 404 ? 'Dossier introuvable' : "Ce dossier n'a pas pu être chargé"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gov-gray-dark">
            {error?.status === 404
              ? "Aucun courrier ne porte cet identifiant. Il a pu être supprimé, ou le lien est erroné."
              : (error?.message ?? 'Une erreur est survenue.')}
          </p>
          {error?.status !== 404 && (
            <Button className="mt-5" onClick={() => courier.refetch()}>
              <RotateCw size={15} strokeWidth={1.75} /> Réessayer
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* ─── En-tête collant : la référence ne quitte jamais l'écran ─── */}
      <header className="sticky top-0 z-30 -mx-6 -mt-8 mb-6 border-b border-gov-gray-medium bg-gov-gray px-6 pb-4 pt-6">
        <BackLink />

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          {courier.data ? (
            <>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-gov-dark">
                {courier.data.referenceNumber}
              </h1>
              <StatusChip id={courier.data.id_status} status={courier.data.status} />
            </>
          ) : (
            <Skeleton className="h-8 w-52" />
          )}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
        {/* ─── Colonne principale ─── */}
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.08em] text-gov-gray-dark">
              Objet
            </h2>
            {courier.isLoading ? (
              <div className="mt-3 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <p className="mt-2 font-heading text-xl font-semibold leading-snug text-gov-dark">
                  {courier.data?.subject}
                </p>
                {courier.data?.description && (
                  <p className="mt-3 text-sm leading-relaxed text-gov-dark">
                    {courier.data.description}
                  </p>
                )}
              </>
            )}
          </Card>

          <CourierTimeline
            histories={history.data}
            isLoading={history.isLoading}
            isError={history.isError}
            onRetry={() => history.refetch()}
          />
        </div>

        {/* ─── Colonne latérale ─── */}
        <div className="space-y-5">
          <SenderBlock sender={courier.data?.sender} isLoading={courier.isLoading} />

          <Card className="p-6">
            <h2 className="font-heading text-lg font-semibold text-gov-dark">Dossier</h2>
            <dl className="mt-4 space-y-3.5 text-sm">
              <MetaLine
                icon={<CalendarDays size={15} strokeWidth={1.75} />}
                label="Date de dépôt"
                value={courier.data && formatDate(courier.data.submissionDate)}
                isLoading={courier.isLoading}
              />
              <MetaLine
                icon={<Boxes size={15} strokeWidth={1.75} />}
                label="Référence physique"
                value={courier.data?.physicalReference}
                isLoading={courier.isLoading}
              />
              <MetaLine
                icon={<Building2 size={15} strokeWidth={1.75} />}
                label="Service en charge"
                value={courier.data?.current_service?.name}
                isLoading={courier.isLoading}
              />
              <MetaLine
                icon={<UserRound size={15} strokeWidth={1.75} />}
                label="Agent responsable"
                value={
                  courier.data?.current_user &&
                  `${courier.data.current_user.firstName} ${courier.data.current_user.lastName}`.trim()
                }
                isLoading={courier.isLoading}
              />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/courriers"
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-btn)] text-[13px] font-medium text-gov-gray-dark transition-colors duration-150 hover:text-gov-dark"
    >
      <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
      Retour au registre
    </Link>
  );
}

function MetaLine({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  /** `null` autant que `undefined` : l'API renvoie `null` sur les champs vides. */
  label: string;
  value?: string | null;
  isLoading?: boolean;
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
          {isLoading ? (
            <Skeleton className="mt-1 h-4 w-28" />
          ) : (
            value ?? <span className="italic text-gov-gray-dark">Non assigné</span>
          )}
        </dd>
      </div>
    </div>
  );
}
