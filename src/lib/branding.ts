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
  /** Emblème officiel (sceau de la République) — fond bleu, lisible sur
      clair comme sur sombre. Fichier dans public/. */
  logo: '/Embleme.jpg',
  /** Emblèmes vectoriels affichés selon le thème (écran de connexion, etc.).
      Remplacez les fichiers dans public/ par les visuels réels. */
  emblem: {
    light: '/emblem-light.svg', // sur fond clair
    dark: '/emblem-dark.svg', // sur fond sombre
  },
} as const;
