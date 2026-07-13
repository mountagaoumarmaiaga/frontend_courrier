import { useState } from 'react';
import { Plus, Pencil, Building2, Users, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useServices } from '@/lib/api/hooks/use-services';
import { useSenderTypes } from '@/lib/api/hooks/use-sender-types';
import { ServiceFormModal } from './ServiceFormModal';
import { SenderTypeFormModal } from './SenderTypeFormModal';
import type { Service, SenderType } from '@/lib/types';

/**
 * Module « Réglages » (Étape 2) — gestion des Services et des Types de
 * soumissionnaires. Chaque section liste les enregistrements et permet
 * d'ouvrir le formulaire (modal) d'ajout ou de modification. La liste se
 * rafraîchit automatiquement après chaque enregistrement (invalidation du
 * cache par les hooks TanStack Query).
 */
export function SettingsPage() {
  const services = useServices();
  const senderTypes = useSenderTypes();

  // État d'ouverture + cible d'édition pour chaque modal (`null` = création).
  const [serviceModal, setServiceModal] = useState<{ open: boolean; target: Service | null }>({
    open: false,
    target: null,
  });
  const [senderTypeModal, setSenderTypeModal] = useState<{ open: boolean; target: SenderType | null }>({
    open: false,
    target: null,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gov-dark">Réglages</h1>
        <p className="mt-1 text-sm text-gov-gray-dark">
          Gérez les services et les types de soumissionnaires du système.
        </p>
      </div>

        {/* ── Services ── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gov-dark">
              <Building2 size={18} className="text-gov-gold" /> Services
            </h2>
            <Button size="sm" onClick={() => setServiceModal({ open: true, target: null })}>
              <Plus size={15} /> Ajouter
            </Button>
          </div>
          <Card className="divide-y divide-gov-gray-medium">
            {services.isLoading && (
              <div className="flex items-center gap-2 p-4 text-sm text-gov-gray-dark">
                <Loader2 size={16} className="animate-spin" /> Chargement…
              </div>
            )}
            {services.isError && (
              <div className="p-4 text-sm text-gov-error">Erreur de chargement des services.</div>
            )}
            {services.data?.map((service) => (
              <div key={service.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gov-dark">{service.name}</p>
                  {service.description && (
                    <p className="truncate text-sm text-gov-gray-dark">{service.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setServiceModal({ open: true, target: service })}
                >
                  <Pencil size={14} /> Modifier
                </Button>
              </div>
            ))}
            {services.data?.length === 0 && (
              <div className="p-4 text-sm text-gov-gray-dark">Aucun service pour l'instant.</div>
            )}
          </Card>
        </section>

        {/* ── Types de soumissionnaires ── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gov-dark">
              <Users size={18} className="text-gov-gold" /> Types de soumissionnaires
            </h2>
            <Button size="sm" onClick={() => setSenderTypeModal({ open: true, target: null })}>
              <Plus size={15} /> Ajouter
            </Button>
          </div>
          <Card className="divide-y divide-gov-gray-medium">
            {senderTypes.isLoading && (
              <div className="flex items-center gap-2 p-4 text-sm text-gov-gray-dark">
                <Loader2 size={16} className="animate-spin" /> Chargement…
              </div>
            )}
            {senderTypes.isError && (
              <div className="p-4 text-sm text-gov-error">Erreur de chargement des types.</div>
            )}
            {senderTypes.data?.map((senderType) => (
              <div key={senderType.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gov-dark">{senderType.name}</p>
                  {senderType.description && (
                    <p className="truncate text-sm text-gov-gray-dark">{senderType.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSenderTypeModal({ open: true, target: senderType })}
                >
                  <Pencil size={14} /> Modifier
                </Button>
              </div>
            ))}
            {senderTypes.data?.length === 0 && (
              <div className="p-4 text-sm text-gov-gray-dark">Aucun type pour l'instant.</div>
            )}
          </Card>
        </section>

      {/* ── Formulaires (modals) d'ajout / modification ── */}
      <ServiceFormModal
        open={serviceModal.open}
        onOpenChange={(open) => setServiceModal((s) => ({ ...s, open }))}
        service={serviceModal.target}
      />
      <SenderTypeFormModal
        open={senderTypeModal.open}
        onOpenChange={(open) => setSenderTypeModal((s) => ({ ...s, open }))}
        senderType={senderTypeModal.target}
      />
    </div>
  );
}
