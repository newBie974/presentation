# CLAUDE.md — aymeric.dijoux.dev

Tu travailles sur **aymeric.dijoux.dev** : le portfolio personnel d'Aymeric Dijoux.
Site statique Astro multi-pages, bilingue FR (par défaut) / EN, déployé sur GitHub Pages.

Positionnement : **indie builder d'abord, freelance ensuite**. Vitrine des apps (VoiceJournal, Caroubolt, Tookta) + notes + page collaborer.

Spec de design source : `docs/superpowers/specs/2026-05-21-portfolio-design.md`. En cas de conflit entre ce CLAUDE.md et le spec, le spec gagne pour les décisions produit/design ; ce CLAUDE.md gagne pour les règles de code.

---

## Stack & versions

```
Framework        : Astro 5 (output static)
Language         : TypeScript strict
Styling          : Tailwind 4 (@theme + CSS vars), pas de framework UI
Content          : Astro Content Collections + MDX
Coloration code  : Shiki (intégré Astro)
Icons            : astro-icon + iconify
Fonts            : @fontsource-variable (Inter Tight, JetBrains Mono)
i18n             : Astro i18n natif (defaultLocale fr, sans préfixe)
SEO              : @astrojs/sitemap + JSON-LD components custom
GEO              : llms.txt + JSON-LD entity graph
Tests            : Lighthouse CI + @axe-core/playwright
Deploy           : GitHub Pages via Actions, domaine custom
```

Pas de framework JS additionnel (React/Vue/Svelte). Astro statique pur, hydratation = zéro par défaut.

---

## Architecture des dossiers

```
src/
├─ assets/                         avatars, logos apps, portrait B&W
├─ components/
│  ├─ atoms/                       Avatar, StatusBadge, ThemeToggle, Icon, Highlight, JsonLd
│  ├─ molecules/                   SocialLink, AppCell, NoteRow, Chapter, FAQItem, ProcessStep, ServiceCard, StackGroup, LangToggle
│  ├─ organisms/                   Nav, Hero, AppsGrid, SocialBar, Footer, CollabBand, AboutExcerpt, NotesSection
│  └─ prose/                       Callout, FileBlock, CodeTabs, Stackblitz, Tweet (composants MDX)
├─ content/
│  └─ notes/
│     ├─ fr/                       articles FR (.mdx)
│     └─ en/                       articles EN (.mdx)
├─ data/                           profile.ts, projects.ts, socialLinks.ts, services.ts, faq.ts, chapters.ts
├─ i18n/
│  ├─ ui.ts                        strings UI bilingues
│  └─ utils.ts                     getLocale(), localizePath(), useTranslations()
├─ layouts/
│  ├─ MainLayout.astro
│  └─ NoteLayout.astro
├─ lib/
│  ├─ readingTime.ts
│  ├─ dates.ts
│  ├─ ogImage.ts                   génération Satori
│  ├─ jsonLd.ts                    builders schema.org
│  └─ geo.ts                       génération llms.txt, ai.txt, robots.txt
├─ pages/
│  ├─ index.astro                  home FR
│  ├─ a-propos.astro
│  ├─ collaborer.astro
│  ├─ notes/                       index, [slug], tags/[tag], og/[slug].png.ts
│  ├─ robots.txt.ts                AI crawlers allow + SEO
│  ├─ llms.txt.ts                  GEO résumé site
│  ├─ llms-full.txt.ts             GEO version exhaustive
│  ├─ ai.txt.ts                    GEO policy
│  ├─ rss.xml.ts                   RSS FR
│  └─ en/                          miroir EN avec slugs traduits + rss.xml.ts
├─ styles/
│  ├─ global.css                   reset, base, Tailwind directives
│  ├─ theme.css                    @theme Tailwind 4 + dark mode overrides
│  └─ prose.css                    typographie MDX
└─ types/                          interfaces partagées
```

---

## Clean Code — règles non négociables

Ces règles s'appliquent à chaque fichier, chaque fonction, chaque PR. Pas d'exception.

---

### 1. Limite de taille — 150 lignes max par composant Astro, 120 par fichier .ts/.tsx

Si un fichier dépasse, c'est le signal qu'il fait trop de choses. **Action immédiate : découper.**

