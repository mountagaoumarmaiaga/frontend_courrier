/**
 * Types du domaine, calqués sur le schéma de base de données du projet
 * (diagramme partagé par l'équipe). Les colonnes `*_at` et les identifiants
 * `id_*` suivent exactement la convention de la base.
 *
 * Note : le mot de passe n'apparaît jamais côté frontend — il est envoyé au
 * backend lors de la connexion mais n'est ni stocké ni retourné.
 */

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface Role extends Timestamps {
  id: string;
  name: string;
  description?: string;
}

export interface Contact extends Timestamps {
  id: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Institution extends Timestamps {
  id: string;
  name: string;
  description?: string;
  pdfHeader?: string;
  pdfFooter?: string;
  logs?: string;
  id_contact?: string;
}

export interface Service extends Timestamps {
  id: string;
  name: string;
  description?: string;
  id_institution: string;
  id_contact?: string;
}

export interface User extends Timestamps {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  isActive: boolean;
  /** 0 / 1 renvoyé par l'API (Laravel). */
  isEmailVerified?: number;
  id_role: string;
  id_service?: string | null;
  id_institution?: string | null;
  id_contact?: string;
  /** Relations éventuellement incluses par le backend (jointures). */
  role?: Role;
  service?: Service;
  institution?: Institution;
}

export interface Status extends Timestamps {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface SenderType extends Timestamps {
  id: string;
  name: string;
  description?: string;
}

export interface Sender extends Timestamps {
  id: string;
  name: string;
  id_senderType: string;
  id_contact: string;
}

export interface Courier extends Timestamps {
  id: string;
  referenceNumber: string;
  physicalReference?: string;
  subject: string;
  description?: string;
  submissionDate: string;
  id_institution: string;
  id_sender: string;
  id_status: string;
  id_currentUser?: string;
  id_currentService?: string;
}

export interface CourierHistory extends Timestamps {
  id: string;
  stepNumber: number;
  action: string;
  comment?: string;
  id_courier: string;
  id_user?: string;
  id_service?: string;
  id_status: string;
}

/* ─── Authentification ─────────────────────────────────────────────────── */

export interface LoginCredentials {
  login: string;
  password: string;
}

/** Toutes les réponses de l'API archimind sont enveloppées ainsi. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
}

/** Charge utile de POST /auth/login (dans `data`). */
export interface LoginData {
  token: string;
  user: User;
}

/* ─── Réglages : Services & Types de soumissionnaires ──────────────────── */

/**
 * Charge utile de POST /services et PUT /services/{id}.
 * `name` est requis (≤ 255) ; `description` et `id_contact` sont facultatifs
 * (le backend accepte `null`). Distinct du type domaine `Service`, qui
 * décrit la réponse et non l'envoi.
 */
export interface ServicePayload {
  name: string;
  description?: string | null;
  id_contact?: string | null;
}

/** Charge utile de POST /sender-types et PUT /sender-types/{id}. */
export interface SenderTypePayload {
  name: string;
  description?: string | null;
}
