# Portfolio aymeric.dijoux.dev — Design spec

> Status: ready for implementation planning
> Author: Aymeric Dijoux (with Claude)
> Date: 2026-05-21
> Target: aymeric.dijoux.dev (GitHub Pages)

---

## 1. Overview

Faire évoluer le site actuel (link-in-bio Astro/Tailwind) en un **vrai portfolio multi-pages** qui positionne Aymeric comme **indie builder** d'abord et **freelance** ensuite, et qui sert d'umbrella pour ses apps (VoiceJournal, Caroubolt, Tookta).

### Positionnement
- **Primaire** : indie builder qui ship et utilise ses propres apps.
- **Secondaire** : disponible pour 1-2 missions freelance par semestre.
- CTA principal : essayer les apps. CTA secondaire : réserver un call (Cal.com).

### Audience
Founders early-stage, indie hackers peers, recruteurs tech, prospects freelance, utilisateurs potentiels des apps.

### Success criteria (V1)
- Lancement sur `aymeric.dijoux.dev` avec contenu réel.
- 4 pages publiques (home, à propos, notes, collaborer) en FR + EN.
- 100 Lighthouse sur Performance / Best Practices / SEO / Accessibility (homepage et page article).
- 0 erreur axe-core sur toutes les pages publiques.
- Cal.com fonctionnel sur /collaborer.

---

## 2. Scope & non-goals

### In scope (V1)
- 4 pages : Home, À propos, Notes (index + article + tags), Collaborer.
- Bilingue FR (par défaut) + EN (sous `/en/`).
- Dark mode.
- Content collections pour les notes (MDX + Zod schema).
- Cal.com embed pour le freelance.
- RSS feeds (un par langue).
- OG images dynamiques (Satori).
- Sitemap.xml multilingue + hreflang.
- View Transitions Astro.

### Out of scope (V1)
- Newsletter (capture email) — reportée V1.1.
- Métriques live des apps (MRR, downloads) — reportée V1.2.
- Témoignages / social proof — reportée selon disponibilité de citations.
- Page Talks / Press / Highlights — pas de contenu pour l'instant.
- CMS — content collections suffisent.
- Plus d'un thème visuel — D1 only (architecture en tokens permet l'extension future).

---

## 3. Information architecture

### Sitemap
```
aymeric.dijoux.dev/
├─ /                       Home FR (par défaut)
├─ /a-propos               Story · Philosophie · Stack · Chapitres
├─ /notes                  Index articles
│  ├─ /notes/[slug]        Article individuel
│  └─ /notes/tags/[tag]    Filtrage par tag
├─ /collaborer             Pitch freelance + Cal.com
├─ /rss.xml                RSS FR
├─ /sitemap-index.xml      Sitemap multilingue
└─ /en/                    Miroir EN
   ├─ /en/
   ├─ /en/about
   ├─ /en/writing
   │  ├─ /en/writing/[slug]
   │  └─ /en/writing/tags/[tag]
   ├─ /en/work
   └─ /en/rss.xml
```

### i18n
- **Locale par défaut** : `fr`, sans préfixe URL (`routing.prefixDefaultLocale: false`).
- **Slugs localisés** : mapping explicite via un util `localizePath(path, locale)` :
  - `/a-propos` ↔ `/en/about`
  - `/notes` ↔ `/en/writing`
  - `/collaborer` ↔ `/en/work`
- **Hreflang** automatique injecté dans `<head>` sur chaque page.
- **Switcher de langue** dans le header : redirige vers le même contenu dans l'autre langue si dispo, sinon vers la home de l'autre langue.

---

## 4. Page specs

### 4.1 Home (`/`)
Ordre vertical des sections :

1. **Nav** sticky — brand · menu (Accueil, À propos, Notes, Collaborer) · switcher FR/EN
2. **Hero** — grid 2 colonnes :
   - Gauche : tag (`BUILDER / 2026`), h1 ("Je construis les apps que **j'utilise**." avec surligneur fluo sur "j'utilise"), lead, 2 CTAs (Voir mes apps / Collaborer), status badge ("DISPO S2 2026 · 1 SLOT")
   - Droite : portrait B&W 200×240