```
✅ Hero.astro             — 90 lignes  (composant pur, juste le hero)
✅ AppsGrid.astro         — 70 lignes  (3 colonnes + AppCell extrait)
✅ AppCell.astro          — 55 lignes  (juste une cellule)
✅ localizePath.ts        — 40 lignes  (juste le mapping de slugs)

❌ index.astro            — 280 lignes (toutes les sections inline)
❌ MainLayout.astro       — 200 lignes (head + nav + footer + body mélangés)
```

**Comment découper quand c'est trop long :**
- Une section de la page → un nouvel organism dans `components/organisms/`
- Une cellule répétée → une molecule dans `components/molecules/`
- Un calcul ou un mapping → un util dans `lib/`
- Une liste de constantes → un fichier dans `data/`

Une page Astro (`src/pages/*.astro`) doit **composer**, pas implémenter. Idéalement < 80 lignes.

---

### 2. Fonctions — 20 lignes max, une seule responsabilité

Une fonction fait **une chose**. Si tu dois écrire "et" pour décrire ce qu'elle fait, découpe-la.

```typescript
// ❌ Fonction qui fait trop de choses
function getNoteMeta(entry: CollectionEntry<"notes">) {
  const readingTime = Math.ceil(entry.body.split(/\s+/).length / 200);
  const date = new Date(entry.data.date).toLocaleDateString("fr-FR");
  const url = entry.data.locale === "fr"
    ? `/notes/${entry.slug}`
    : `/en/writing/${entry.slug}`;
  const altUrl = entry.data.translationKey
    ? findTranslation(entry.data.translationKey, entry.data.locale === "fr" ? "en" : "fr")?.url
    : null;
  return { readingTime, date, url, altUrl };
}

// ✅ Découpée
function getNoteMeta(entry: CollectionEntry<"notes">) {
  return {
    readingTime: computeReadingTime(entry.body),
    date: formatDate(entry.data.date, entry.data.locale),
    url: buildNoteUrl(entry),
    altUrl: findAlternateLocaleUrl(entry),
  };
}
```

---

### 3. Nommage — explicite, sans abréviation

```typescript
// ❌ Flou
const d = new Date()
const fn = (e) => e.data.locale === "fr"
const tt = entries.filter(fn).length

// ✅ Explicite
const publishedAt = new Date()
const isFrenchEntry = (entry: NoteEntry) => entry.data.locale === "fr"
const frenchNoteCount = entries.filter(isFrenchEntry).length
```

**Conventions par type :**

```typescript
// Booléens → préfixe is / has / can / should
const isDraft = entry.data.draft
const hasTranslation = !!entry.data.translationKey
const canShowLangToggle = hasTranslation && translationExists

// Handlers → préfixe handle (côté client uniquement, rare ici)
const handleThemeToggle = () => {}

// Async / build-time → verbe d'action clair
async function loadPublishedNotes(locale: Locale) {}
function buildOgImageUrl(slug: string): string {}

// Constantes → SCREAMING_SNAKE_CASE
const NOTES_PER_PAGE = 10
const DEFAULT_LOCALE = "fr"
const SUPPORTED_LOCALES = ["fr", "en"] as const
```

---

### 4. Composants Astro — structure imposée

Chaque composant suit toujours le même ordre :

```astro
---
// 1. Imports (externes → internes → types)
import { Image } from "astro:assets";
import Highlight from "@/components/atoms/Highlight.astro";
import { useTranslations } from "@/i18n/utils";
import type { Project } from "@/types";

// 2. Props typées
interface Props {
  project: Project;
  locale: "fr" | "en";
}

const { project, locale } = Astro.props;

// 3. Logique au build (jamais dans le markup)
const t = useTranslations(locale);
const statusLabel = t(`apps.status.${project.status}`);
const techList = project.techStack.join(" · ");
---

{/* 4. Markup — propre, sans logique inline complexe */}
<article class="app-cell">
  <div class="logo-box">
    {project.logo && <Image src={project.logo} alt={`${project.title} logo`} />}
  </div>
  <h3 class="name">{project.title}</h3>
  <p class="desc">{project.tagline}</p>
  <p class="tech">{techList}</p>
  <p class="status">{statusLabel}</p>
</article>

{/* 5. Styles scoped Astro OU classes Tailwind — choisir un seul style par composant */}
<style>
  .app-cell {
    border-right: var(--border-w) solid var(--color-border);
    padding: 1.25rem;
  }
  /* etc. */
</style>
```

