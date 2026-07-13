/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de base de l'API backend. Absente = mode démonstration hors-ligne. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
