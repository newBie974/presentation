# Notes — article en highlight, pagination & filtre tags allégé

**Date** : 2026-07-16
**Statut** : validé, prêt pour plan d'implémentation
**Portée** : page d'archive des notes (`/notes` FR + `/en/writing` EN)

---

## Problème

La page d'archive des notes liste **tous** les articles d'un coup (~22 par langue), sans
hiérarchie ni pagination. Deux manques :

1. **Aucun article n'est mis en avant** — impossible d'épingler un article phare.
2. **La liste est plate et longue** — pas de pagination, tout défile.
3. **Le filtre par tags fait du bruit** — `all` + **19 tags** + RSS sur une ligne. La
   taxonomie est en plus brouillonne : `ia` (10) et `ai` (6) coexistent (doublon FR/EN),
   et 8 tags n'ont qu'un seul article (`remote`, `launch`, `geo`, `freelance`, `design`,
   `data`, `backend`, `astro`).

## Objectif

- Mettre **un** article en highlight (grande carte) en tête de la page 1.
- Paginer la liste : **5 articles par page**, du plus récent au plus ancien.
- Alléger le filtre tags : ne montrer qu'un petit set curé + un lien vers une page listant
  tous les tags.
- Zéro régression : `/notes` et `/en/writing` restent les URLs de page 1 ; build 0 erreur /
  0 warning ; budgets Lighthouse tenus ; aucun JS client ajouté.

## Non-objectifs (YAGNI)

- Pas de nettoyage de taxonomie (fusion `ia`/`ai`, suppression des singletons) — chantier
  de contenu séparé.
- Pas de pagination ni de highlight sur les pages de tags (`/notes/tags/<tag>`).
- Pas d'infinite scroll, pas de highlight multiple, pas de filtre client-side.

---

## Décisions retenues

| Sujet                         | Décision                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Sélection du highlight        | Flag manuel `featured: true` dans le frontmatter                             |
| Si plusieurs `featured`       | On prend le plus **récent** (liste triée récent→ancien, `.find`)             |
| Si aucun `featured`           | Pas de carte highlight ; la liste démarre à l'article 1                      |
| Taille de page                | **5** articles / page                                                        |
| Placement highlight           | Page 1 **uniquement**, **exclu** de la liste paginée (pas de doublon)        |
| Filtre tags                   | `[tous]` + `PRIMARY_TAGS` curés + lien « tous les tags → » + RSS             |
| Page « tous les tags »        | Nouvelle `notes/tags/index.astro` + miroir EN, tags + compte                 |
| Pages de tags `<tag>`         | Inchangées                                                                   |
| Article en highlight (défaut) | Ti Boug (2026-07), FR + EN                                                   |
| `PRIMARY_TAGS` (défaut)       | `["indie", "build", "process", "claude", "ia"]`                              |
| Highlight sur la home         | Oui — en tête de « Dernières notes », 3 récentes en dessous (featured exclu) |
| Image du highlight            | `mascot/ti-boug-panier.png` via `data/noteCovers.ts` + `astro:assets`        |
| Structure                     | Organism partagé `NotesArchive.astro` (pages minces, DRY)                    |

---

## Architecture

### Vue d'ensemble

Aujourd'hui `pages/notes/index.astro` et `pages/en/writing/index.astro` sont deux fichiers
**quasi identiques** de ~145 lignes (déjà à la limite des 150 lignes du CLAUDE.md). On
extrait tout le rendu dans un **organism partagé** piloté par `locale`, et les fichiers de
page ne font plus que `getStaticPaths` + composition.

```
pages/notes/[...page].astro          (mince : getStaticPaths + <NotesArchive/>)
pages/en/writing/[...page].astro     (mince : getStaticPaths + <NotesArchive/>)
        │
        └── organisms/NotesArchive.astro   (hero + filtres + highlight + liste + pagination)
                 ├── molecules/NoteHighlight.astro   (page 1, si featured)
                 ├── molecules/NoteRow.astro         (existant, réutilisé)
                 └── molecules/Pagination.astro      (prev / page X-Y / next)
```

