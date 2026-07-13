import { api } from './client';
import type {
  ApiEnvelope,
  LoginCredentials,
  LoginData,
  SenderType,
  SenderTypePayload,
  Service,
  ServicePayload,
  User,
} from '@/lib/types';

/**
 * Module d'authentification — reflet exact du dossier `auth` du backend archimind.
 * Base : VITE_API_URL (…/archimind/api). Sécurité : JWT Bearer.
 * Toutes les réponses sont enveloppées : { success, data, message }.
 */
export const authApi = {
  /** POST /auth/login — { login, password } → data: { token, user }. Public. */
  login: (credentials: LoginCredentials) =>
    api.post<ApiEnvelope<LoginData>>('/auth/login', credentials),

  /** POST /auth/logout — invalide le jeton courant. Bearer. */
  logout: () => api.post<ApiEnvelope<unknown>>('/auth/logout'),

  /** GET /auth/me — utilisateur courant. Bearer. */
  me: () => api.get<ApiEnvelope<User>>('/auth/me'),

  /** POST /auth/reset-password/{id} — réinitialisation par un admin. Bearer. */
  resetPassword: (id: string) =>
    api.post<ApiEnvelope<{ plain_password: string }>>(`/auth/reset-password/${id}`),
};

/**
 * Endpoints pour la gestion des utilisateurs.
 */
export const userApi = {
  /** GET /users — liste tous les utilisateurs */
  index: () => api.get<ApiEnvelope<User[]>>('/users'),
};

/**
 * Module « Réglages » — Services (`/services`).
 * CRUD complet ; création = POST, modification = PUT. Bearer requis.
 */
export const serviceApi = {
  /** GET /services — liste. */
  index: () => api.get<ApiEnvelope<Service[]>>('/services'),
  /** GET /services/{id} — détail. */
  show: (id: string) => api.get<ApiEnvelope<Service>>(`/services/${id}`),
  /** POST /services — création. */
  create: (payload: ServicePayload) =>
    api.post<ApiEnvelope<Service>>('/services', payload),
  /** PUT /services/{id} — modification. */
  update: (id: string, payload: ServicePayload) =>
    api.put<ApiEnvelope<Service>>(`/services/${id}`, payload),
  /** DELETE /services/{id} — suppression. */
  remove: (id: string) => api.delete<ApiEnvelope<unknown>>(`/services/${id}`),
};

/**
 * Module « Réglages » — Types de soumissionnaires (`/sender-types`).
 * CRUD complet ; création = POST, modification = PUT. Bearer requis.
 */
export const senderTypeApi = {
  /** GET /sender-types — liste. */
  index: () => api.get<ApiEnvelope<SenderType[]>>('/sender-types'),
  /** GET /sender-types/{id} — détail. */
  show: (id: string) => api.get<ApiEnvelope<SenderType>>(`/sender-types/${id}`),
  /** POST /sender-types — création. */
  create: (payload: SenderTypePayload) =>
    api.post<ApiEnvelope<SenderType>>('/sender-types', payload),
  /** PUT /sender-types/{id} — modification. */
  update: (id: string, payload: SenderTypePayload) =>
    api.put<ApiEnvelope<SenderType>>(`/sender-types/${id}`, payload),
  /** DELETE /sender-types/{id} — suppression. */
  remove: (id: string) =>
    api.delete<ApiEnvelope<unknown>>(`/sender-types/${id}`),
};
