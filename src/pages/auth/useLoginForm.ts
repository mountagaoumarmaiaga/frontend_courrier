import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import type { LoginCredentials } from '@/lib/types';
import type { ApiError } from '@/lib/api/client';

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

/**
 * Toute la logique de l'écran de connexion : état du formulaire, soumission,
 * mapping des erreurs de l'API vers les champs, affichage du mot de passe et
 * pré-remplissage des comptes de démonstration. La présentation reste dans
 * les composants.
 */
export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const {
    register, handleSubmit, setValue, setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: 'onTouched',
    defaultValues: { email: '', password: '', remember: true },
  });

  const submit = handleSubmit(async (data) => {
    // Le schéma authentifie sur `login` : l'adresse e-mail est envoyée comme login.
    const credentials: LoginCredentials = { login: data.email.trim(), password: data.password };
    try {
      const user = await login(credentials);
      toast.success(`Bienvenue, ${user.firstName}.`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.fieldErrors?.login) setError('email', { message: apiError.fieldErrors.login[0] });
      if (apiError.fieldErrors?.password) setError('password', { message: apiError.fieldErrors.password[0] });
      if (!apiError.fieldErrors?.login && !apiError.fieldErrors?.password) {
        setError('root', { message: apiError.message ?? 'Connexion impossible.' });
      }
    }
  });

  const fillDemo = (compte: { login: string; password: string }) => {
    setValue('email', compte.login, { shouldValidate: true });
    setValue('password', compte.password);
    setShowPassword(false);
  };

  return { register, errors, isSubmitting, submit, showPassword, setShowPassword, fillDemo };
}
