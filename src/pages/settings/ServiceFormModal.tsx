import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Building2, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateService, useUpdateService } from '@/lib/api/hooks/use-services';
import type { ApiError } from '@/lib/api/client';
import type { Service, ServicePayload } from '@/lib/types';

/**
 * Modal de création / modification d'un **Service** (module Réglages).
 *
 * Contrôlé par l'affichage (tableau / cartes) : celui-ci ouvre le modal et
 * passe `service` pour éditer, ou rien (`null`) pour créer. À la réussite, le
 * cache des services est invalidé (par le hook) et le modal se ferme.
 *
 * NB : le champ `id_contact` (responsable) existe côté API mais reste absent
 * de ce formulaire tant qu'aucun endpoint ne fournit la liste des contacts à
 * sélectionner. À rebrancher dès qu'un sélecteur de contact sera disponible.
 */
interface ServiceFormValues {
  name: string;
  description: string;
}

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Service à modifier ; `null`/`undefined` = mode création. */
  service?: Service | null;
}

export function ServiceFormModal({ open, onOpenChange, service }: ServiceFormModalProps) {
  const isEdit = !!service;
  const createService = useCreateService();
  const updateService = useUpdateService();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    defaultValues: { name: '', description: '' },
  });

  // (Ré)initialise les champs à chaque ouverture / changement de cible.
  useEffect(() => {
    if (!open) return;
    reset({
      name: service?.name ?? '',
      description: service?.description ?? '',
    });
  }, [open, service, reset]);

  const submit = handleSubmit(async (values) => {
    const payload: ServicePayload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
    };
    try {
      if (isEdit) {
        await updateService.mutateAsync({ id: service.id, payload });
        toast.success('Service modifié.');
      } else {
        await createService.mutateAsync(payload);
        toast.success('Service créé.');
      }
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      // Erreurs de validation renvoyées par le backend, mappées sur les champs.
      if (apiError.fieldErrors?.name) setError('name', { message: apiError.fieldErrors.name[0] });
      if (apiError.fieldErrors?.description)
        setError('description', { message: apiError.fieldErrors.description[0] });
      if (!apiError.fieldErrors?.name && !apiError.fieldErrors?.description) {
        toast.error(apiError.message ?? 'Enregistrement impossible.');
      }
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Modifier le service' : 'Nouveau service'}
      description={
        isEdit
          ? 'Mettez à jour les informations du service.'
          : 'Renseignez les informations du nouveau service.'
      }
      icon={<Building2 size={20} />}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="service-name" required>
            Nom du service
          </Label>
          <Input
            id="service-name"
            placeholder="Ex. Direction des Ressources Humaines"
            aria-invalid={!!errors.name || undefined}
            {...register('name', {
              required: 'Le nom du service est obligatoire.',
              maxLength: { value: 255, message: '255 caractères maximum.' },
            })}
          />
          {errors.name && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-gov-error">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="service-description">Description</Label>
          <Textarea
            id="service-description"
            placeholder="Rôle et périmètre du service (facultatif)"
            {...register('description', {
              maxLength: { value: 1000, message: '1000 caractères maximum.' },
            })}
          />
          {errors.description && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-gov-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
