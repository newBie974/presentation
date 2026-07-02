# Design — Note « L'écran blanc au démarrage : anatomie de 4 bugs qui se ressemblent »

Date : 2026-07-02
Type : article de blog bilingue (note MDX FR + EN)
Source : session de debug réelle sur **bazar-pei** (app Expo/RN « Bazar Péi / Ti Boug »),
commits `0dadb12`, `084b6d8`, `116b556`, `d49a83b`.

## Objectif

Écrire une war-story de debugging Expo/React Native, ton « Pièges », ultra-actionnable.
Un seul symptôme (écran blanc muet au démarrage, ni crash ni log), plusieurs causes
indépendantes. Fil rouge : **l'écran blanc = un `return null` conditionné à un état qui
n'arrive jamais**. Leçon transverse : rendre l'échec **visible** plutôt que muet.

Public : développeurs Expo / React Native qui expédient sur TestFlight.
Tags : `["stack", "build", "mobile"]`.

## Contrainte de contenu (mémoire `articles-from-chats`)

- Rien de client / professionnel. Ici OK : Bazar Péi est l'app indie publique d'Aymeric.
- Exemples 100 % reproductibles (Expo, Convex, Zustand, expo-font, EAS).
- Voix : première personne, nuancée, concrète. L'EN est une vraie réécriture idiomatique,
  pas du mot-à-mot.
- Vérifier les noms d'API réels contre les diffs (déjà fait) — ne pas inventer de surface.

## Angle central

`if (!x) return null` où `x` (police chargée / store hydraté / client Convex) n'arrive
jamais dans son état attendu. Pas de crash → pas d'ErrorBoundary déclenché → écran blanc.
Trois causes vécues + une méta-leçon (visibilité de l'échec).

## Structure (7 sections)

1. **Le symptôme** — blanc muet sur TestFlight, invisible en dev. Pourquoi c'est le pire
   bug mobile : pas de crash, pas de log, juste du blanc.
2. **La mécanique commune** — `if (!ready) return null`. Le blanc n'est pas un bug de
   rendu, c'est un état d'attente qui ne se résout jamais.
3. **Cause 1 — la variable d'env gelée au build.** `EXPO_PUBLIC_CONVEX_URL` vide dans le
   build prod → `new ConvexReactClient('')` **throw à l'import du module**, donc AVANT
   tout rendu → non rattrapable par un ErrorBoundary. Racine : `EXPO_PUBLIC_*` sont gelés
   au BUILD ; le profil `production` d'`eas.json` ne déclarait pas `"environment"` → EAS
   n'injectait pas les vars. Fix : `"environment": "production"` dans `eas.json` + `lib/convex`
   renvoie `null` au lieu de throw + throw EXPLICITE (capturé) dans `_layout`.
   Code réel : diff `0dadb12`.
4. **Cause 2 — la police qui échoue en silence.** `useAppFonts` ne lisait que `loaded` de
   `useFonts`, ignorant `error` → un échec de chargement laisse `loaded=false` à vie →
   `_layout` reste sur `return null`. Fix : `return loaded || error !== null` (fallback
   police système). Code réel : diff `084b6d8`.
5. **Cause 3 — la race d'hydratation Zustand persist.** `index.tsx` bloque sur `hydrated`
   via `onFinishHydration`. Si l'hydratation finit AVANT l'attache du listener (timing
   prod/minifié), l'event ne se déclenche jamais → `hydrated` reste `false`. Fix :
   revérifier `hasHydrated()` en début d'effet + filet `setTimeout(…, 2000)`. Code réel :
   diff `116b556`.
6. **Bug 4 — le filet de sécurité était troué.** L'ErrorBoundary censé rattraper le crash
   n'affichait rien, parce qu'un throw **au top-level d'un module** (le `new
ConvexReactClient('')` de la cause 1) part AVANT le premier rendu → aucun ErrorBoundary
   ne peut le capturer. C'est le vrai 4e bug : ton diagnostic était aveugle. Fix en deux
   temps : (a) garder le top-level des modules sans throw (client `null` + throw explicite
   DANS un composant, donc capturable) ; (b) un `ErrorBoundary` qui **affiche** l'erreur —
   texte sélectionnable, débogable sur TestFlight — au lieu d'un blanc muet. Debug :
   `npx expo start --dev-client`, jamais `--no-dev --minify` (qui masque les erreurs en
   blanc). Rappel : l'app ne tourne pas dans Expo Go (modules natifs). Composant `Callout`.
7. **Checklist « écran blanc »** — ordre de vérification :
   1. `EXPO_PUBLIC_*` bien injectées dans le build (`eas.json` `environment`) ?
   2. Un `return null` qui attend un état async (police, hydratation, client) ?
   3. Cet état a-t-il un chemin d'échec (error) et un timeout de secours ?
   4. Un throw au top-level d'un module (avant rendu) → ErrorBoundary aveugle ?
   5. Un ErrorBoundary qui AFFICHE l'erreur au lieu d'un blanc ?

## Métadonnées

| Champ          | FR                                                                 | EN                                                          |
| -------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Fichier        | `src/content/notes/fr/2026-06-ecran-blanc-expo.mdx`                | `src/content/notes/en/2026-06-blank-screen-expo.mdx`        |
| title          | L'écran blanc au démarrage : anatomie de 4 bugs qui se ressemblent | The blank startup screen: anatomy of 4 bugs that look alike |
| date           | 2026-06-29                                                         | 2026-06-29                                                  |
| locale         | fr                                                                 | en                                                          |
| translationKey | `2026-06-blank-screen-expo`                                        | `2026-06-blank-screen-expo`                                 |
| tags           | `["stack", "build", "mobile"]`                                     | idem                                                        |
| draft          | false                                                              | false                                                       |

`excerpt` (≥ 20 car.) :

- FR : « Ni crash, ni log, juste du blanc. Trois causes différentes, un seul symptôme —
  et la leçon qui vaut plus que les trois fixes : rendre l'échec visible. »
- EN : « No crash, no log, just white. Three different causes, one symptom — and the lesson
  worth more than the three fixes: make failure visible. »

## Composants prose

- `Callout` pour la leçon transverse (section 6).
- Blocs de code Markdown standard (`tsx / `json) tirés VERBATIM des diffs.

## Titre des sections (notes précédentes)

Titre au format « anatomie de N bugs » — cohérent avec le ton concret des notes existantes
(cf. `2026-05-clean-code-react-native-claude`).

## Hors périmètre

- Pas de couverture de la partie « recettes agent » ni review App Store (autres articles).
- Pas d'OG image custom (générée au build par le pipeline existant).
- Cadrage « 4 bugs » = 3 causes de `return null` (env, polices, hydratation) + le 4e bug
  distinct : l'ErrorBoundary aveugle aux throws à l'import (section 6). Les 4 se ressemblent
  car tous produisent le MÊME écran blanc muet, mais ont 4 racines différentes. Honnête et
  non forcé.
