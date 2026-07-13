import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Users, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  useCreateSenderType,
  useUpdateSenderType,
} from '@/lib/api/hooks/use-sender-types';
import type { ApiError } from '@/lib/api/client';
import type { SenderType, SenderTypePayload } from '@/lib/types';

/**
 * Modal de création / modification d'un **Type de soumissionnaire**
 * (module Réglages). Même contrat que le formulaire des services :
 * contrôlé par l'affichage, invalidation du cache par le hook, fermeture
 * à la réussite.
 */
interface SenderTypeFormValues {
  name: string;
  description: string;
}

interface SenderTypeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Type à modifier ; `null`/`undefined` = mode création. */
  senderType?: SenderType | null;
}

export function SenderTypeFormModal({
  open,
  onOpenChange,
  senderType,
}: SenderTypeFormModalProps) {
  const isEdit = !!senderType;
  const createSenderType = useCreateSenderType();
  const updateSenderType = useUpdateSenderType();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SenderTypeFormValues>({
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: senderType?.name ?? '',
      description: senderType?.description ?? '',
    });
  }, [open, senderType, reset]);

  const submit = handleSubmit(async (values) => {
    const payload: SenderTypePayload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
    };
    try {
      if (isEdit) {
        await updateSenderType.mutateAsync({ id: senderType.id, payload });
        toast.success('Type de soumissionnaire modifié.');
      } else {
        await createSenderType.mutateAsync(payload);
        toast.success('Type de soumissionnaire créé.');
      }
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
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
      title={
        isEdit ? 'Modifier le type de soumissionnaire' : 'Nouveau type de soumissionnaire'
      }
      description={
        isEdit
          ? 'Mettez à jour ce type de soumissionnaire.'
          : 'Renseignez le nouveau type de soumissionnaire.'
      }
      icon={<Users size={20} />}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="sender-type-name" required>
            Nom du type
          </Label>
          <Input
            id="sender-type-name"
            placeholder="Ex. Ministère, Particulier, Entreprise…"
            aria-invalid={!!errors.name || undefined}
            {...register('name', {
              required: 'Le nom du type est obligatoire.',
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
          <Label htmlFor="sender-type-description">Description</Label>
          <Textarea
            id="sender-type-description"
            placeholder="Précisions sur ce type de soumissionnaire (facultatif)"
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