### Routing & pagination

On convertit les deux `index.astro` en routes rest-param paginées :

- `pages/notes/index.astro` → `pages/notes/[...page].astro`
- `pages/en/writing/index.astro` → `pages/en/writing/[...page].astro`

Pattern Astro standard : le rest-param garde la **page 1 à l'URL de base**.

```
/notes            → page 1   (URL inchangée, pas de régression SEO)
/notes/2          → page 2
/notes/3          → page 3   …
/en/writing       → page 1
/en/writing/2     → page 2   …
```

**Absence de collision** : `[...page]` n'émet que les chemins produits par son
`getStaticPaths` (`/notes`, `/notes/2`, …). `[slug].astro` n'émet que de vrais slugs
(`2026-07-…`, jamais « 2 ») et `tags/[tag]` que des tags. Le build statique route par
chemin généré → pas d'interception croisée.

`getStaticPaths` (FR ; EN identique avec `locale="en"`) :

```ts
export async function getStaticPaths({
  paginate,
}: {
  paginate: PaginateFunction;
}) {
  const all = await loadPublishedNotes("fr"); // trié récent→ancien
  const { featured, rest } = partitionFeatured(all);
  return paginate(rest, {
    pageSize: NOTES_PER_PAGE, // = 5
    props: { featured }, // même valeur sur toutes les pages…
  });
}
```

Le composant n'affiche le highlight **que** si `page.currentPage === 1`. On passe
`featured` comme prop constante (paginate applique les mêmes `props` à toutes les pages) et
c'est le rendu qui décide, en fonction de `currentPage`, de l'afficher ou non. `featured`
étant **déjà exclu** de `rest`, il n'apparaît jamais dans la liste, quelle que soit la page.

### Composants

**`molecules/NoteHighlight.astro`** — grande carte de mise en avant (image + texte).

- Props : `note: NoteEntry`, `locale: Locale`.
- Rendu : image de couverture à gauche (paysage) + bloc texte à droite (empilés en mobile) :
  badge « À la une » / « Featured » (via i18n), titre plus gros que `NoteRow`, excerpt,
  date, temps de lecture, tags. Toute la carte est un lien vers l'article.
- **Image** : les content collections ne peuvent pas importer d'asset, donc le champ
  frontmatter `cover` (string) est résolu via une map `data/noteCovers.ts`
  (`cover` → `ImageMetadata` importé). Rendu via `<Image>` d'`astro:assets`
  (AVIF/WebP + dimensions auto). Si `cover` absent ou introuvable dans la map → carte
  texte seule (dégradation propre).
- Réutilise `buildNoteUrl`, `getNoteReadingTime`, `formatDate`, `noteCovers`.
- Style scoped brutaliste (bordures `--border-w`, tokens `theme.css`, hover accent comme
  `NoteRow`). Respecte `prefers-reduced-motion`. `< 150` lignes.

**`molecules/Pagination.astro`** — navigation entre pages.

- Props : `page: Page` (l'objet Astro Page ; expose `url.prev`, `url.next`, `currentPage`,
  `lastPage`), `locale: Locale`.
- Rendu : `← Précédent · Page X / Y · Suivant →`, mono / brutaliste. Les extrémités
  (`url.prev`/`url.next` absent) rendent un `<span>` désactivé (pas de `<a>`), avec
  `aria-disabled`. Nav landmark `aria-label` traduit.
- Ne rend rien si `lastPage === 1`.
- Zéro JS (liens `<a href>` statiques). `< 150` lignes.

**`organisms/NotesArchive.astro`** — assemble la vue.

- Props : `locale: Locale`, `page: Page<NoteEntry>`, `featured: NoteEntry | null`.
  (La barre de filtre lit `PRIMARY_TAGS` directement — pas besoin de passer la liste des
  tags en prop.)
- Rend, dans l'ordre : hero (SectionLabel + h1 + deck), barre de filtre, highlight
  (si `page.currentPage === 1 && featured`), liste (`page.data.map(NoteRow)`), pagination.
