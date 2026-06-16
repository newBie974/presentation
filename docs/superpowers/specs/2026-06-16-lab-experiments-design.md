# Spec — Section « Lab » : expériences & mini-apps

**Date** : 2026-06-16
**Statut** : design validé, prêt pour plan d'implémentation
**Périmètre** : ajout d'une surface « lab » au portfolio aymeric.dijoux.dev pour exposer des mini-apps expérimentales (hébergées sur GitHub Pages), sans diluer le grid produits premium.

---

## 1. Objectif & contexte

**But unique** : prouver la **vélocité** et le positionnement « AI builder » d'Aymeric — montrer qu'il ship vite et expérimente l'IA en continu. Ce n'est ni du SEO de fond, ni de la curation produit : c'est une vitrine de débit.

**Contexte existant** :

- Le grid `AppsGrid` / `AppCell` affiche 4 produits _finis_ (KaribTeck, VoiceJournal, Caroubolt, Tookta) depuis `src/data/projects.ts`. Premium, chacun avec domaine/store.
- Les `Notes` (Content Collection MDX bilingue) couvrent le contenu long, SEO/GEO-tuné.
- Nouveau besoin : des mini-apps « vite fait » sur GitHub Pages (ex : `https://newbie974.github.io/world-cup-ia-prono/`).

**Tension résolue** : ces expériences ne doivent **pas** entrer dans le grid produits (dilution du prestige). Elles vivent dans une surface séparée, volontairement plus brute.

---

## 2. Décisions de design (validées)

