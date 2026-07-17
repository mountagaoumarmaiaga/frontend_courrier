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
  /** `null` sur les champs non renseignés (réponse réelle de l'API). */
  email?: string | null;
  address?: string | null;
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
  /**
   * Relations incluses par le backend. Attention : Laravel les sérialise en
   * **snake_case** (`sender_type`), alors que les colonnes, elles, sont en
   * camelCase (`id_senderType`). Les noms suivent la réponse réelle, vérifiée
   * sur l'API — pas la convention qu'on aurait pu supposer.
   */
  sender_type?: SenderType;
  contact?: Contact;
}

export interface Courier extends Timestamps {
  id: string;
  referenceNumber: string;
  physicalReference?: string | null;
  subject: string;
  description?: string | null;
  submissionDate: string;
  /** Absent de la réponse de `courier.index` : le backend ne l'expose pas. */
  id_institution?: string;
  id_sender: string;
  id_status: string;
  id_currentUser?: string | null;
  id_currentService?: string | null;
  /**
   * Relations incluses par `courier.index`, en **snake_case** (Laravel).
   * Toutes facultatives : la liste doit s'afficher même si l'API se limite un
   * jour aux clés étrangères.
   */
  sender?: Sender;
  status?: Status;
  current_user?: User;
  current_service?: Service;
}

export interface CourierHistory extends Timestamps {
  id: string;
  stepNumber: number;
  /** Intitulé déjà lisible côté API (« Clôture », « Transmission »…). */
  action: string;
  comment?: string | null;
  id_courier: string;
  id_user?: string | null;
  id_service?: string | null;
  id_status: string;
}

/** Query params de `courier.index` (GET /couriers). */
export interface CourierListParams {
  id_status?: string;
  id_currentService?: string;
  search?: string;
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