3. **SocialBar** — label `FOLLOW /`, 5 pills bordées (Instagram, TikTok, LinkedIn, X, GitHub), handle mono
4. **AppsGrid** — section header (`Ce que je construis` / `03 LIVE`), grid 3 colonnes encadrée, chaque cell = logo + nom + tagline + tech pills + status
5. **About excerpt** — grid 2 colonnes (label + h3 / paragraphes + CTA surligneur "LIRE L'HISTOIRE COMPLÈTE →")
6. **Latest notes** — section header (`Dernières notes` / `TOUTES →`), 3 dernières en mode table mono (date | title | tag)
7. **CollabBand** — section noire pleine largeur, h2 ("On **construit** quelque chose ensemble ?"), texte, CTA `RÉSERVER UN CALL →`
8. **Footer** — © + socials liens + RSS

### 4.2 À propos (`/a-propos`)
Single column lecture longue, 5 sections numérotées + end CTA :

1. **Maintenant** (01) — focus actuel, 2-3 phrases, mis à jour tous les 2-3 mois
2. **Parcours** (02) — chapitres datés (année | rôle | 1 phrase). Source : LinkedIn d'Aymeric. Pas de PDF CV — le LinkedIn dans SocialBar fait office d'official source.
3. **Philosophie** (03) — 3-4 paragraphes sur comment il bosse
4. **Stack 2026** (04) — grille catégorisée (Mobile / Web / Backend / IA / Paiement / Outils), pills mono
5. **Hors code** (05) — 3 cards qui humanisent (lecture, océan, sport ou autre)

End CTA : section noire, mêmes tokens que CollabBand de la home, 2 boutons (Réserver un call / Me suivre).

### 4.3 Notes (`/notes`)
**Index** :
- Page hero : crumb `— Notes`, h1, deck
- Filtres par tag (pills mono)
- Lien RSS visible
- Liste : date mono | title serif-bold | lede + meta (tag · reading time · langue dispo)

**Article (`/notes/[slug]`)** :
- Crumb retour `← Notes`
- h1 grand
- Meta bar : date · tags · reading time · toggle FR↔EN si bilingue
- Body en `Prose` wrapper (typography optimisée)
- Composants MDX dispo : `Callout`, `FileBlock` (filename header + copy), `CodeTabs` (multi-fichiers), `Stackblitz`, `Tweet`
- Footer article : prev/next + tags + lien RSS

**Tags (`/notes/tags/[tag]`)** :
- Génération statique pour chaque tag
- Même layout que /notes filtré

### 4.4 Collaborer (`/collaborer`)
5 sections + end CTA :

1. **Services** (01) — 4 formats (MVP, proto IA, renfort, consulting), cards 2×2
2. **Pour qui** (02) — 2 colonnes "Idéal" / "Pas pour moi"
3. **Process** (03) — 4 étapes numérotées romaines (i, ii, iii, iv)
4. **Tarifs indicatifs** (04) — bloc gris, fourchettes
5. **FAQ** (05) — accordéon, 4-5 questions

End CTA : section noire, h3, texte, bouton "Réserver un call" (Cal.com inline ou popup), fallback email.

---

## 5. Visual system — D1 Swiss Brutalist

### 5.1 Typography
| Rôle | Font | Usage |
|---|---|---|
| Sans | `Inter Tight Variable` | Body, titres, UI, labels — tout sauf le mono |
| Mono | `JetBrains Mono Variable` | Dates, tags, métadonnées, code, pills techniques |

Pas de serif. Aucun italique stylistique (Inter Tight a un italique fonctionnel uniquement).

Échelle typographique :
- h1 : 58/56 · 700 · tracking -0.04em
- h2 : 32/32 · 700 · tracking -0.03em
- h3 : 22/24 · 700 · tracking -0.02em
- body : 15/26 · 400
- lead : 16/25 · 400 · couleur `text-muted`
- mono-meta : 11px · 600 · uppercase · tracking 0.05em
- label : 10px mono · 600 · pill noir + texte fluo

### 5.2 Colors (tokens)

**Light (default)** :
- `--bg`: `#f6f6f4`
- `--bg-soft`: `#ffffff`
- `--border`: `#0a0a0a`
- `--text`: `#0a0a0a`
- `--text-muted`: `#404040`
- `--accent`: `#ccff00`
- `--success`: `#65a30d`
- `--danger`: `#dc2626`

**Dark** (`[data-theme="dark"]`) :
- `--bg`: `#0a0a0a`
- `--bg-soft`: `#171717`
- `--border`: `#f6f6f4`
- `--text`: `#f6f6f4`
- `--text-muted`: `#a3a3a3`
- `--accent`: `#ccff00` (inchangé)
- `--success`: `#84cc16`
- `--danger`: `#ef4444`