- Toutes les strings via `useTranslations(locale)` ; tous les liens via `t.path` /
  `localizePath` (plus aucun href codé en dur `/notes` vs `/en/writing`).
- Reprend le CSS existant des pages `index.astro` (hero, filters, list) — c'est un
  déplacement, pas une réécriture. `< 150` lignes (sinon extraire le hero en molecule).

### Barre de filtre (allégée)

```
[ tous ]  indie  build  process  claude  ia          tous les tags →     RSS ↗
```

- `[tous]` : pill actif pointant vers la page d'archive (`t.path("notes")`).
- `PRIMARY_TAGS` : pills vers `…/tags/<tag>` (via helper de localisation).
- `tous les tags →` : lien vers la page d'index des tags.
- `RSS ↗` : inchangé.

`PRIMARY_TAGS` vit dans **`data/tags.ts`** (source unique, partagée FR/EN — les slugs de
tags sont neutres en langue) :

```ts
// data/tags.ts
export const PRIMARY_TAGS = [
  "indie",
  "build",
  "process",
  "claude",
  "ia",
] as const;
```

### Page « tous les tags »

Nouvelles pages listant **tous** les tags avec leur compte (les singletons et doublons y
vivent, hors de la vue principale) :

- `pages/notes/tags/index.astro` → titre « Tags — Aymeric Dijoux », liste FR
- `pages/en/writing/tags/index.astro` → miroir EN

Chaque entrée : `#<tag>` + `(<n>)` → lien vers `…/tags/<tag>`. Tri par compte décroissant
puis alpha. JSON-LD `Person` (CollectionPage optionnel). `< 150` lignes chacune ; peuvent
partager un petit organism `TagIndex.astro` si la duplication le justifie (sinon deux pages
minces suffisent — décision au moment du plan).

### Highlight sur la page d'accueil (`organisms/NotesSection.astro`)

La home réutilise le highlight. La section « Dernières notes » affiche, dans l'ordre :

```
— DERNIÈRES NOTES                     toutes →
[ ★ NoteHighlight (mascotte Ti Boug) ]      ← si un article featured existe
— note récente 1
— note récente 2
— note récente 3                            ← 3 dernières, featured EXCLU
```

