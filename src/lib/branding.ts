/**
 * Identité de l'institution — centralisée pour un rebranding trivial.
 * Une seule édition ici met à jour l'écran de connexion et l'accueil.
 * Valeurs cohérentes avec le contexte du projet ; à ajuster par le ministère.
 */
export const BRANDING = {
  republic: 'République du Mali',
  motto: 'Un Peuple — Un But — Une Foi',
  ministry: "Ministère de l'Administration Territoriale et de la Décentralisation",
  system: 'Système de Gestion des Courriers Ministériels',
  shortName: 'Gestion des Courriers',
  adminEmail: 'support@courrier.gouv.ml',
  /** Emblèmes affichés selon le thème. Remplacez les fichiers dans public/
      (ou changez ces chemins si vos images ont une autre extension/nom). */
  emblem: {
    light: '/emblem-light.svg', // sur fond clair
    dark: '/emblem-dark.svg', // sur fond sombre
  },
} as const;
