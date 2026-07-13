---
name: Gestion de Courrier Ministériel
description: Registre officiel du courrier d'État — vert et or souverains du Mali, sobre et traçable.
colors:
  green-deep: "#0B2E24"
  green: "#127A52"
  green-hover: "#0E6644"
  gold: "#C9A227"
  gold-light: "#E0B84C"
  surface: "#FAFBF9"
  ivory: "#F7F9F6"
  bg: "#F2F5F0"
  ink: "#1A231F"
  muted-ink: "#5B6B63"
  border: "#D5D8D2"
  white: "#FFFFFF"
  error: "#B23A2E"
  warning: "#B7791F"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 2.375rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  input: "12px"
  btn: "12px"
  card: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "50px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.green-hover}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "40px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    height: "52px"
    padding: "0 16px"
---

# Design System: Gestion de Courrier Ministériel

## 1. Overview

**Creative North Star: "Le Registre Souverain"**

Un registre d'État où chaque pli est consigné, scellé et traçable. La métaphore tient en trois gestes qui n'en font qu'un : le **registre** (la rigueur d'un livre officiel, ligné et ordonné), le **sceau** (l'emblème et le guilloché, la qualité « document régalien ») et la **charte verte** (le calme durable du vert malien). Le système parle d'abord de fiabilité : on doit sentir, avant même de lire, qu'on est dans un service de l'État en qui on peut avoir confiance.

La densité est mesurée. Beaucoup de blanc ivoire, une hiérarchie nette, un seul registre d'accent. Le vert profond porte l'autorité (les grands aplats institutionnels), le vert vif porte l'action (un seul bouton primaire par écran), l'or ne fait que signer — jamais remplir. L'atmosphère est souveraine, posée, rassurante : la gravité vient de l'espace et de la retenue, jamais de l'effet.

Ce système rejette explicitement tout ce qui « sent la génération automatique » : mises en page interchangeables, sections génériques, petites capitales décoratives au-dessus de chaque titre. Il rejette aussi le glassmorphism, les néons, les couleurs flashy, les dégradés excessifs, les illustrations cartoon ou 3D et tout effet futuriste. Ici, le raffinement est retenu, pas démonstratif.

**Key Characteristics:**
- Palette souveraine à deux voix (vert d'autorité + vert d'action) et une seule signature (or).
- Surfaces plates au repos, posées par une ombre douce multi-couches — jamais de relief tapageur.
- Un seul geste primaire par écran ; tout le reste est secondaire ou fantôme.
- Identité malienne assumée (emblème, devise, drapeau) mais traitée comme une signature discrète.
- Accessibilité de service public : contraste élevé, focus or toujours visible, rien porté par la seule couleur.

## 2. Colors

Une palette souveraine bâtie sur le vert de la République et signée d'un or unique, posée sur un fond ivoire chaud plutôt que sur du blanc pur.

### Primary
- **Vert Sceau** (#127A52) : la couleur d'action. Bouton primaire, liens actifs, coches, jauges. C'est la seule surface saturée d'un écran clair, et elle est rare par principe.
- **Vert Souverain** (#0B2E24) : l'autorité. Fond du volet institutionnel (en dégradé sobre 165° vers #061F18), en-têtes régaliens, mode sombre profond. Presque noir, jamais froid.

### Secondary
- **Vert Signé** (#0E6644) : l'état pressé du vert d'action (survol, active). Ne s'emploie jamais seul, seulement comme réponse au geste.

### Tertiary
- **Or de la République** (#C9A227, clair #E0B84C) : la signature. Filet d'accent, anneau de focus, anneau de l'emblème, devise. Jamais un aplat, jamais un fond de bouton en mode clair.

### Neutral
- **Ivoire** (#FAFBF9) : la surface des cartes et des champs. Un blanc réchauffé, jamais clinique.
- **Papier** (#F2F5F0) : le fond de page.
- **Encre** (#1A231F) : le texte principal. Presque noir, teinté vert.
- **Encre Estompée** (#5B6B63) : texte secondaire, libellés, métadonnées.
- **Filet** (#D5D8D2) : bordures, séparateurs, contours de champs au repos.

### Named Rules
**The One Gold Rule.** L'or est une signature, pas une couleur de remplissage. Il n'apparaît que sur ≤ 5 % d'un écran : un filet, un anneau de focus, l'anneau de l'emblème, la devise. Un bouton or plein en mode clair est proscrit ; sa rareté est tout son prestige.

**The Single Green Voice Rule.** Un seul geste primaire vert vif par écran. Le vert d'autorité (#0B2E24) et le vert d'action (#127A52) ne se disputent jamais la même zone : l'un est un fond, l'autre est un bouton.

## 3. Typography

**Display / Titres :** Newsreader (serif, avec Georgia en repli)
**Corps :** Public Sans (avec system-ui en repli)

**Character:** Un serif de lecture (Newsreader) pour les titres — la gravité d'un journal officiel ou d'un rapport ministériel — posé sur une grotesque civique (Public Sans), la police du système de design gouvernemental américain. Le serif porte l'autorité, le sans porte la clarté. L'interlettrage se resserre légèrement (-0.01 à -0.02em) sur les grands titres, s'ouvre (+0.08em) sur les petits libellés capitales.

### Hierarchy
- **Display** (700, clamp(2rem → 2.375rem, ≈ 32–38px), 1.08) : titre du système sur le volet institutionnel. Un seul par page.
- **Headline** (600, 1.5rem, 1.2) : titre de carte (« Connexion à votre espace »), titres de section.
- **Title** (600, 1.125rem, 1.3) : sous-titres, en-têtes de bloc.
- **Body** (400, 0.9375rem ≈ 15px, 1.5) : texte courant, descriptions, valeurs de champ.
- **Caption** (500, 0.8125rem ≈ 13px, 1.4) : texte secondaire d'interface — sous-titres, aides, « se souvenir / oublié », lignes de démo, messages d'erreur.
- **Label** (700, 0.75rem ≈ 12px, +0.08em, MAJUSCULES) : libellés de champ, chips de rôle, métriques.

### Named Rules
**The Functional Caps Rule.** Les capitales tracées sont réservées aux libellés fonctionnels (champs, chips, métriques) et à la devise. Elles ne servent jamais de « chapô » décoratif au-dessus des sections — ce tic est la signature du gabarit généré automatiquement, précisément ce que ce système refuse.

## 4. Elevation

Le système est plat par défaut. Les surfaces ne portent aucune ombre au repos ; la profondeur naît des aplats tonals (ivoire de la carte sur le papier du fond) et du filet. La seule élévation admise est l'ombre douce, diffuse et multi-couches qui pose la carte de connexion — jamais une ombre dure, jamais un halo coloré.

### Shadow Vocabulary
- **Carte posée** (`box-shadow: 0 1px 3px rgba(11,46,36,.03), 0 6px 16px rgba(11,46,36,.05), 0 20px 48px rgba(11,46,36,.07)`) : l'unique ombre du système. Teintée du vert souverain, jamais du noir pur, pour rester dans la palette. Réservée à la carte flottante principale.
- **Bouton d'action** (`box-shadow: 0 4px 12px rgba(18,122,82,.25)`) : une ombre verte basse sous le seul bouton primaire, qui se lève de 1px au survol.

### Named Rules
**The Flat-By-Default Rule.** Les surfaces sont plates au repos. L'ombre n'est pas une décoration : c'est une réponse à une intention (la carte qui flotte, le bouton qui invite). Partout ailleurs, la séparation se fait au filet de 1px (#D5D8D2), jamais à l'ombre.

## 5. Components

### Buttons
- **Shape:** coins doux (12px, `--radius-btn`).
- **Primary:** fond Vert Sceau (#127A52), texte blanc, hauteur 50–52px, ombre verte basse. Un seul par écran.
- **Hover / Focus:** vire au Vert Signé (#0E6644), se lève de 1px, ombre verte plus haute ; focus visible en anneau or (2px, offset 2px). Transitions de 200ms, jamais davantage.
- **Secondary / Ghost:** contour filet ou texte seul en encre ; l'or n'apparaît qu'en focus.

### Cards / Containers
- **Corner Style:** 16px (`--radius-card`).
- **Background:** Ivoire (#FAFBF9), posé sur le Papier (#F2F5F0).
- **Shadow Strategy:** l'unique « Carte posée » (voir Elevation) sur la carte principale ; les blocs internes restent plats, séparés au filet.
- **Border:** anneau intérieur discret 1px (#D5D8D2).
- **Internal Padding:** généreux (24–40px), l'espace est la matière première.

### Inputs / Fields
- **Style:** label flottant, fond Ivoire, contour filet 1px, coins 12px, hauteur 52px. Icône fine (1.5px de trait) à gauche.
- **Focus:** la bordure passe à l'or (#C9A227) et le label du champ se colore en or ; pas de glow, un anneau net.
- **Error:** bordure et texte en Terre Rouge (#B23A2E), micro-secousse (`shake`) à l'apparition du message.

### Navigation
- Fine, texte en encre, état actif marqué par le vert ou l'or ; jamais de barre lourde. Le volet institutionnel de gauche (vert souverain, guilloché, emblème, devise) tient lieu d'ancrage identitaire sur desktop et disparaît sous `lg`, ne laissant que la carte centrée.

### Signature Component — Volet Souverain
Le panneau gauche de connexion : dégradé vert profond (165°, #0F4232 → #0B2E24 → #061F18), emblème du Mali cerclé d'or, devise en capitales or, titre du système, et un filet or en tête. C'est la pièce qui dit « État » d'un coup d'œil.

### Named Rules
**The One Atmosphere Rule.** Le volet souverain ne porte qu'UN seul geste atmosphérique à la fois — le guilloché, à très faible opacité. Empiler par-dessus une lueur qui « respire », un anneau qui pulse et un grain dilue la gravité au lieu de la renforcer : un document officiel n'est pas animé. Une seule ambiance, tenue.

## 6. Do's and Don'ts

### Do:
- **Do** garder un seul geste primaire vert vif (#127A52) par écran ; tout le reste est secondaire, fantôme ou filet.
- **Do** réserver l'or (#C9A227) à la signature : filet, anneau de focus, emblème, devise — jamais un aplat.
- **Do** poser les surfaces à plat et ne lever une ombre douce (teintée #0B2E24) que sur la carte flottante.
- **Do** tenir un contraste élevé (viser 7:1 sur le texte), un focus or toujours visible, et doubler chaque statut d'un libellé ou d'une icône, jamais la seule couleur.
- **Do** traiter l'identité malienne (emblème, devise, drapeau) comme une signature retenue, pas comme un décor.

### Don't:
- **Don't** utiliser le glassmorphism, les néons, les couleurs flashy, les dégradés excessifs, les illustrations cartoon ou 3D, ni aucun effet futuriste.
- **Don't** laisser l'interface « sentir la génération automatique » : mises en page interchangeables, sections génériques prêtes-à-l'emploi.
- **Don't** coller des petites capitales tracées en « chapô » au-dessus de chaque section — les capitales sont réservées aux libellés fonctionnels et à la devise.
- **Don't** empiler deux boutons verts pleins côte à côte, ni faire d'un bouton or plein la norme en mode clair.
- **Don't** séparer des blocs par des ombres : au repos, la séparation se fait au filet de 1px (#D5D8D2).
- **Don't** empiler les effets ambiants sur le volet souverain (guilloché + lueur respirante + anneau pulsé + grain) : un seul geste, sinon ça sent le « regardez tout ce que je sais faire ».
- **Don't** dépasser 200ms sur les transitions d'état ; la dignité est calme, pas animée.