- `NotesSection` charge toutes les notes, applique `partitionFeatured`, rend
  `NoteHighlight` (même composant que l'archive) si `featured`, puis les
  `NOTES_ON_HOME` (3) premières de `rest` en `NoteRow` (`showExcerpt={false}`).
- Dédup : le featured n'apparaît jamais dans les 3 lignes (on mappe sur `rest`).
- Si aucun featured : comportement actuel inchangé (3 dernières, pas de carte).
- Nouveau helper `lib/notes.ts` : `loadHomeNotes(locale, limit)` → `{ featured, latest }`
  pour garder la logique hors du markup (voir Lib ci-dessous).

### Cover images (`data/noteCovers.ts`)

Les content collections stockent `cover` en string ; l'optimisation `astro:assets` exige un
`import`. On fait le pont via une map :

```ts
// data/noteCovers.ts
import type { ImageMetadata } from "astro";
import tibougPanier from "@/assets/mascot/ti-boug-panier.png";

export const noteCovers: Record<string, ImageMetadata> = {
  "tiboug-panier": tibougPanier,
};
```

Frontmatter Ti Boug (FR + EN) : `cover: "tiboug-panier"`. `NoteHighlight` fait
`noteCovers[note.data.cover ?? ""]` → `ImageMetadata | undefined`.

### Lib (`lib/notes.ts`)

Deux fonctions pures ajoutées (logique hors markup) :

```ts
export function partitionFeatured(notes: NoteEntry[]): {
  featured: NoteEntry | null;
  rest: NoteEntry[];
} {
  const featured = notes.find((n) => n.data.featured) ?? null; // liste triée récent→ancien
  const rest = featured ? notes.filter((n) => n !== featured) : notes;
  return { featured, rest };
}

export interface TagCount {
  tag: string;
  count: number;
}

export async function listTagsWithCount(locale: Locale): Promise<TagCount[]> {
  // compte les occurrences sur les notes publiées, tri count desc puis alpha
}

export async function loadHomeNotes(
  locale: Locale,
  limit: number,
): Promise<{ featured: NoteEntry | null; latest: NoteEntry[] }> {
  const all = await loadPublishedNotes(locale);
  const { featured, rest } = partitionFeatured(all);
  return { featured, latest: rest.slice(0, limit) };
}
```

`listAllTags` existant reste (utilisé ailleurs).

### Schéma de contenu (`content.config.ts`)

```ts
featured: z.boolean().default(false),
```

Après modif : `astro sync` pour régénérer les types avant de coder les pages.

### Constantes (`lib/constants.ts`)

```ts
export const NOTES_PER_PAGE = 5; // était 20 (inutilisé jusqu'ici)
```

### i18n (`i18n/ui.ts`) — clés ajoutées (FR + EN)

Pas d'interpolation dans `useTranslations` (renvoie des strings brutes) → « Page X / Y »
est **composé** dans le composant : `` `${t("pagination.page")} ${cur} / ${total}` ``.

| Clé                  | FR                                                                | EN                                                        |
| -------------------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| `pagination.prev`    | Précédent                                                         | Previous                                                  |
| `pagination.next`    | Suivant                                                           | Next                                                      |
| `pagination.page`    | Page                                                              | Page                                                      |
| `pagination.label`   | Pagination                                                        | Pagination                                                |
| `notes.sectionLabel` | — NOTES                                                           | — WRITING                                                 |
| `notes.heroPre`      | Ce que                                                            | What I'm                                                  |
| `notes.heroHl`       | j'apprends                                                        | learning                                                  |
| `notes.heroPost`     | en buildant.                                                      | while building.                                           |
| `notes.deck`         | Notes de build, retours d'expérience… (reprend la description FR) | Build notes, lessons learned… (reprend la description EN) |
| `notes.metaTitle`    | Notes — Aymeric Dijoux                                            | Writing — Aymeric Dijoux                                  |
| `notes.featured`     | À la une                                                          | Featured                                                  |
| `notes.allTags`      | tous les tags                                                     | all tags                                                  |
| `notes.filtersLabel` | Filtres tags                                                      | Tag filters                                               |
| `notes.allPill`      | tous                                                              | all                                                       |
| `notes.rss`          | RSS                                                               | RSS                                                       |
| `notes.empty`        | Pas encore d'article — reviens bientôt.                           | No articles yet — check back soon.                        |
| `tags.sectionLabel`  | — TAGS                                                            | — TAGS                                                    |
| `tags.title`         | Tags                                                              | Tags                                                      |
| `tags.deck`          | Tous les sujets abordés dans les notes.                           | Every topic covered in the notes.                         |
| `tags.metaTitle`     | Tags — Aymeric Dijoux                                             | Tags — Aymeric Dijoux                                     |
| `tags.back`          | ← Toutes les notes                                                | ← All writing                                             |

Le hero (h1 + deck) de l'archive est aussi déplacé en i18n pour alimenter l'organism
partagé (aujourd'hui codé en dur par page). Le h1 est reconstruit :
`{t("notes.heroPre")}<Highlight>{t("notes.heroHl")}</Highlight>{t("notes.heroPost")}`.

**Routes ajoutées** dans `ui.ts` (`routes.fr` / `routes.en`) pour éviter les href codés :

```ts
// routes.fr
tags: "/notes/tags",
rss:  "/rss.xml",
// routes.en
tags: "/en/writing/tags",
rss:  "/en/rss.xml",
```

Liens tag : `` `${localizePath("tags", locale)}/${tag}` `` → `/notes/tags/indie`.

### Contenu

Frontmatter des deux fichiers Ti Boug (FR + EN) :

```yaml
featured: true
cover: "tiboug-panier"
```

```
content/notes/fr/2026-07-ti-boug-prix-marche-reunion.mdx
content/notes/en/2026-07-ti-boug-reunion-market-prices.mdx
```

Un seul article `featured` par langue (le plus récent gagne si conflit).

### SEO / i18n / A11y

- **Page 1** : `MainLayout` avec `routeKey="notes"` (hreflang `/notes` ↔ `/en/writing`
  géré par `buildHreflangLinks`).
- **Pages > 1** : `alternatePath` calculé vers la page numérotée miroir
  (`/notes/2` ↔ `/en/writing/2`), passé à `MainLayout`.
- **`rel="prev"` / `rel="next"`** : injectés dans le slot `head` de `MainLayout` selon
  `page.url.prev` / `page.url.next`.
- **JSON-LD** : `Blog` complet (toutes les notes) **uniquement** sur la page 1 ; `Person`
  seul sur les pages suivantes et sur les pages tags.
- **A11y** : `<nav aria-label>` traduit pour filtre et pagination ; liens désactivés en
  `aria-disabled` ; un seul `<h1>` par page ; focus rings D1 hérités ; badge « À la une »
  lisible (contraste AA — vérifié via `npm run validate:contrast` si nouveau token, sinon
  tokens existants).

---

## Fichiers touchés (récapitulatif)

```
Nouveaux
  src/components/molecules/NoteHighlight.astro
  src/components/molecules/Pagination.astro
  src/components/organisms/NotesArchive.astro
  src/pages/notes/tags/index.astro
  src/pages/en/writing/tags/index.astro
  src/data/tags.ts
  src/data/noteCovers.ts

Renommés / remplacés
  src/pages/notes/index.astro       → src/pages/notes/[...page].astro
  src/pages/en/writing/index.astro  → src/pages/en/writing/[...page].astro

Modifiés
  src/content.config.ts     (cover existe déjà ; featured déjà prévu — voir schéma)
  src/lib/constants.ts      NOTES_PER_PAGE = 5
  src/lib/notes.ts          + partitionFeatured(), + listTagsWithCount(), + TagCount,
                            + loadHomeNotes()
  src/i18n/ui.ts            + clés pagination / notes / tags + routes tags/rss
  src/components/organisms/NotesSection.astro   highlight home + dédup featured
  src/content/notes/fr/2026-07-ti-boug-prix-marche-reunion.mdx   + featured + cover
  src/content/notes/en/2026-07-ti-boug-reunion-market-prices.mdx + featured + cover
```

---

## Critères d'acceptation

- [ ] `/notes` affiche la carte highlight (Ti Boug, avec image mascotte) puis 5 articles ;
      highlight **non** répété dans la liste.
- [ ] Home : la section « Dernières notes » montre la carte highlight (avec image) en tête,
      puis 3 notes récentes **sans** le featured (pas de doublon).
- [ ] L'image du highlight passe par `astro:assets` (AVIF/WebP, dimensions auto, pas de CLS).
- [ ] `/notes/2` … `/notes/N` existent, 5 articles/page, tri récent→ancien, **sans**
      highlight.
- [ ] Pagination fonctionnelle : prev désactivé page 1, next désactivé dernière page,
      « Page X / Y » correct.
- [ ] Miroir EN identique sur `/en/writing`, `/en/writing/2`, …
- [ ] Barre de filtre : `[tous]` + 5 pills curés + « tous les tags → » + RSS.
- [ ] `/notes/tags` et `/en/writing/tags` listent tous les tags avec leur compte.
- [ ] Pages de tags `<tag>` inchangées et fonctionnelles.
- [ ] hreflang correct sur toutes les pages ; `rel=prev/next` présents ; JSON-LD Blog
      page 1 uniquement.
- [ ] `astro check` : 0 erreur / 0 warning. `npm run build` : 0 erreur / 0 warning.
- [ ] Aucun fichier composant > 150 lignes, aucune fonction > 20 lignes, aucun `any`,
      aucune string UI ou href interne codés en dur.

```

```