| #   | Décision          | Choix retenu                                                                       |
| --- | ----------------- | ---------------------------------------------------------------------------------- |
| 1   | Format            | Cartes vitrine légères (pas de mini-articles)                                      |
| 2   | Emplacement       | Page dédiée `/lab` + teaser des 3 dernières sur la home                            |
| 3   | Source de données | Fichier data manuel `experiments.ts` (pas d'API GitHub, pas de Content Collection) |
| 4   | Navigation        | Lab en **footer + teaser home uniquement** — nav principale reste à 4 items        |
| 5   | SEO               | hreflang + sitemap + JSON-LD `ItemList` + ligne llms.txt                           |

**Principe directeur** : friction minimale. Ajouter une expérience = une entrée d'~6 lignes dans un fichier, rien d'autre.

---

## 3. Modèle de données

Nouveau type dans `src/types/index.ts` :

```typescript
export interface Experiment {
  slug: string; // "world-cup-ia-prono"
  title: string; // "World Cup IA Prono"
  tagline: { fr: string; en: string }; // accroche 1 ligne
  url: string; // URL démo GitHub Pages
  date: string; // "YYYY-MM" → tri décroissant
  techStack: string[]; // 2-3 max, reste léger
  repoUrl?: string; // lien GitHub optionnel
}
```

Nouveau fichier `src/data/experiments.ts` exportant `experiments: Experiment[]`.

Différences volontaires avec `Project` : pas de `status`, pas de `logo`, pas de liens stores. Plus léger = signal « expérience, pas produit ».

**Tri** : par `date` décroissante (plus récent d'abord) — c'est l'effet « vélocité ».

---

## 4. Composants

### `molecules/LabCell.astro`

- Props : `experiment: Experiment`, `locale: Locale`.
- Affiche : titre · tagline (locale) · stack en mono · date · lien `démo ↗` + `code ↗` (si `repoUrl`).
- Style dérivé de `AppCell` mais **plus dense / plus brut** (pas de logo, bordure fine, padding réduit) — différenciation visuelle assumée vs le grid produits.
- Liens externes : `target="_blank" rel="noopener noreferrer"`.
- Tokens D1 uniquement, aucun nouveau token. < 150 lignes.

### `organisms/LabGrid.astro`

- Props : `locale: Locale`, `limit?: number`.
- Charge les expériences via un util `lib`, trie, slice si `limit`, mappe en `LabCell`.
- Réutilise le pattern `AppsGrid` (header `SectionLabel` + grille `auto-fill minmax`).
- < 150 lignes.

### `lib/experiments.ts`

- `loadExperiments(limit?: number): Experiment[]` — tri par date décroissante + slice optionnel.
- Sort la logique du markup (règle CLAUDE.md §7). Fonction < 20 lignes.

---

## 5. Pages & routing

| Fichier                  | Route     |
| ------------------------ | --------- |
| `src/pages/lab.astro`    | `/lab`    |
| `src/pages/en/lab.astro` | `/en/lab` |

Chaque page : `MainLayout` avec `routeKey="lab"` (→ hreflang FR↔EN correct via le helper `lib/hreflang.ts`), `Nav`, `page-hero` (titre + deck), `<LabGrid locale={locale} />` (sans `limit`), `Footer`.

**i18n** (`src/i18n/ui.ts`) :

- Route : `lab: "/lab"` (fr) / `lab: "/en/lab"` (en) ajoutée au map `routes`.
- Strings : `nav.lab`, titre + deck de page, label du teaser home (FR + EN).

**Navigation** :

- Footer : ajout d'un lien « Lab » / « Lab ».
- Nav principale : **inchangée** (4 items).

**Teaser home** : `<LabGrid locale={locale} limit={3} />` inséré dans `index.astro` et `en/index.astro`, sous `AppsGrid`, suivi d'un lien « voir tout le lab → » vers `/lab`.

---

## 6. SEO / GEO

- **Metadata** : via `MainLayout` (title/description/canonical/OG/hreflang). Title type « Lab — Aymeric Dijoux, expériences & mini-apps IA ».
- **Sitemap** : ajouter la paire `["/lab/", "/en/lab/"]` à `I18N_PAIRS` dans `astro.config.mjs`.
- **JSON-LD** : builder `buildLabItemListJsonLd(locale)` dans `lib/jsonLd.ts` → `CollectionPage` + `ItemList` (chaque item : `name` + `url`).
- **llms.txt** : ajouter une ligne « Key pages » → « Lab: quick AI experiments & mini-apps ».
- **Liens sortants** : `rel="noopener noreferrer"`, **sans** `nofollow` (projets perso).

Limite assumée : le jus SEO des démos reste sur `github.io` ; non pertinent ici (le but est la preuve de vélocité, pas le ranking des mini-apps).

---

## 7. Contenu de départ

Seed minimal : `world-cup-ia-prono`. Les autres mini-apps seront fournies par Aymeric (URL + 1-liner) ; à défaut on lance avec World Cup seul, enrichi ensuite.

Exemple d'entrée :

```typescript
{
  slug: "world-cup-ia-prono",
  title: "World Cup IA Prono",
  tagline: {
    fr: "L'IA prédit les résultats de la Coupe du Monde.",
    en: "AI predicts World Cup results.",
  },
  url: "https://newbie974.github.io/world-cup-ia-prono/",
  date: "2026-06",
  techStack: ["React", "Claude AI"],
  repoUrl: "https://github.com/newBie974/world-cup-ia-prono",
}
```

---

## 8. Hors-scope (YAGNI)

- Pas de thumbnails / screenshots (friction d'asset).
- Pas de page de détail par expérience.
- Pas de filtres / tags / compteur de vues.
- Pas d'auto-listing via l'API GitHub.
- Une expérience qui mérite un write-up → devient une **Note** classique (système existant).

---

## 9. Critères de réussite

- `/lab` et `/en/lab` rendent la liste triée par date, hreflang FR↔EN correct.
- Teaser home affiche les 3 dernières + lien vers `/lab`.
- Ajouter une expérience = 1 entrée dans `experiments.ts`, rien d'autre.
- `astro check` 0/0, `npm run build` OK, `validate:jsonld` et `validate:contrast` passent.
- Lien footer présent FR + EN ; nav principale inchangée.