**Contraintes WCAG critiques** (à respecter au build, audit axe-core) :
- `#ccff00` n'est utilisé **que** comme background derrière du noir (`color: #0a0a0a`). Jamais comme couleur de texte sur fond clair.
- Tous textes vs leur fond ≥ 4.5:1 (AA) ou ≥ 7:1 (AAA) pour le body.
- Focus rings visibles (le brutalist s'y prête : box-shadow 0 0 0 2px var(--accent)).

### 5.3 Spacing scale
Repose sur la nouvelle convention Tailwind 4 (`--spacing: 0.25rem` = 4px). Utilisation systématique des utilités générées (`p-4`, `gap-6`, etc.) plutôt que des CSS vars custom — Tailwind 4 calcule `calc(var(--spacing) * n)` à la volée.

Max-widths exposés comme containers Tailwind 4 :
- `--container-prose: 65ch` (articles)
- `--container-content: 900px` (home/about/collaborer)
- `--container-narrow: 720px` (notes index)

### 5.4 Borders & radii
- `--border-w: 2px` partout (signature D1)
- `--radius: 0` (pas de rounded corners — brutaliste)
- Exceptions : pills/icons sociales tolèrent une légère bordure si l'effet est trop dur

### 5.5 Component primitives
Existants à conserver/refacto :
- `Avatar`, `StatusBadge`, `ThemeToggle`, `SocialLink`, `IconX` (et frères)

Nouveaux à ajouter :
- `SectionLabel` (pill mono `BUILDER / 2026` style)
- `Highlight` (wrapper `<span>` qui applique le surligneur fluo)
- `AppCell` (la cellule de l'AppsGrid)
- `NoteRow` (ligne article dans l'index)
- `Chapter` (chapitre About — année + rôle + description)
- `StackGroup` (catégorie + pills mono)
- `ServiceCard`, `ProcessStep`, `FAQItem`
- `Prose` wrapper pour MDX
- `LangToggle`

### 5.6 Motion
- **Default** : fade in + rise 8px sur les blocs principaux via Intersection Observer (threshold 0.15)
- **Transitions UI** : 150ms ease-out
- **View Transitions** : composant `<ClientRouter />` d'Astro 5 (stable, non-expérimental), durée 250ms
- **Respect `prefers-reduced-motion`** : kill animate-on-scroll, view transitions, et hover transforms quand demandé (`@media (prefers-reduced-motion: reduce)`)

---

## 6. Technical architecture

### 6.1 Stack additions (sur Astro 5 + Tailwind 4 existants)
```json
{
  "dependencies": {
    "@astrojs/mdx": "^4.x",
    "@astrojs/sitemap": "^3.x",
    "@astrojs/rss": "^4.x",
    "@fontsource-variable/inter-tight": "latest",
    "@fontsource-variable/jetbrains-mono": "latest",
    "astro-icon": "^1.x",
    "@iconify-json/lucide": "latest",
    "@iconify-json/simple-icons": "latest",
    "satori": "^0.x",
    "satori-html": "^0.x",
    "@resvg/resvg-js": "^2.x",
    "reading-time": "^1.x",
    "rehype-external-links": "^3.x",
    "remark-gfm": "^4.x"
  },
  "devDependencies": {
    "@lhci/cli": "^0.x",
    "@axe-core/playwright": "^4.x",
    "@playwright/test": "^1.x"
  }
}
```

Pas de framework JS additionnel (React/Vue/Svelte). Astro statique pur.

### 6.2 Folder structure (`src/`)
```
src/
├─ assets/                         avatars, logos apps, portrait B&W
├─ components/
│  ├─ atoms/                       Avatar, StatusBadge, ThemeToggle, Icon, Highlight, JsonLd
│  ├─ molecules/                   SocialLink, AppCell, NoteRow, Chapter, FAQItem, ProcessStep, ServiceCard, StackGroup, LangToggle
│  ├─ organisms/                   Nav, Hero, AppsGrid, SocialBar, Footer, CollabBand, AboutExcerpt, NotesSection
│  └─ prose/                       Callout, FileBlock, CodeTabs, Stackblitz, Tweet (MDX components)
├─ content/
│  └─ notes/
│     ├─ fr/                       articles FR (.mdx)
│     └─ en/                       articles EN (.mdx)
├─ data/                           profile.ts, projects.ts, socialLinks.ts, services.ts, faq.ts, chapters.ts
├─ i18n/
│  ├─ ui.ts                        strings UI (nav, CTAs, labels) FR + EN
│  └─ utils.ts                     getLocale, localizePath, useTranslations
├─ layouts/
│  ├─ MainLayout.astro             refacto pour D1
│  └─ NoteLayout.astro             page article avec TOC + meta
├─ lib/
│  ├─ readingTime.ts
│  ├─ dates.ts
│  ├─ ogImage.ts                   génération Satori
│  ├─ jsonLd.ts                    builders Person/WebSite/Article/FAQPage/SoftwareApplication
│  └─ geo.ts                       génération llms.txt, ai.txt, robots.txt
├─ pages/
│  ├─ index.astro                  home FR
│  ├─ a-propos.astro
│  ├─ collaborer.astro
│  ├─ notes/
│  │  ├─ index.astro
│  │  ├─ [slug].astro
│  │  ├─ tags/[tag].astro
│  │  └─ og/[slug].png.ts          OG dynamique par article
│  ├─ rss.xml.ts                   RSS FR
│  ├─ robots.txt.ts                AI crawlers allow + standard SEO
│  ├─ llms.txt.ts                  GEO — résumé site pour LLM
│  ├─ llms-full.txt.ts             GEO — version exhaustive
│  ├─ ai.txt.ts                    GEO — policy AI commercial
│  ├─ og/
│  │  ├─ home.png.ts
│  │  └─ default.png.ts
│  └─ en/                          miroir EN
│     ├─ index.astro
│     ├─ about.astro
│     ├─ work.astro
│     ├─ writing/
│     │  ├─ index.astro
│     │  ├─ [slug].astro
│     │  └─ tags/[tag].astro
│     └─ rss.xml.ts                RSS EN
├─ styles/
│  ├─ global.css                   reset, base, Tailwind directives
│  ├─ theme.css                    @theme Tailwind 4 + dark mode overrides
│  └─ prose.css                    MDX typography
└─ types/                          interfaces partagées
```

### 6.3 Tailwind 4 `@theme` setup
Tokens définis dans `theme.css` :
```css
@import "tailwindcss";

@theme {
  --color-bg: #f6f6f4;
  --color-bg-soft: #ffffff;
  --color-border: #0a0a0a;
  --color-text: #0a0a0a;
  --color-text-muted: #404040;
  --color-accent: #ccff00;
  --color-success: #65a30d;
  --color-danger: #dc2626;

  --font-sans: "Inter Tight Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", monospace;

  --radius-base: 0;
  --container-prose: 65ch;
  --container-content: 900px;
  --container-narrow: 720px;
}

[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-bg-soft: #171717;
  --color-border: #f6f6f4;
  --color-text: #f6f6f4;
  --color-text-muted: #a3a3a3;
  --color-success: #84cc16;
  --color-danger: #ef4444;
}
```

Utilisation : `bg-bg`, `text-text`, `border-border`, `text-accent` (sauf pour les usages texte sur fond clair — voir contraintes WCAG).

### 6.4 Content Collections schema (Zod)
```ts
import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    locale: z.enum(["fr", "en"]),
    translationKey: z.string(), // clé partagée FR ↔ EN pour identifier la paire
    excerpt: z.string(),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { notes };
```

- **Organisation fichiers** : `content/notes/fr/<slug>.mdx` et `content/notes/en/<slug>.mdx`.
- **Pairing FR ↔ EN** : la valeur `translationKey` est identique pour les deux fichiers d'une même note. C'est le mécanisme qui permet au toggle FR↔EN sur l'article d'être visible/fonctionnel uniquement quand la traduction existe.
- **Reading time** calculé au build via `reading-time` lu sur le `body` de chaque entry.

### 6.5 Astro config
- `output: "static"`
- `site: "https://aymeric.dijoux.dev"`
- `base: "/"`
- `i18n: { defaultLocale: "fr", locales: ["fr", "en"], routing: { prefixDefaultLocale: false } }`
- `integrations: [mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeExternalLinks] }), sitemap({ i18n: { defaultLocale: "fr", locales: { fr: "fr", en: "en" } } }), icon()]`
- `markdown.shikiConfig: { themes: { light: "github-light", dark: "github-dark" } }`
- View Transitions activées via `<ClientRouter />` dans `MainLayout.astro` (stable en Astro 5, plus besoin de flag `experimental`).

### 6.6 Deployment
- **GitHub Pages** via workflow `.github/workflows/deploy.yml` (déjà partiellement en place — vérifier).
- **Domaine custom** : `aymeric.dijoux.dev` configuré via fichier `public/CNAME` ou settings GitHub Pages (déjà fait selon le user).
- Build : `astro build`, output `dist/`.

---

## 7. Engineering quality requirements

### 7.1 Performance
- Lighthouse Performance ≥ 95 sur Home, page article, page Collaborer (mobile + desktop).
- Core Web Vitals "Good" : LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Pas de JS bloquant le rendu initial.
- Images : `<Image>` Astro avec `format: ["avif", "webp"]`, `loading="lazy"` sauf hero (eager + fetchpriority="high").
- Polices : `font-display: swap`, preload des fichiers `woff2` critiques.
- CSS : Tailwind 4 purge le non-utilisé au build.

### 7.2 Accessibility (a11y)
- Lighthouse Accessibility = 100.
- 0 erreur axe-core sur toutes les pages publiques. Check intégré au CI : un step Playwright qui charge chaque route et exécute `@axe-core/playwright` contre le DOM rendu (le `dist/` statique servi par `astro preview`).
- Skip-link `<a href="#main">` visible au focus.
- Focus indicators custom (box-shadow 2px accent) cohérents avec D1.
- Landmarks ARIA : `<header>`, `<main id="main">`, `<nav aria-label>`, `<footer>`.
- Color contrast vérifié pour chaque combinaison utilisée (script de check au build).
- Respect `prefers-reduced-motion`.
- `<html lang="fr">` ou `lang="en"` selon page.

### 7.3 SEO
- Lighthouse SEO = 100.
- Meta tags complets : title, description, canonical par page.
- Open Graph + Twitter Card complets.
- **OG images dynamiques** via Satori : 1 par article, 1 par page principale.
- Sitemap.xml multilingue avec hreflang et `lastmod` sur chaque article.
- robots.txt généré au build.
- `<link rel="alternate" hreflang>` sur chaque page bilingue.
- Structured data JSON-LD (couvert dans 7.4 ci-dessous — partagé entre SEO et GEO).

### 7.4 GEO (Generative Engine Optimization)
Optimisation pour être surfacé/cité par les moteurs génératifs (ChatGPT, Claude, Perplexity, Google AI Overviews, Bing Copilot, etc.). Distinct du SEO traditionnel.

**A. Foundations**
- **`/llms.txt`** au root (standard https://llmstxt.org) : fichier markdown structuré qui résume le site, liste les pages prioritaires (Home, About, Notes, Collaborer, Apps), donne un mini-bio entity et pointe vers les URLs canoniques. Généré à partir d'un template + données dans `src/data/`.
- **`/llms-full.txt`** (variante exhaustive) : concatène les pages clés en plain text pour ingestion LLM.
- **JSON-LD `Person`** complet, présent sur Home + /a-propos + /en/about :
  - `name`, `givenName`, `familyName`, `jobTitle`, `description`, `url`, `image`, `email` (optionnel), `homeLocation` (Paris)
  - `knowsAbout` : array de domaines (`React Native`, `AI products`, `Indie hacking`, etc.)
  - `sameAs` : URLs de tous les comptes externes (GitHub, LinkedIn, X, Instagram, TikTok, App Store dev page si dispo)
  - `worksFor` ou `affiliation` si applicable (entité indépendante sinon)
- **JSON-LD `WebSite`** sur la racine (avec `inLanguage` multilingue).
- **JSON-LD `BlogPosting`** + `Article` sur chaque note, avec `author` pointant vers l'entité Person canonique (`@id`).
- **JSON-LD `BreadcrumbList`** sur articles et tags.
- **JSON-LD `SoftwareApplication`** par app dans la home (VoiceJournal, Caroubolt, Tookta) avec `creator` pointant vers Person — construit le graphe d'entités Aymeric ↔ apps.

**B. Content patterns**
- **Lead direct dans les 100 premiers mots** de chaque page : les LLM extraient l'ouverture comme summary. Pas de teasing — la réponse à "qui est cette personne / que fait ce site" doit être dite tout de suite.
- **Entity disambiguation** : premier paragraphe de /a-propos commence par une phrase canonique sans ambiguïté ("Aymeric Dijoux is an indie builder and software engineer based in Paris, building and shipping his own consumer apps including VoiceJournal, Caroubolt, and Tookta.").
- **Q&A friendly** : dans les articles longs (>800 mots), les h2 sont rédigés en questions naturelles ("Pourquoi je code mes apps seul ?", "Combien de temps prend un MVP ?") et le premier paragraphe sous chaque h2 contient la réponse condensée.
- **FAQ Schema** (`FAQPage` JSON-LD) injecté sur /collaborer et /en/work à partir des données `data/faq.ts` — Perplexity/Google AI Overviews surfacent ces réponses telles quelles.

**C. Crawler policy**
- **`/robots.txt`** explicite avec `Allow` pour les agents AI majeurs :
  - `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI)
  - `ClaudeBot`, `anthropic-ai`, `Claude-User` (Anthropic)
  - `PerplexityBot`, `Perplexity-User` (Perplexity)
  - `Google-Extended` (Google AI training)
  - `CCBot` (Common Crawl, dataset utilisé par presque tous)
  - `Applebot-Extended` (Apple AI)
  - `Bytespider` (TikTok/ByteDance — peut être bloqué si pas désiré)
- **`/ai.txt`** (standard émergent) : déclaration d'autorisations pour usage commercial AI. Position par défaut V1 : autoriser indexation et citation (cohérent avec l'objectif portfolio).
- **Sitemap** : déjà couvert SEO, mais s'assurer que TOUS les articles y sont avec `<lastmod>`.

**Implémentation** :
- `pages/llms.txt.ts` et `pages/llms-full.txt.ts` : routes Astro qui génèrent les fichiers au build à partir des content collections et data.
- `pages/robots.txt.ts` : génération avec User-agents AI listés.
- `pages/ai.txt.ts` : génération avec policy par défaut.
- Composant `<JsonLd type="Person" />`, `<JsonLd type="BlogPosting" article={...} />`, `<JsonLd type="FAQPage" items={...} />`, `<JsonLd type="SoftwareApplication" app={...} />` — un par type, injecté dans le `<head>` via slot du layout.
- Lint au build : un script Node vérifie qu'aucune page publique ne sort sans un Person/WebSite JSON-LD valide (parse + schema check).

### 7.5 Analytics
**Décision retenue** : à confirmer par Aymeric (option ouverte dans le plan). Options recommandées par ordre de préférence :
1. **Plausible** (auto-hébergeable ou cloud, GDPR-friendly, ~1g de JS)
2. **Umami** (open-source self-hosted)
3. **None** (V1 sans analytics, à brancher V1.1)

Pas de Google Analytics (cookies, perfs, RGPD).

### 7.6 Tests & CI
- ESLint (existant) + Astro plugin (existant).
- Prettier + plugin Tailwind (existant).
- Husky + lint-staged (existant).
- Pas de tests unitaires V1 (site marketing statique).
- CI : workflow GitHub Actions
  - `astro check` (TypeScript + diagnostics Astro)
  - `astro build`
  - `eslint` + `prettier --check`
  - Lighthouse CI (`@lhci/cli`) avec budget : Performance ≥ 95, A11y = 100, Best Practices ≥ 95, SEO = 100
  - `@axe-core/playwright` sur les routes critiques (`/`, `/a-propos`, `/notes`, `/notes/<dernier-slug>`, `/collaborer` + miroir EN) servies par `astro preview`

---

## 8. Content checklist (livré par Aymeric)

Pour pouvoir lancer V1 :
- [ ] **Photo portrait** noir & blanc (ou ton chaud), 800×960 min, format paysage rectangulaire (sera affichée en 200×240 sur mobile, plus grande sur desktop).
- [ ] **Texte hero** validé (FR + EN).
- [ ] **5 sections À propos** rédigées (FR + EN) :
  - Maintenant (2-3 phrases)
  - Parcours : 4 chapitres datés (extraits de LinkedIn — années, rôles, 1 phrase chacun)
  - Philosophie (3-4 paragraphes)
  - Stack 2026 (validé / ajusté)
  - Hors code (3 items)
- [ ] **1 article de lancement** dans /notes (FR a minima, EN optionnel — peut être court "Hello, this site")
- [ ] **Contenu Collaborer** (FR + EN) :
  - 4 services finalisés (titre + description courte)
  - Pour qui / pas pour moi (4-5 bullets chacun)
  - 4 étapes process (déjà rédigées dans le spec, à valider)
  - Tarifs réels (ou décider de masquer les chiffres)
  - 4-5 FAQ (questions + réponses)
- [ ] **Lien Cal.com** configuré (URL de booking 30 min)
- [ ] **Email de contact** confirmé (placeholder spec : `aymeric@dijoux.dev`)
- [ ] **Vérifier la config GitHub Pages** : CNAME, domaine `aymeric.dijoux.dev` pointe bien sur le repo.
- [ ] **Décision analytics** (Plausible / Umami / none)
- [ ] **Entity disambiguation** (GEO) : 1 phrase d'ouverture canonique pour /a-propos en FR + EN (forme "Aymeric Dijoux est ... basé à ... qui ...")
- [ ] **knowsAbout** (GEO) : liste 6-10 domaines d'expertise pour le JSON-LD Person (ex: "React Native", "AI products", "Indie hacking", "Mobile app development", "Consumer apps")
- [ ] **sameAs** (GEO) : confirmer la liste complète des URLs externes (GitHub, LinkedIn, X, Instagram, TikTok, App Store dev page si dispo)

---

## 9. Phased delivery plan

### Phase 01 — Foundations
- Installation deps (mdx, sitemap, rss, fontsource, astro-icon, satori, plugins)
- Tokens CSS dans `theme.css` (light + dark)
- Refacto `MainLayout` et `Nav` en D1
- Config i18n Astro + util `localizePath`
- Config Astro (site, sitemap, view transitions)
- Setup workflow CI (Lighthouse + axe)

### Phase 02 — Home (FR + EN)
- Hero D1 avec portrait, surligneur, status badge
- SocialBar D1 (pills bordées)
- AppsGrid 3 colonnes encadré (refacto `ProductList`)
- About excerpt section
- Latest notes section (skeleton — alimentée par content collection)
- CollabBand + Footer
- Génération OG image home

### Phase 03 — À propos + Notes (FR + EN)
- Page `/a-propos` (5 sections + end CTA)
- Page `/en/about`
- Content collection setup + Zod schema
- Page `/notes` index avec filtres tags
- Page `/notes/[slug]` + `NoteLayout`
- Page `/notes/tags/[tag]`
- Composants Prose (Callout, FileBlock, CodeTabs)
- RSS feeds (FR + EN)
- OG images dynamiques par article (Satori)

### Phase 04 — Collaborer + GEO + polish + ship
- Page `/collaborer` (5 sections + end CTA)
- Cal.com embed
- **JSON-LD complet** : Person (canonique avec `@id`), WebSite, BlogPosting/Article, BreadcrumbList, SoftwareApplication (par app), FAQPage (sur Collaborer)
- **Sitemap.xml multilingue** + hreflang + `lastmod`
- **GEO files** : `/llms.txt`, `/llms-full.txt`, `/robots.txt` (avec allow AI crawlers), `/ai.txt`
- **Lint JSON-LD** : script CI qui vérifie présence Person/WebSite sur toutes les routes publiques
- **Content patterns GEO** : lead direct dans les 100 premiers mots de chaque page + entity disambiguation /a-propos
- View Transitions
- Animations scroll-reveal + `prefers-reduced-motion`
- Audit Lighthouse final
- Audit axe-core final
- Deploy production sur aymeric.dijoux.dev

Chaque phase est livrée commitée et déployable indépendamment.

---

## 10. Open decisions

- **Analytics** : Plausible vs Umami vs none — à trancher avant phase 04.
- **Tarifs Collaborer** : afficher des fourchettes réelles ou masquer les chiffres (« sur demande ») — à trancher pour la rédaction.
- **Shiki theme** : `github-light` + `github-dark` retenus par défaut. Alternative : `vitesse-light` / `vitesse-dark` si recherche d'un rendu plus singulier.
- **Hover effect des AppCell** : option `background: accent` (très brutaliste) ou `border thickening` (plus subtil) — à voir à l'implémentation.

---

## 11. References
- Inspiration positionnement freelance : laforet.dev
- Mood visuel : D1 Swiss brutalist (mockups dans `.superpowers/brainstorm/`)
- Astro 5 i18n docs : https://docs.astro.build/en/guides/internationalization/
- Tailwind 4 @theme docs : https://tailwindcss.com/docs/v4-beta#theme
- Astro Content Collections : https://docs.astro.build/en/guides/content-collections/