**Règles complémentaires** :
- Une seule export default implicite par fichier (le composant Astro lui-même).
- Pas de `<script>` client si on peut éviter — préférer CSS-only et Astro server.
- Si un `<script>` client est nécessaire, utiliser `<script>` avec TypeScript et l'importer en module.

---

### 5. TypeScript — strict sans compromis

```typescript
// ❌ Interdits
const data: any = await getCollection("notes")
const entry = somethingUnknown as NoteEntry
function process(input: any) {}

// ✅ Requis
// Types explicites sur toutes les fonctions exportées
export async function loadPublishedNotes(locale: Locale): Promise<NoteEntry[]> {}

// Union types plutôt que string libre
export type Locale = "fr" | "en"
export type NoteTag = "indie" | "build" | "stack" | "launch" | "ia"
export type AppStatus = "live" | "wip" | "archived"

// Types globaux dans src/types/ — jamais inline dans les composants
export interface Project {
  title: string
  tagline: string
  url: string
  status: AppStatus
  techStack: string[]
  appStoreUrl?: string
  playStoreUrl?: string
  logo: ImageMetadata
}

// Schemas Zod dans content/config.ts — Astro génère les types automatiquement
import { defineCollection, z } from "astro:content"
const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    locale: z.enum(["fr", "en"]),
    translationKey: z.string(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
})
```

`astro check` doit passer 0 erreur, 0 warning avant tout commit.

---

### 6. Pas de couleurs ni de tailles en dur

Le D1 Swiss Brutalist vit dans `src/styles/theme.css` via `@theme`. Toute valeur de design vient de là.

```astro
{/* ❌ Hardcodé */}
<div style="background: #ccff00; padding: 16px; color: #0a0a0a;">…</div>
<div class="bg-[#ccff00] p-[16px] text-[#0a0a0a]">…</div>

{/* ✅ Tokens */}
<div class="bg-accent text-text p-4">…</div>

{/* Cas où on touche au CSS scoped */}
<style>
  .cell {
    background: var(--color-bg-soft);
    border: var(--border-w) solid var(--color-border);
  }
</style>
```

