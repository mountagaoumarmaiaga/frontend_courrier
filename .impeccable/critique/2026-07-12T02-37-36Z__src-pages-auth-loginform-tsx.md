---
target: login
total_score: 31
p0_count: 0
p1_count: 1
timestamp: 2026-07-12T02-37-36Z
slug: src-pages-auth-loginform-tsx
---
# Critique — Écran de connexion (login)

⚠️ DEGRADED: single-context (politique d'environnement : sous-agents non lancés sans demande explicite ; navigateur indisponible — pas de preuve visuelle live)

## Design Health Score

| # | Heuristique | Score | Point clé |
|---|---|---|---|
| 1 | Visibilité de l'état | 3 | Spinner + validation inline ; pas de confirmation de succès explicite |
| 2 | Correspondance monde réel | 4 | Français clair, aucun jargon dans les libellés |
| 3 | Contrôle & liberté | 3 | Afficher/masquer le mot de passe ; un login reste minimal |
| 4 | Cohérence & standards | 3 | 12 tailles de police hors ramp ; double signal « TLS 1.3 » |
| 5 | Prévention des erreurs | 3 | Validation required + pattern e-mail |
| 6 | Reconnaissance > rappel | 4 | Comptes de démo visibles, labels flottants |
| 7 | Flexibilité & efficacité | 3 | autocomplete, Entrée = soumettre, se souvenir |
| 8 | Esthétique & minimalisme | 2 | Volet gauche sur-décoré (guilloché + lueur + anneau pulsé + grain + filet) |
| 9 | Récupération d'erreur | 3 | Messages spécifiques + secousse, formulaire préservé |
| 10 | Aide & documentation | 3 | Lien « Contacter l'administrateur » contextuel |
| Total | | 31/40 | Bon (28–35) |

## Anti-Patterns Verdict
LLM : ça ne sent pas l'IA. Identité souveraine distinctive (vert/or, emblème, guilloché, devise). Seul dérapage : maximalisme du volet gauche (trop d'effets ambiants empilés), contraire au Flat-By-Default du DESIGN.md.
Détecteur : 12 avis, tous design-system-font-size (tailles text-[Npx] hors ramp) — LoginForm.tsx (8), InstitutionalPanel.tsx (3), LoginField.tsx (1). Aucun bloquant.
Overlays : indisponibles (navigateur déconnecté), signal de repli déclaré.

## Overall Impression
Écran crédible et distinctif, au-dessus de la moyenne. Le défaut n'est pas un manque mais un trop-plein : le volet accumule les effets, le code multiplie les tailles de police. Plus grande opportunité : retirer, pas ajouter.

## What's Working
- Identité souveraine assumée : signature « État » immédiate, sans cliché.
- Champs à label flottant, focus or, secousse d'erreur : élégant et relié au champ.
- Comptes de démo cliquables : forte réduction de charge pour un premier venu.

## Priority Issues
- [P1] Contraste à vérifier sur le volet vert : textes white/45–55 et or sur dégradé vert risquent < 4,5:1 alors que la cible est RGAA/AAA. Fix : remonter l'opacité (≥ white/70), tester chaque libellé. Commande : /impeccable audit login.
- [P2] Volet gauche sur-décoré : garder UN seul traitement ambiant (guilloché), supprimer anneau pulsé et grain. Commande : /impeccable quieter.
- [P2] Tailles de police hors ramp (12×) : mapper chaque taille sur display/headline/title/body/label. Commande : /impeccable typeset login.
- [P3] Signaux de sécurité redondants : « TLS 1.3 » en double, deux pieds de page. Fix : consolider. Commande : /impeccable distill login.

## Persona Red Flags
Jordan (premier venu) : rien ne bloque ; « SGC v2.0 » en pied n'a aucun sens pour lui.
Sam (lecteur d'écran/clavier) : focus or visible, champs étiquetés, erreurs role=alert ; vérifier le contraste du volet (P1) et que le label flottant reste annoncé malgré placeholder=" ".
Casey (mobile) : volet masqué sous lg, bouton en zone du pouce ; vérifier cibles ≥ 44px sur l'œil.
Usager citoyen (persona projet) : cet écran est l'espace agent ; l'usager externe n'y a pas de porte — éviter qu'il y atterrisse.

## Minor Observations
- Deux pieds de page : un de trop. La devise apparaît deux fois.
- Vérifier que shimmer/breath se coupent sous prefers-reduced-motion (effets inline compris).