**Règle critique GEO/A11y** : `--color-accent` (#ccff00) ne doit **jamais** être utilisé comme `color:` sur fond clair (contraste WCAG raté). Il sert uniquement comme `background` derrière du texte foncé (Highlight component, pills, CTAs).

Si tu écris un nouveau composant et qu'il n'a pas accès à un token, c'est probablement qu'il manque dans `theme.css` — ajoute-le là, pas dans le composant.

---

### 7. Pas de logique dans le markup

```astro
{/* ❌ Logique dans le render */}
---
import { getCollection } from "astro:content";
const notes = await getCollection("notes");
---
<section>
  {notes
    .filter(n => n.data.locale === Astro.currentLocale && !n.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 3)
    .map(note => <NoteRow note={note} />)}
</section>

{/* ✅ Logique extraite, markup lisible */}
---
import { loadLatestNotes } from "@/lib/notes";
const latestNotes = await loadLatestNotes(Astro.currentLocale, 3);
---
<section>
  {latestNotes.map(note => <NoteRow note={note} />)}
</section>
```

Ce qui va dans `lib/` : tout calcul, filtre, tri, mapping, format. Ce qui reste dans la page : la composition.

---

### 8. Imports — ordre et alias

```typescript
// 1. Astro / framework
import { getCollection } from "astro:content";
import { Image } from "astro:assets";

// 2. Librairies externes
import { z } from "zod";

// 3. Imports internes — toujours via l'alias @/
import MainLayout from "@/layouts/MainLayout.astro";
import Hero from "@/components/organisms/Hero.astro";
import { useTranslations } from "@/i18n/utils";
import { loadLatestNotes } from "@/lib/notes";

// 4. Types (import type)
import type { Locale, Project } from "@/types";
```

Configurer l'alias dans `tsconfig.json` :

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

### 9. Pas de magic numbers

```typescript
// ❌ Sortis de nulle part
const recent = notes.slice(0, 3)
if (entry.body.split(" ").length > 800) {}
setTimeout(reveal, 250)

// ✅ Constantes nommées dans lib/constants.ts ou en haut du fichier
export const NOTES_ON_HOME = 3
export const LONG_ARTICLE_WORD_THRESHOLD = 800
export const SCROLL_REVEAL_DELAY_MS = 250
```

---

### 10. Un fichier = une responsabilité

```
✅ src/components/molecules/AppCell.astro    → un composant
✅ src/lib/notes.ts                          → load/filter/sort des notes
✅ src/lib/dates.ts                          → format/parse dates
✅ src/data/projects.ts                      → données des projets

❌ src/lib/helpers.ts                        → fourre-tout interdit
❌ src/components/Misc.astro                 → "divers" interdit
```

---

### 11. Pas de regression dans `npm run build`

Le build doit toujours passer 0 erreur, 0 warning. Si un warning apparaît :
1. Le comprendre.
2. Le corriger (ne pas l'ignorer).
3. Sinon, le documenter explicitement dans un commentaire avec un TODO daté.

---

## Conventions spécifiques au projet

### A. i18n — toujours via `useTranslations`

```astro
---
// ❌ Hardcoder du texte UI dans un composant
<a href="/collaborer">Réserver un call</a>

// ✅ Toujours passer par i18n/ui.ts
import { useTranslations } from "@/i18n/utils";
const t = useTranslations(Astro.currentLocale);
---
<a href={t.path("work")}>{t("cta.bookCall")}</a>
```

Toute nouvelle string UI = ajout d'une clé dans `src/i18n/ui.ts` avec ses deux traductions (FR + EN).

**Liens internes** : toujours via `t.path("about")` ou `localizePath("/a-propos", locale)`. Jamais de href hardcodé `/a-propos`.

---

### B. Contenu — notes et translationKey

Pour ajouter une note bilingue :

```
src/content/notes/fr/2026-05-pourquoi-je-code-seul.mdx
src/content/notes/en/2026-05-why-i-code-alone.mdx
```

Frontmatter requis :

```yaml
---
title: "Pourquoi je code mes apps tout seul"
date: 2026-05-12
locale: fr
translationKey: 2026-05-coding-alone   # ← identique dans les 2 fichiers
tags: [indie, build]
excerpt: "Spoiler : c'est plus long que tu crois, et c'est moins grave que tu crois."
draft: false
---
```

La paire FR ↔ EN est identifiée par `translationKey`. Le toggle FR↔EN sur l'article ne s'affiche **que** si la traduction existe.

Un article peut exister en une seule langue — c'est OK. Pas de Google Translate automatique.

---

### C. Lien externe — toujours via `<a rel="noopener">` ou composant dédié

Pour les liens vers les apps, GitHub, LinkedIn, App Store, etc. : `rel="noopener noreferrer"` obligatoire si `target="_blank"`.

Le plugin `rehype-external-links` configuré dans Astro applique ça automatiquement aux liens MDX. Pour les liens dans les composants Astro, le faire explicitement.

---

### D. Images — toujours via `astro:assets`

```astro
{/* ❌ */}
<img src="/avatar.png" alt="Avatar" />

{/* ✅ */}
---
import { Image } from "astro:assets";
import avatar from "@/assets/avatar.png";
---
<Image src={avatar} alt="Avatar d'Aymeric" widths={[200, 400, 800]} sizes="200px" />
```

Astro génère AVIF + WebP + fallback, calcule width/height pour éviter CLS, et applique `loading="lazy"` par défaut (sauf images au-dessus du pli — explicitement `loading="eager"` + `fetchpriority="high"`).

---

### E. SEO/GEO — toujours déclarer les métadonnées

Chaque page doit appeler le composant `<SeoHead>` (à créer) qui injecte :
- title, description, canonical
- OpenGraph + Twitter Card
- hreflang (FR ↔ EN)
- JSON-LD adapté à la page (Person sur Home/About, BlogPosting sur articles, FAQPage sur Collaborer, etc.)

Une page publique sans `<SeoHead>` n'est pas mergeable. Un test CI (script Node qui parse le `dist/`) vérifie qu'aucune page n'oublie son JSON-LD.

---

### F. A11y — focus rings, landmarks, reduced motion

```css
/* Focus ring D1 — visible et brutaliste */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-accent);
}

/* Toute animation doit respecter prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Chaque page :
- `<html lang>` correct (`fr` ou `en`)
- `<main id="main">` avec skip-link `<a href="#main" class="skip-link">`
- Landmarks ARIA si plusieurs `<nav>` (`aria-label="Primary"`, etc.)
- Hiérarchie des `<h1>`-`<h6>` cohérente (un seul `<h1>` par page)

---

## Checklist avant de valider du code

Avant chaque commit, vérifier :

```
□ astro check passe (0 erreur, 0 warning)
□ npm run build passe (0 erreur, 0 warning)
□ eslint + prettier --check passent
□ Aucun fichier composant > 150 lignes / .ts > 120 lignes
□ Aucune fonction > 20 lignes
□ Aucun any TypeScript, aucun cast non justifié
□ Aucune string UI hardcodée (tout via useTranslations)
□ Aucune couleur hardcodée hors de theme.css
□ Aucun href interne hardcodé (toujours via localizePath / t.path)
□ Toute nouvelle page a un <SeoHead> avec JSON-LD adapté
□ Toute image utilise <Image> d'astro:assets
□ Toute nouvelle note a son frontmatter complet + translationKey si bilingue
□ Le contraste des nouvelles couleurs/usages a été vérifié (axe-core en dev)
□ Le commit message suit la convention conventional commits
```

---

## Tests & qualité

### Stratégie réaliste

Site marketing statique → pas de tests unitaires sur les composants. On teste **ce qui peut casser silencieusement en prod** :

| Niveau | Quoi | Comment |
|---|---|---|
| 1 | Build & types | `astro check` + `astro build` au CI |
| 2 | Accessibilité | `@axe-core/playwright` sur les routes critiques (`/`, `/a-propos`, `/notes`, `/notes/<latest>`, `/collaborer` + miroir EN) |
| 3 | Performance | Lighthouse CI (`@lhci/cli`) — budget Perf ≥ 95, A11y = 100, BP ≥ 95, SEO = 100 |
| 4 | JSON-LD | Script Node qui parse `dist/`, extrait les `<script type="application/ld+json">` et valide la présence de Person/WebSite sur chaque page publique |
| 5 | Contraste | `scripts/validate-contrast.mjs` (`npm run validate:contrast`) — résout les tokens de `theme.css` (y compris les `color-mix(... transparent)` sur leur fond) et vérifie WCAG AA ≥ 4.5:1 en clair + sombre, sans navigateur. Tourne au pre-commit (si `theme.css` change) et en CI avant le build, pour attraper un souci de contraste avant axe-core |
| 6 | Liens cassés | (Optionnel V1.1) `linkinator` sur `dist/` |

Pas de tests unitaires Vitest sur les composants Astro — la TS strict + le rendu statique attrapent l'essentiel. Si du jour 1 on a une logique métier réelle (ex: filtre complexe), on teste cette logique pure isolée dans `lib/` avec Vitest.

### Convention de fichiers (si tests pure logic)

```
src/lib/notes.ts                  → src/lib/notes.test.ts
src/lib/dates.ts                  → src/lib/dates.test.ts
src/i18n/utils.ts                 → src/i18n/utils.test.ts
```

---

## Performance — budgets

| Métrique | Budget |
|---|---|
| Lighthouse Performance | ≥ 95 (mobile + desktop) |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | 100 |
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| JS shipped (homepage) | < 30 KB (gzip) |
| CSS shipped (homepage) | < 25 KB (gzip) |

Si une PR fait descendre une métrique sous son budget : c'est un blocker, pas une discussion.

---

## Conventions Git

### Branches
- `main` — production, déployée auto sur `aymeric.dijoux.dev`
- `feat/...` — feature branches
- `fix/...`, `chore/...`, `docs/...`, `refactor/...` — selon le type

### Commits (conventional commits)
```
feat(notes): add filterable tags index page
fix(i18n): handle missing translation gracefully
chore(deps): bump astro to 5.x.y
docs(spec): update phase plan with GEO requirements
refactor(components): extract AppCell from AppsGrid
perf(images): use AVIF for app logos
a11y(nav): make lang toggle keyboard-navigable
seo(home): add SoftwareApplication JSON-LD per project
```

### PRs
- Branche → PR vers `main`
- CI doit passer (build, lint, lighthouse, axe, jsonld-validate)
- Squash & merge

---

## Variables d'environnement (`.env`)

```bash
# Cal.com (URL publique, peut être dans le repo aussi)
PUBLIC_CALCOM_URL=https://cal.com/aymeric-dijoux/intro

# Analytics (optionnel V1)
PUBLIC_PLAUSIBLE_DOMAIN=aymeric.dijoux.dev

# Aucune clé serveur côté client (output: static)
```

Variables préfixées `PUBLIC_` exposées au client. Tout le reste reste côté build.

---

## Déploiement

```bash
# Local
npm run dev                       # http://localhost:4321
npm run build                     # génère ./dist
npm run preview                   # sert ./dist localement

# CI/CD
# GitHub Actions sur push main :
# 1. install deps
# 2. astro check + lint
# 3. astro build
# 4. lighthouse + axe + jsonld-validate
# 5. publish to gh-pages (peer le custom domain via CNAME)
```

`public/CNAME` doit contenir `aymeric.dijoux.dev`.

---

## Pièges à éviter

**Astro n'hydrate rien par défaut.** Si tu mets un onClick dans un composant Astro, il ne marchera pas côté client. Pour de l'interactivité, utilise `<script>` (vanilla TS) ou un composant React avec `client:visible` — mais privilégie toujours CSS-only ou Astro server.

**Les content collections sont typées au build.** Si tu changes le schema Zod, fais `astro sync` pour régénérer les types avant de coder. Sinon les types sont stale.

**Tailwind 4 utilise `@theme`, pas `tailwind.config.js`.** Toute personnalisation passe par `src/styles/theme.css`. Ne crée pas un `tailwind.config.js` — il sera ignoré.

**`Astro.currentLocale` peut être `undefined` au top-level.** Pour les pages dans `pages/en/...`, Astro le détecte automatiquement. Pour les composants partagés, le passer en props plutôt que se reposer sur `Astro.currentLocale`.

**Les images sous `public/` ne passent pas par `astro:assets`.** Elles ne sont pas optimisées. Pour optimisation auto, mettre les images dans `src/assets/` et les importer.

**Les routes API (`.ts` qui exportent `GET`) ne fonctionnent qu'avec `output: "static"` si elles n'utilisent que des données build-time.** OK pour `robots.txt.ts`, `rss.xml.ts`, `og/*.png.ts`. Tout ce qui nécessite du runtime est exclu (et c'est OK — on est statique).

**Les OG images dynamiques (Satori) sont générées au build.** Si tu changes une OG image, fais `astro build` pour la régénérer.

**Le surligneur fluo (#ccff00) ne sert qu'en background.** Jamais comme couleur de texte sur fond clair (échec WCAG). Si tu vois `text-accent` quelque part sur fond cream, c'est un bug.

**`prefers-reduced-motion`** : toute animation doit être désactivée. Ne pas l'oublier dans les nouveaux composants animés.

---

## Ce qu'on NE construit PAS en V1

- Newsletter / capture email
- Métriques live des apps (MRR, downloads)
- Témoignages / social proof public
- Page Talks / Press / Highlights
- CMS (Astro Content Collections suffit)
- Plus d'un thème visuel (D1 only — l'architecture en tokens permettra l'extension)
- Theme switcher D1 ↔ D2 (option reportée si besoin)
- Tests unitaires Vitest sur composants
- E2E (Playwright sert uniquement à axe-core)
- Search côté client (V1.1 si volume de notes le justifie)

---

## Référence — spec source

Pour les décisions design (couleurs, typo, layout, sections, content patterns, GEO requirements) : voir le spec :

```
docs/superpowers/specs/2026-05-21-portfolio-design.md
```

Le spec décrit le **quoi** et le **pourquoi**. Ce CLAUDE.md décrit le **comment**.
