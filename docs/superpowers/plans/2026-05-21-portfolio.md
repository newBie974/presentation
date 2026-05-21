# Portfolio aymeric.dijoux.dev — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Faire évoluer le site link-in-bio actuel en un portfolio multi-pages bilingue (FR par défaut / EN sous /en/), avec un mood Swiss brutalist (D1), conforme aux exigences GEO/SEO/a11y/perf du spec.

**Architecture:** Astro 5 statique, Tailwind 4 (@theme + CSS vars), Content Collections + MDX pour les notes, JSON-LD entity graph pour la GEO, fonts auto-hostées, deploy GitHub Pages sur `aymeric.dijoux.dev`. Pas de framework JS additionnel.

**Tech Stack:** Astro 5 · Tailwind 4 · TypeScript strict · MDX · Shiki · Satori · @fontsource (Inter Tight + JetBrains Mono) · @astrojs/sitemap + rss · @axe-core/playwright · Lighthouse CI

**Spec source:** `docs/superpowers/specs/2026-05-21-portfolio-design.md`
**Engineering contract:** `CLAUDE.md`

---

## Phases (overview)

1. **Phase 01 — Foundations** (tokens, i18n, layouts, content schema, deps) — ~15 tasks
2. **Phase 02 — Home + Apps + Social** (refacto des composants + nouvelles pages home FR/EN) — ~18 tasks
3. **Phase 03 — À propos + Notes** (about FR/EN + content collections + articles MDX + prose components + RSS) — ~22 tasks
4. **Phase 04 — Collaborer + GEO + ship** (page collaborer + JSON-LD complet + llms.txt + robots.txt + CI + deploy) — ~18 tasks

Total : ~73 tasks. Chaque phase finit par un **review checkpoint** : tu valides la phase complète avant la suivante.

---

## File structure (cible finale)

```
aymeric.dijoux.dev/
├─ .github/workflows/deploy.yml      # CI: build + lighthouse + axe + jsonld-validate
├─ CLAUDE.md                          # existant — engineering contract
├─ astro.config.mjs                   # MODIFIED — site URL, i18n, integrations
├─ tsconfig.json                      # MODIFIED — alias @/ → src/
├─ package.json                       # MODIFIED — new deps
├─ public/
│  ├─ CNAME                           # CREATE — aymeric.dijoux.dev
│  └─ ... existants
├─ scripts/
│  └─ validate-jsonld.mjs             # CREATE — CI script
└─ src/
   ├─ assets/                         # existant + portrait B&W à ajouter
   ├─ components/
   │  ├─ atoms/
   │  │  ├─ Avatar.astro              # MODIFIED — D1
   │  │  ├─ Highlight.astro           # CREATE — fluo highlighter span
   │  │  ├─ Icon.astro                # CREATE — wrapper astro-icon
   │  │  ├─ JsonLd.astro              # CREATE — JSON-LD injector
   │  │  ├─ SectionLabel.astro        # CREATE — pill mono noir/fluo
   │  │  ├─ StatusBadge.astro         # MODIFIED — D1
   │  │  └─ ThemeToggle.astro         # MODIFIED — D1
   │  ├─ molecules/
   │  │  ├─ AppCell.astro             # CREATE
   │  │  ├─ Chapter.astro             # CREATE
   │  │  ├─ FAQItem.astro             # CREATE — accordion
   │  │  ├─ LangToggle.astro          # CREATE
   │  │  ├─ NoteRow.astro             # CREATE
   │  │  ├─ ProcessStep.astro         # CREATE
   │  │  ├─ ServiceCard.astro         # CREATE
   │  │  ├─ SocialLink.astro          # MODIFIED — pill D1
   │  │  └─ StackGroup.astro          # CREATE
   │  ├─ organisms/
   │  │  ├─ AboutExcerpt.astro        # CREATE
   │  │  ├─ AppsGrid.astro            # CREATE (remplace ProductList)
   │  │  ├─ CollabBand.astro          # CREATE
   │  │  ├─ Footer.astro              # CREATE
   │  │  ├─ Hero.astro                # CREATE (remplace HeroSection)
   │  │  ├─ Nav.astro                 # CREATE
   │  │  ├─ NotesSection.astro        # CREATE
   │  │  ├─ SeoHead.astro             # CREATE
   │  │  └─ SocialBar.astro           # MODIFIED — D1
   │  └─ prose/
   │     ├─ Callout.astro             # CREATE
   │     ├─ CodeTabs.astro            # CREATE
   │     ├─ FileBlock.astro           # CREATE
   │     └─ Stackblitz.astro          # CREATE
   ├─ content/
   │  ├─ config.ts                    # CREATE — Zod schema notes
   │  └─ notes/
   │     ├─ fr/                       # CREATE — articles FR
   │     └─ en/                       # CREATE — articles EN
   ├─ data/
   │  ├─ chapters.ts                  # CREATE — parcours about
   │  ├─ faq.ts                       # CREATE
   │  ├─ profile.ts                   # MODIFIED
   │  ├─ projects.ts                  # MODIFIED — Project schema enrichi
   │  ├─ services.ts                  # CREATE
   │  ├─ socialLinks.ts               # existant, OK
   │  └─ stack.ts                     # CREATE
   ├─ i18n/
   │  ├─ ui.ts                        # CREATE — strings UI bilingues
   │  └─ utils.ts                     # CREATE — getLocale, localizePath, useTranslations
   ├─ layouts/
   │  ├─ MainLayout.astro             # MODIFIED — refacto pour D1 + i18n
   │  └─ NoteLayout.astro             # CREATE — page article
   ├─ lib/
   │  ├─ constants.ts                 # CREATE
   │  ├─ dates.ts                     # CREATE
   │  ├─ geo.ts                       # CREATE — builders llms.txt etc.
   │  ├─ jsonLd.ts                    # CREATE — schema.org builders
   │  ├─ notes.ts                     # CREATE — load/filter/sort notes
   │  ├─ ogImage.ts                   # CREATE — Satori
   │  └─ readingTime.ts               # CREATE
   ├─ pages/
   │  ├─ index.astro                  # MODIFIED — home FR
   │  ├─ a-propos.astro               # CREATE
   │  ├─ collaborer.astro             # CREATE
   │  ├─ notes/
   │  │  ├─ index.astro               # CREATE
   │  │  ├─ [slug].astro              # CREATE
   │  │  ├─ tags/[tag].astro          # CREATE
   │  │  └─ og/[slug].png.ts          # CREATE
   │  ├─ og/
   │  │  ├─ default.png.ts            # CREATE
   │  │  └─ home.png.ts               # CREATE
   │  ├─ ai.txt.ts                    # CREATE
   │  ├─ llms.txt.ts                  # CREATE
   │  ├─ llms-full.txt.ts             # CREATE
   │  ├─ robots.txt.ts                # CREATE
   │  ├─ rss.xml.ts                   # CREATE
   │  └─ en/
   │     ├─ index.astro               # CREATE
   │     ├─ about.astro               # CREATE
   │     ├─ work.astro                # CREATE
   │     ├─ writing/
   │     │  ├─ index.astro            # CREATE
   │     │  ├─ [slug].astro           # CREATE
   │     │  └─ tags/[tag].astro       # CREATE
   │     └─ rss.xml.ts                # CREATE
   ├─ styles/
   │  ├─ global.css                   # MODIFIED — reset + base
   │  ├─ prose.css                    # CREATE — MDX typography
   │  └─ theme.css                    # CREATE — @theme D1 tokens
   └─ types/
      └─ index.ts                     # MODIFIED — enrichi
```

---

## Phase 01 — Foundations

**Objectif** : poser tous les fondamentaux (deps, tokens D1, i18n, layouts, content schema) sans encore livrer la moindre nouvelle page visible. À la fin de cette phase, `npm run build` passe et le site existant continue de marcher (ou affiche une home minimale en mood D1).

---

### Task 1.1 — Install new dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1 — Install runtime deps**

```bash
npm install @astrojs/mdx @astrojs/sitemap @astrojs/rss astro-icon \
  @iconify-json/lucide @iconify-json/simple-icons \
  @fontsource-variable/inter-tight @fontsource-variable/jetbrains-mono \
  satori satori-html @resvg/resvg-js reading-time \
  rehype-external-links remark-gfm
```

- [ ] **Step 2 — Install dev deps**

```bash
npm install -D @lhci/cli @axe-core/playwright @playwright/test
npx playwright install chromium
```

- [ ] **Step 3 — Verify install**

```bash
npm run astro check
```

Expected: 0 errors, 0 warnings (existing code unchanged).

- [ ] **Step 4 — Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add mdx, sitemap, rss, fonts, icons, satori, lhci, axe"
```

---

### Task 1.2 — Configure TypeScript path alias `@/`

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1 — Update tsconfig**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 2 — Verify**

```bash
npm run astro check
```

Expected: 0 errors.

- [ ] **Step 3 — Commit**

```bash
git add tsconfig.json
git commit -m "chore(ts): add @/ path alias to src/"
```

---

### Task 1.3 — Replace `global.css` and create `theme.css` (D1 tokens)

**Files:**
- Replace: `src/styles/global.css`
- Create: `src/styles/theme.css`

- [ ] **Step 1 — Create `src/styles/theme.css` with D1 tokens**

```css
/* D1 Swiss Brutalist — design tokens via Tailwind 4 @theme */

@theme {
  /* Colors */
  --color-bg: #f6f6f4;
  --color-bg-soft: #ffffff;
  --color-border: #0a0a0a;
  --color-text: #0a0a0a;
  --color-text-muted: #404040;
  --color-accent: #ccff00;
  --color-success: #65a30d;
  --color-danger: #dc2626;

  /* Typography */
  --font-sans: "Inter Tight Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;

  /* Geometry */
  --radius-base: 0;
  --border-w: 2px;

  /* Containers */
  --container-prose: 65ch;
  --container-content: 900px;
  --container-narrow: 720px;
}

/* Dark mode override */
[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-bg-soft: #171717;
  --color-border: #f6f6f4;
  --color-text: #f6f6f4;
  --color-text-muted: #a3a3a3;
  --color-accent: #ccff00;
  --color-success: #84cc16;
  --color-danger: #ef4444;
}
```

- [ ] **Step 2 — Replace `src/styles/global.css`**

```css
@import "tailwindcss";
@import "./theme.css";
@import "@fontsource-variable/inter-tight";
@import "@fontsource-variable/jetbrains-mono";

/* Reset & base */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 8px 16px;
  background: var(--color-text);
  color: var(--color-bg);
  font-weight: 600;
  text-decoration: none;
  border: var(--border-w) solid var(--color-text);
}
.skip-link:focus { top: 0; }

/* Focus rings — D1 style */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3 — Verify build**

```bash
npm run build
```

Expected: build succeeds (existing pages may look broken visually — c'est normal, refacto en phase 2).

- [ ] **Step 4 — Commit**

```bash
git add src/styles/global.css src/styles/theme.css
git commit -m "feat(styles): replace tokens with D1 swiss-brutalist + fonts auto-hosted"
```

---

### Task 1.4 — Update `astro.config.mjs` with i18n, integrations, site

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1 — Replace config**

```js
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  output: "static",
  site: "https://aymeric.dijoux.dev",
  base: "/",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
      ],
    }),
    sitemap({
      i18n: {
        defaultLocale: "fr",
        locales: { fr: "fr-FR", en: "en-US" },
      },
    }),
    icon({ include: { lucide: ["*"], "simple-icons": ["*"] } }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 2 — Verify**

```bash
npm run astro sync && npm run astro check
```

Expected: 0 errors.

- [ ] **Step 3 — Commit**

```bash
git add astro.config.mjs
git commit -m "feat(config): set site URL, fr-default i18n, mdx/sitemap/icon integrations"
```

---

### Task 1.5 — Create `public/CNAME` for custom domain

**Files:**
- Create: `public/CNAME`

- [ ] **Step 1 — Create CNAME**

```
aymeric.dijoux.dev
```

- [ ] **Step 2 — Commit**

```bash
git add public/CNAME
git commit -m "chore(deploy): pin custom domain via CNAME"
```

---

### Task 1.6 — Create i18n utilities

**Files:**
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/utils.ts`

- [ ] **Step 1 — Create `src/i18n/ui.ts`**

```ts
export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const ui = {
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.notes": "Notes",
    "nav.work": "Collaborer",
    "cta.viewApps": "Voir mes apps",
    "cta.collaborate": "Collaborer",
    "cta.bookCall": "Réserver un call",
    "cta.readArticle": "Lire l'article",
    "cta.readMore": "Lire l'histoire complète",
    "section.builds": "Ce que je construis",
    "section.latestNotes": "Dernières notes",
    "section.allNotes": "Toutes les notes",
    "section.about": "À propos",
    "social.follow": "Suivre",
    "status.live": "Live",
    "status.building": "En cours",
    "status.dispoLabel": "Dispo S2 2026 · 1 slot",
    "footer.copy": "© 2026 Aymeric Dijoux · Paris",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.notes": "Writing",
    "nav.work": "Work together",
    "cta.viewApps": "See my apps",
    "cta.collaborate": "Work together",
    "cta.bookCall": "Book a call",
    "cta.readArticle": "Read the article",
    "cta.readMore": "Read the full story",
    "section.builds": "What I'm building",
    "section.latestNotes": "Latest writing",
    "section.allNotes": "All writing",
    "section.about": "About",
    "social.follow": "Follow",
    "status.live": "Live",
    "status.building": "Building",
    "status.dispoLabel": "Available H2 2026 · 1 slot",
    "footer.copy": "© 2026 Aymeric Dijoux · Paris",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof typeof ui["fr"];

export const routes = {
  fr: { home: "/", about: "/a-propos", notes: "/notes", work: "/collaborer" },
  en: { home: "/en/", about: "/en/about", notes: "/en/writing", work: "/en/work" },
} as const;
```

- [ ] **Step 2 — Create `src/i18n/utils.ts`**

```ts
import { ui, routes, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./ui";
import type { Locale, UiKey } from "./ui";

export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split("/");
  if ((SUPPORTED_LOCALES as readonly string[]).includes(first)) return first as Locale;
  return DEFAULT_LOCALE;
}

export function useTranslations(locale: Locale) {
  function t(key: UiKey): string {
    return ui[locale][key] ?? ui[DEFAULT_LOCALE][key];
  }
  t.path = (route: keyof typeof routes["fr"]) => routes[locale][route];
  return t;
}

export function localizePath(route: keyof typeof routes["fr"], locale: Locale): string {
  return routes[locale][route];
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}

export function alternateUrl(route: keyof typeof routes["fr"], locale: Locale): string {
  return routes[alternateLocale(locale)][route];
}

export { ui, routes };
export type { Locale, UiKey };
```

- [ ] **Step 3 — Verify**

```bash
npm run astro check
```

Expected: 0 errors.

- [ ] **Step 4 — Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add ui strings, routes, useTranslations, localizePath utils"
```

---

### Task 1.7 — Create base `lib/constants.ts` and `lib/dates.ts`

**Files:**
- Create: `src/lib/constants.ts`
- Create: `src/lib/dates.ts`

- [ ] **Step 1 — Create `src/lib/constants.ts`**

```ts
export const SITE_URL = "https://aymeric.dijoux.dev";
export const SITE_NAME = "Aymeric Dijoux";
export const NOTES_ON_HOME = 3;
export const NOTES_PER_PAGE = 20;
export const LONG_ARTICLE_WORD_THRESHOLD = 800;
export const SCROLL_REVEAL_DELAY_MS = 250;
export const READING_WORDS_PER_MIN = 200;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
```

- [ ] **Step 2 — Create `src/lib/dates.ts`**

```ts
import type { Locale } from "@/i18n/utils";

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}
```

- [ ] **Step 3 — Commit**

```bash
git add src/lib/
git commit -m "feat(lib): add constants and date utils"
```

---

### Task 1.8 — Create `lib/readingTime.ts`

**Files:**
- Create: `src/lib/readingTime.ts`

- [ ] **Step 1 — Create the util**

```ts
import readingTime from "reading-time";
import { READING_WORDS_PER_MIN } from "./constants";

export function computeReadingTime(body: string): { minutes: number; words: number } {
  const result = readingTime(body, { wordsPerMinute: READING_WORDS_PER_MIN });
  return { minutes: Math.max(1, Math.ceil(result.minutes)), words: result.words };
}
```

- [ ] **Step 2 — Commit**

```bash
git add src/lib/readingTime.ts
git commit -m "feat(lib): add readingTime util"
```

---

### Task 1.9 — Create content collection schema

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/notes/fr/.gitkeep`
- Create: `src/content/notes/en/.gitkeep`

- [ ] **Step 1 — Create `src/content/config.ts`**

```ts
import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(3),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    locale: z.enum(["fr", "en"]),
    translationKey: z.string(),
    excerpt: z.string().min(20),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { notes };
```

- [ ] **Step 2 — Add placeholder folders**

```bash
mkdir -p src/content/notes/fr src/content/notes/en
touch src/content/notes/fr/.gitkeep src/content/notes/en/.gitkeep
```

- [ ] **Step 3 — Verify**

```bash
npm run astro sync && npm run astro check
```

Expected: 0 errors, collection types generated under `.astro/`.

- [ ] **Step 4 — Commit**

```bash
git add src/content/
git commit -m "feat(content): add notes collection schema with translationKey"
```

---

### Task 1.10 — Enrich `types/index.ts`

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1 — Replace content**

```ts
import type { ImageMetadata } from "astro";

export type Locale = "fr" | "en";

export interface Profile {
  name: string;
  givenName: string;
  familyName: string;
  tagline: { fr: string; en: string };
  bio: { fr: string; en: string };
  location: string;
  email?: string;
}

export type AppStatus = "live" | "building" | "coming-soon";

export interface Project {
  slug: string;
  title: string;
  tagline: { fr: string; en: string };
  url: string;
  status: AppStatus;
  techStack: string[];
  platform: ("ios" | "android" | "web")[];
  appStoreUrl?: string;
  playStoreUrl?: string;
  logo?: ImageMetadata;
}

export interface SocialLink {
  platform: "instagram" | "tiktok" | "linkedin" | "x" | "github";
  url: string;
  label: string;
}

export interface Chapter {
  yearsLabel: string;
  startYear: number;
  endYear: number | "now";
  title: { fr: string; en: string };
  role: { fr: string; en: string };
  body: { fr: string; en: string };
}

export interface StackEntry {
  category: { fr: string; en: string };
  items: string[];
}

export interface Service {
  id: string;
  icon: string; // lucide icon name
  title: { fr: string; en: string };
  description: { fr: string; en: string };
}

export interface FaqEntry {
  q: { fr: string; en: string };
  a: { fr: string; en: string };
}
```

- [ ] **Step 2 — Verify**

```bash
npm run astro check
```

Expected: existing data files that use `Project` may show errors — that's expected, they'll be updated in next tasks.

- [ ] **Step 3 — Commit**

```bash
git add src/types/index.ts
git commit -m "refactor(types): enrich schema for bilingual profile, projects, chapters, services"
```

---

### Task 1.11 — Update existing `data/` files to match new types

**Files:**
- Modify: `src/data/profile.ts`
- Modify: `src/data/projects.ts`

- [ ] **Step 1 — Update `src/data/profile.ts`**

```ts
import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Aymeric Dijoux",
  givenName: "Aymeric",
  familyName: "Dijoux",
  tagline: {
    fr: "Je construis les apps que j'utilise.",
    en: "I build the apps I wish existed.",
  },
  bio: {
    fr: "Indie builder basé à Paris. Trois apps en prod, et un calendrier ouvert pour les bons projets.",
    en: "Indie builder based in Paris. Three apps shipped, and a calendar open for the right projects.",
  },
  location: "Paris, France",
  email: "aymeric@dijoux.dev",
};
```

- [ ] **Step 2 — Update `src/data/projects.ts`**

```ts
import type { Project } from "@/types";
import tooktaLogo from "@/assets/tookta.png";
import carouboltLogo from "@/assets/caroubolt-logo.png";
import voicejournalLogo from "@/assets/voicejournal-logo.png";

export const projects: Project[] = [
  {
    slug: "voicejournal",
    title: "VoiceJournal",
    tagline: {
      fr: "Transforme ta voix en journal quotidien, propulsé par l'IA.",
      en: "Turn your voice into a daily journal, powered by AI.",
    },
    url: "https://aivoicejournal.app",
    status: "live",
    techStack: ["React Native", "Expo", "TypeScript", "Supabase", "RevenueCat", "Claude AI"],
    platform: ["ios"],
    appStoreUrl: "https://apps.apple.com/fr/app/voicejournal-journal-vocal-ia/id6762176421",
    logo: voicejournalLogo,
  },
  {
    slug: "caroubolt",
    title: "Caroubolt",
    tagline: {
      fr: "L'IA t'aide à créer les meilleurs carrousels pour TikTok et Instagram.",
      en: "AI helps you create the best carousels for TikTok and Instagram.",
    },
    url: "https://caroubolt.com",
    status: "live",
    techStack: ["Next.js", "TypeScript", "Supabase", "Stripe", "Gemini AI"],
    platform: ["web"],
    logo: carouboltLogo,
  },
  {
    slug: "tookta",
    title: "Tookta",
    tagline: {
      fr: "Trouve l'activité parfaite pour tes enfants, sans effort.",
      en: "Find the perfect activity for your kids, effortlessly.",
    },
    url: "https://tookta.fr",
    status: "live",
    techStack: ["Flutter", "Nest", "TypeScript", "Typesense"],
    platform: ["ios", "android"],
    appStoreUrl: "https://apps.apple.com/fr/app/tookta/id6474099484",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.tookta.fr",
    logo: tooktaLogo,
  },
];
```

- [ ] **Step 3 — Verify**

```bash
npm run astro check
```

Expected: pages/index.astro will error because it uses `profile.tagline` as string — that's expected and fixed in phase 2.

- [ ] **Step 4 — Commit**

```bash
git add src/data/profile.ts src/data/projects.ts
git commit -m "refactor(data): make profile and projects bilingual with new schema"
```

---

### Task 1.12 — Create `data/chapters.ts`, `stack.ts`, `services.ts`, `faq.ts`

**Files:**
- Create: `src/data/chapters.ts`
- Create: `src/data/stack.ts`
- Create: `src/data/services.ts`
- Create: `src/data/faq.ts`

- [ ] **Step 1 — Create `src/data/chapters.ts`** (placeholder content — Aymeric ajustera plus tard)

```ts
import type { Chapter } from "@/types";

export const chapters: Chapter[] = [
  {
    yearsLabel: "2024 — now",
    startYear: 2024,
    endYear: "now",
    title: { fr: "Indie builder", en: "Indie builder" },
    role: { fr: "Mes propres apps · Freelance sélectif", en: "My own apps · Selective freelance" },
    body: {
      fr: "VoiceJournal, Caroubolt, Tookta. Je code, je designe, je lance, je supporte. Je prête main forte à quelques équipes.",
      en: "VoiceJournal, Caroubolt, Tookta. I code, design, ship, support. I help a few teams along the way.",
    },
  },
  // TODO Aymeric: ajouter 3 chapitres supplémentaires depuis LinkedIn
];
```

- [ ] **Step 2 — Create `src/data/stack.ts`**

```ts
import type { StackEntry } from "@/types";

export const stack: StackEntry[] = [
  { category: { fr: "Mobile", en: "Mobile" }, items: ["React Native", "Expo", "Flutter"] },
  { category: { fr: "Web", en: "Web" }, items: ["Next.js", "Astro", "Tailwind"] },
  { category: { fr: "Backend", en: "Backend" }, items: ["Supabase", "Nest", "Postgres"] },
  { category: { fr: "IA", en: "AI" }, items: ["Claude", "Gemini", "OpenAI"] },
  { category: { fr: "Paiement", en: "Payments" }, items: ["RevenueCat", "Stripe"] },
  { category: { fr: "Outils", en: "Tools" }, items: ["Cursor", "Linear", "Figma", "Notion"] },
];
```

- [ ] **Step 3 — Create `src/data/services.ts`**

```ts
import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "mvp",
    icon: "lucide:rocket",
    title: { fr: "MVP en 6-8 semaines", en: "MVP in 6-8 weeks" },
    description: {
      fr: "Du Figma à l'App Store. Mobile (RN/Flutter) ou web (Next/Astro).",
      en: "From Figma to the App Store. Mobile (RN/Flutter) or web (Next/Astro).",
    },
  },
  {
    id: "ai-proto",
    icon: "lucide:zap",
    title: { fr: "Prototype IA en 2 semaines", en: "AI prototype in 2 weeks" },
    description: {
      fr: "Tu as une idée d'app IA. Je te livre un proto fonctionnel pour décider.",
      en: "You have an AI app idea. I ship a working proto so you can decide.",
    },
  },
  {
    id: "rescue",
    icon: "lucide:wrench",
    title: { fr: "Renfort tech ponctuel", en: "Tech rescue mission" },
    description: {
      fr: "Ton équipe est bloquée. Je rentre, je débloque, je sors.",
      en: "Your team is stuck. I come in, unblock, leave.",
    },
  },
  {
    id: "consulting",
    icon: "lucide:message-circle",
    title: { fr: "Consulting / Pair design", en: "Consulting / Pair design" },
    description: {
      fr: "Sessions de 90 min : architecture, stack, choix produit.",
      en: "90-min sessions: architecture, stack, product decisions.",
    },
  },
];
```

- [ ] **Step 4 — Create `src/data/faq.ts`**

```ts
import type { FaqEntry } from "@/types";

export const faq: FaqEntry[] = [
  {
    q: { fr: "Tu bosses en remote ou sur place ?", en: "Do you work remote or on-site?" },
    a: {
      fr: "Les deux. 100% remote par défaut, déplacement Paris possible pour kick-off ou jalons.",
      en: "Both. 100% remote by default, on-site in Paris possible for kick-off or milestones.",
    },
  },
  {
    q: { fr: "Tu peux signer un NDA ?", en: "Can you sign an NDA?" },
    a: { fr: "Oui, sans souci. Modèle standard sur demande.", en: "Yes, no problem. Standard template on request." },
  },
  {
    q: { fr: "Tu factures comment ?", en: "How do you bill?" },
    a: {
      fr: "Auto-entrepreneur français. TVA selon statut client. Mensuel ou par jalon.",
      en: "French sole proprietor. VAT depending on client status. Monthly or milestone-based.",
    },
  },
  {
    q: { fr: "Tu bosses sur ma stack ou la tienne ?", en: "Do you work on my stack or yours?" },
    a: {
      fr: "Ta stack si elle tient debout. Sinon je propose et on en parle.",
      en: "Your stack if it holds up. Otherwise I propose and we discuss.",
    },
  },
];
```

- [ ] **Step 5 — Verify**

```bash
npm run astro check
```

Expected: 0 errors (only `pages/index.astro` may complain, ignored for now).

- [ ] **Step 6 — Commit**

```bash
git add src/data/
git commit -m "feat(data): add chapters, stack, services, faq with bilingual content"
```

---

### Task 1.13 — Refactor `MainLayout.astro` for D1 + i18n + SEO head

**Files:**
- Replace: `src/layouts/MainLayout.astro`

- [ ] **Step 1 — Replace with new layout**

```astro
---
import "@/styles/global.css";
import { ClientRouter } from "astro:transitions";
import { getLocaleFromUrl, alternateLocale, useTranslations } from "@/i18n/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Locale } from "@/types";

interface Props {
  title: string;
  description: string;
  locale?: Locale;
  ogImage?: string;
  pageType?: "website" | "article";
}

const url = Astro.url;
const locale: Locale = Astro.props.locale ?? getLocaleFromUrl(url);
const t = useTranslations(locale);
const { title, description, ogImage = "/og/default.png", pageType = "website" } = Astro.props;

const canonical = url.href;
const altLocale = alternateLocale(locale);
const altPath = url.pathname; // simple mirror; refined per-page in SeoHead if needed
---

<!doctype html>
<html lang={locale === "fr" ? "fr-FR" : "en-US"} data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />

    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta name="robots" content="index, follow, max-image-preview:large" />

    <link rel="alternate" hreflang={locale === "fr" ? "fr" : "en"} href={canonical} />
    <link rel="alternate" hreflang={altLocale === "fr" ? "fr" : "en"} href={new URL(altPath, SITE_URL).href} />
    <link rel="alternate" hreflang="x-default" href={SITE_URL + "/"} />

    <meta property="og:type" content={pageType} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:image" content={new URL(ogImage, SITE_URL).href} />
    <meta property="og:locale" content={locale === "fr" ? "fr_FR" : "en_US"} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL(ogImage, SITE_URL).href} />

    <script is:inline>
      (function () {
        try {
          const saved = localStorage.getItem("theme");
          if (saved === "dark" || saved === "light") {
            document.documentElement.dataset.theme = saved;
          } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.dataset.theme = "dark";
          }
        } catch (_) {}
      })();
    </script>

    <slot name="head" />
    <ClientRouter />
  </head>

  <body class="min-h-screen bg-bg text-text font-sans antialiased">
    <a href="#main" class="skip-link">{locale === "fr" ? "Aller au contenu" : "Skip to content"}</a>
    <slot name="nav" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 2 — Verify build**

```bash
npm run astro check
```

Expected: `index.astro` will still have errors (uses old organisms) — fix in phase 2. Layout itself: 0 errors.

- [ ] **Step 3 — Commit**

```bash
git add src/layouts/MainLayout.astro
git commit -m "refactor(layout): MainLayout for D1 + i18n + hreflang + view transitions"
```

---

### Task 1.14 — Update Astro home stub so build passes again

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1 — Temporary minimal home (will be replaced in phase 2)**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import { profile } from "@/data/profile";

const locale = "fr" as const;
const title = `${profile.name} — ${profile.tagline.fr}`;
const description = profile.bio.fr;
---

<MainLayout title={title} description={description} locale={locale}>
  <section class="mx-auto max-w-[var(--container-content)] px-12 py-16">
    <h1 class="text-5xl font-bold tracking-tight">{profile.name}</h1>
    <p class="mt-4 text-text-muted">{profile.bio.fr}</p>
  </section>
</MainLayout>
```

- [ ] **Step 2 — Verify build & dev**

```bash
npm run build && npm run dev &
sleep 4 && curl -s http://localhost:4321/ | head -20
kill %1
```

Expected: build succeeds, home renders D1 background + Inter Tight font, no broken HTML.

- [ ] **Step 3 — Commit**

```bash
git add src/pages/index.astro
git commit -m "chore(home): temporary minimal home — full hero implemented in phase 2"
```

---

### Task 1.15 — Add `.env.example` and Cal.com placeholder

**Files:**
- Create: `.env.example`

- [ ] **Step 1 — Create `.env.example`**

```bash
# Public — exposed to client
PUBLIC_CALCOM_URL=https://cal.com/aymeric-dijoux/intro
PUBLIC_PLAUSIBLE_DOMAIN=aymeric.dijoux.dev

# Add a real .env (gitignored) locally with the same keys.
```

- [ ] **Step 2 — Commit**

```bash
git add .env.example
git commit -m "chore: add .env.example documenting public env vars"
```

---

## 🛑 Phase 01 — Review checkpoint

Before continuing to Phase 02:
- [ ] `npm run astro check` → 0 errors, 0 warnings
- [ ] `npm run build` → succeeds
- [ ] `npm run dev` → home loads on D1 background (cream + black text, Inter Tight font visible)
- [ ] Manual visual sanity check : pas de FOUC, fonts chargées, dark mode togglable via console (`document.documentElement.dataset.theme = "dark"`)
- [ ] Tous les commits Phase 01 sont sur `main` (ou la feature branch)
- [ ] Pas de fichier > 150 lignes, pas de any TypeScript

Si tout est vert → **STOP, validate avec Aymeric avant Phase 02.**

---

## Phase 02 — Home + Apps + Social

**Objectif** : refacto complète des composants existants en D1 + nouveaux composants pour Hero, AppsGrid, Footer, Nav. À la fin de cette phase, la home FR ET EN sont publiées avec leur contenu réel.

---

### Task 2.1 — Create `Icon.astro` atom (wrapper astro-icon)

**Files:**
- Create: `src/components/atoms/Icon.astro`

- [ ] **Step 1 — Create the atom**

```astro
---
import { Icon as AstroIcon } from "astro-icon/components";

interface Props {
  name: string;
  size?: number;
  class?: string;
  ariaLabel?: string;
}

const { name, size = 18, class: className, ariaLabel } = Astro.props;
---

<AstroIcon
  name={name}
  width={size}
  height={size}
  class:list={["inline-block shrink-0", className]}
  aria-label={ariaLabel}
  aria-hidden={ariaLabel ? "false" : "true"}
/>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/atoms/Icon.astro
git commit -m "feat(atom): add Icon wrapper around astro-icon"
```

---

### Task 2.2 — Create `Highlight.astro` atom (fluo highlighter)

**Files:**
- Create: `src/components/atoms/Highlight.astro`

- [ ] **Step 1 — Create the atom**

```astro
---
interface Props {
  as?: "span" | "em";
}

const { as: Tag = "span" } = Astro.props;
---

<Tag class="highlight">
  <slot />
</Tag>

<style>
  .highlight {
    background: var(--color-accent);
    color: var(--color-text);
    padding: 0 0.2em;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
  /* In dark mode, accent remains fluo — keep text black for contrast */
  :global([data-theme="dark"]) .highlight {
    color: #0a0a0a;
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/atoms/Highlight.astro
git commit -m "feat(atom): add Highlight for fluo accent on text"
```

---

### Task 2.3 — Create `SectionLabel.astro` atom

**Files:**
- Create: `src/components/atoms/SectionLabel.astro`

- [ ] **Step 1 — Create the atom**

```astro
---
interface Props {
  number?: string; // "01", "02"...
}
const { number } = Astro.props;
---

<div class="section-label">
  {number && <span class="num">{number}</span>}
  <slot />
</div>

<style>
  .section-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 4px 8px;
    background: var(--color-text);
    color: var(--color-accent);
  }
  .num {
    opacity: 0.6;
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/atoms/SectionLabel.astro
git commit -m "feat(atom): add SectionLabel pill (mono on black with fluo text)"
```

---

### Task 2.4 — Refactor `StatusBadge.astro` for D1

**Files:**
- Modify: `src/components/atoms/StatusBadge.astro`

- [ ] **Step 1 — Replace content**

```astro
---
interface Props {
  label: string;
  tone?: "success" | "muted";
}
const { label, tone = "success" } = Astro.props;
---

<span class:list={["status-badge", `tone-${tone}`]}>
  <span class="dot" aria-hidden="true"></span>
  {label}
</span>

<style>
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    color: var(--color-text-muted);
  }
  .dot {
    width: 6px;
    height: 6px;
    background: var(--color-success);
    display: inline-block;
  }
  .tone-muted .dot {
    background: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/atoms/StatusBadge.astro
git commit -m "refactor(atom): StatusBadge in D1 mono style"
```

---

### Task 2.5 — Refactor `ThemeToggle.astro` (set `data-theme` on html)

**Files:**
- Modify: `src/components/atoms/ThemeToggle.astro`

- [ ] **Step 1 — Replace content**

```astro
---
import Icon from "./Icon.astro";
---

<button
  id="theme-toggle"
  class="theme-toggle"
  aria-label="Toggle theme"
  type="button"
>
  <Icon name="lucide:sun" size={16} class="icon-sun" />
  <Icon name="lucide:moon" size={16} class="icon-moon" />
</button>

<script>
  const btn = document.getElementById("theme-toggle");
  function applyTheme(theme: "light" | "dark") {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch (_) {}
  }
  btn?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
</script>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: var(--border-w) solid var(--color-border);
    background: var(--color-bg-soft);
    color: var(--color-text);
    cursor: pointer;
  }
  .theme-toggle:hover {
    background: var(--color-accent);
  }
  .icon-moon { display: none; }
  :global([data-theme="dark"]) .icon-sun { display: none; }
  :global([data-theme="dark"]) .icon-moon { display: inline-block; }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/atoms/ThemeToggle.astro
git commit -m "refactor(atom): ThemeToggle uses data-theme + lucide icons"
```

---

### Task 2.6 — Refactor `Avatar.astro` (use astro:assets Image)

**Files:**
- Modify: `src/components/atoms/Avatar.astro`

- [ ] **Step 1 — Replace content**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  src: ImageMetadata;
  alt: string;
  size?: number;
  priority?: boolean;
}

const { src, alt, size = 200, priority = false } = Astro.props;
---

<div class="avatar" style={`--avatar-size:${size}px`}>
  <Image
    src={src}
    alt={alt}
    width={size * 2}
    height={size * 2}
    loading={priority ? "eager" : "lazy"}
    decoding={priority ? "sync" : "async"}
  />
</div>

<style>
  .avatar {
    width: var(--avatar-size);
    height: var(--avatar-size);
    border: var(--border-w) solid var(--color-border);
    overflow: hidden;
    background: var(--color-text);
  }
  .avatar :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/atoms/Avatar.astro
git commit -m "refactor(atom): Avatar uses astro:assets Image with priority option"
```

---

### Task 2.7 — Refactor `SocialLink.astro` to D1 pill

**Files:**
- Modify: `src/components/molecules/SocialLink.astro`

- [ ] **Step 1 — Replace content**

```astro
---
import Icon from "@/components/atoms/Icon.astro";
import type { SocialLink } from "@/types";

interface Props {
  link: SocialLink;
}
const { link } = Astro.props;

const iconMap: Record<SocialLink["platform"], string> = {
  instagram: "simple-icons:instagram",
  tiktok: "simple-icons:tiktok",
  linkedin: "simple-icons:linkedin",
  x: "simple-icons:x",
  github: "simple-icons:github",
};
---

<a href={link.url} target="_blank" rel="noopener noreferrer" class="social-pill" aria-label={link.label}>
  <Icon name={iconMap[link.platform]} size={14} />
  <span class="label">{link.platform}</span>
</a>

<style>
  .social-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1.5px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    transition: background 150ms ease-out;
  }
  .social-pill:hover {
    background: var(--color-accent);
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/SocialLink.astro
git commit -m "refactor(mol): SocialLink as D1 pill with hover fluo"
```

---

### Task 2.8 — Create `AppCell.astro` molecule

**Files:**
- Create: `src/components/molecules/AppCell.astro`

- [ ] **Step 1 — Create the molecule**

```astro
---
import { Image } from "astro:assets";
import type { Project, Locale } from "@/types";
import { useTranslations } from "@/i18n/utils";

interface Props {
  project: Project;
  locale: Locale;
}

const { project, locale } = Astro.props;
const t = useTranslations(locale);

const statusLabel = t(`status.${project.status === "live" ? "live" : "building"}` as const);
const platformLabel = project.platform.map((p) => p.toUpperCase()).join("+");
---

<a href={project.url} target="_blank" rel="noopener noreferrer" class="cell">
  <div class="logo">
    {project.logo && (
      <Image src={project.logo} alt={`${project.title} logo`} width={96} height={96} />
    )}
  </div>
  <h3 class="name">{project.title}</h3>
  <p class="desc">{project.tagline[locale]}</p>
  <ul class="tech">
    {project.techStack.slice(0, 3).map((tech) => <li>{tech}</li>)}
  </ul>
  <p class="status">
    <span class="dot" aria-hidden="true"></span>{statusLabel} · {platformLabel}
  </p>
</a>

<style>
  .cell {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background: var(--color-bg-soft);
    border-right: var(--border-w) solid var(--color-border);
    color: var(--color-text);
    text-decoration: none;
    transition: background 150ms ease-out;
  }
  .cell:last-child { border-right: none; }
  .cell:hover { background: var(--color-accent); }
  .logo {
    width: 48px;
    height: 48px;
    background: var(--color-text);
    border: var(--border-w) solid var(--color-border);
    margin-bottom: 14px;
    overflow: hidden;
  }
  .logo :global(img) { width: 100%; height: 100%; object-fit: cover; }
  .name {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
  }
  .desc {
    font-size: 12px;
    line-height: 1.5;
    color: var(--color-text-muted);
    margin: 0 0 12px;
  }
  .tech {
    list-style: none;
    margin: 0 0 12px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tech li {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--color-text-muted);
    padding: 3px 6px;
    background: var(--color-bg);
  }
  .status {
    margin: auto 0 0;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-success);
    text-transform: uppercase;
  }
  .status .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--color-success);
    margin-right: 4px;
    vertical-align: middle;
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/AppCell.astro
git commit -m "feat(mol): AppCell with logo, tagline, tech pills, status"
```

---

### Task 2.9 — Create `LangToggle.astro` molecule

**Files:**
- Create: `src/components/molecules/LangToggle.astro`

- [ ] **Step 1 — Create the molecule**

```astro
---
import type { Locale } from "@/types";
import { alternateLocale } from "@/i18n/utils";

interface Props {
  current: Locale;
  altPath: string;
}

const { current, altPath } = Astro.props;
const alt = alternateLocale(current);
---

<div class="lang-toggle" role="group" aria-label="Language">
  <span class="current">{current.toUpperCase()}</span>
  <span class="sep">·</span>
  <a href={altPath} hreflang={alt}>{alt.toUpperCase()}</a>
</div>

<style>
  .lang-toggle {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.05em;
  }
  .current { font-weight: 700; }
  .sep { color: var(--color-text-muted); margin: 0 4px; }
  a { color: var(--color-text-muted); text-decoration: none; }
  a:hover { color: var(--color-text); }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/LangToggle.astro
git commit -m "feat(mol): LangToggle with current/alt locale display"
```

---

### Task 2.10 — Create `Nav.astro` organism

**Files:**
- Create: `src/components/organisms/Nav.astro`

- [ ] **Step 1 — Create the organism**

```astro
---
import LangToggle from "@/components/molecules/LangToggle.astro";
import ThemeToggle from "@/components/atoms/ThemeToggle.astro";
import { useTranslations, alternateUrl } from "@/i18n/utils";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
  current?: "home" | "about" | "notes" | "work";
}

const { locale, current } = Astro.props;
const t = useTranslations(locale);
const links = [
  { id: "home" as const, label: t("nav.home"), href: t.path("home") },
  { id: "about" as const, label: t("nav.about"), href: t.path("about") },
  { id: "notes" as const, label: t("nav.notes"), href: t.path("notes") },
  { id: "work" as const, label: t("nav.work"), href: t.path("work") },
];

const altPath = current ? alternateUrl(current, locale) : (locale === "fr" ? "/en/" : "/");
---

<nav class="nav" aria-label="Primary">
  <a href={t.path("home")} class="brand">aymeric<span class="slash">/</span>dijoux</a>
  <ul class="menu" role="list">
    {links.map((l) => (
      <li>
        <a href={l.href} class:list={["item", current === l.id && "active"]}>{l.label}</a>
      </li>
    ))}
  </ul>
  <div class="end">
    <LangToggle current={locale} altPath={altPath} />
    <ThemeToggle />
  </div>
</nav>

<style>
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 48px;
    border-bottom: var(--border-w) solid var(--color-border);
    background: var(--color-bg);
  }
  .brand {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
    text-decoration: none;
  }
  .slash { color: var(--color-success); }
  .menu {
    display: flex;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 13px;
    font-weight: 500;
  }
  .item {
    color: var(--color-text);
    text-decoration: none;
    padding: 2px 6px;
  }
  .item.active { background: var(--color-accent); }
  .end {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  @media (max-width: 720px) {
    .nav { padding: 12px 20px; }
    .menu { gap: 14px; font-size: 12px; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/organisms/Nav.astro
git commit -m "feat(org): Nav with brand, menu, lang toggle, theme toggle"
```

---

### Task 2.11 — Create `Hero.astro` organism

**Files:**
- Create: `src/components/organisms/Hero.astro`
- Need: portrait image at `src/assets/portrait.png` (Aymeric provides; for now placeholder via avatar)

- [ ] **Step 1 — Create the organism**

```astro
---
import { Image } from "astro:assets";
import type { Locale } from "@/types";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import StatusBadge from "@/components/atoms/StatusBadge.astro";
import { useTranslations } from "@/i18n/utils";
import { profile } from "@/data/profile";
import portrait from "@/assets/avatar.png"; // TODO swap with portrait.png when provided

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = useTranslations(locale);

// Split tagline to inject Highlight on key word
const taglineFR = "Je construis les apps que ";
const taglineFRTail = ".";
const taglineFRHighlight = "j'utilise";
const taglineEN = "I build the apps I wish ";
const taglineENTail = ".";
const taglineENHighlight = "existed";

const usingFR = locale === "fr";
---

<section class="hero">
  <div class="text">
    <SectionLabel>BUILDER · 2026</SectionLabel>
    <h1>
      {usingFR ? (
        <>{taglineFR}<Highlight>{taglineFRHighlight}</Highlight>{taglineFRTail}</>
      ) : (
        <>{taglineEN}<Highlight>{taglineENHighlight}</Highlight>{taglineENTail}</>
      )}
    </h1>
    <p class="lead">{profile.bio[locale]}</p>
    <div class="ctas">
      <a href="#apps" class="btn primary">{t("cta.viewApps")} ↓</a>
      <a href={t.path("work")} class="btn ghost">{t("cta.collaborate")} →</a>
    </div>
    <StatusBadge label={t("status.dispoLabel")} />
  </div>
  <div class="portrait">
    <Image src={portrait} alt={`Portrait of ${profile.name}`} width={400} height={480} loading="eager" decoding="sync" />
  </div>
</section>

<style>
  .hero {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 48px;
    align-items: end;
    padding: 56px 48px 40px;
    border-bottom: var(--border-w) solid var(--color-border);
  }
  h1 {
    font-size: clamp(36px, 6vw, 58px);
    line-height: 0.96;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 18px 0 24px;
  }
  .lead {
    font-size: 16px;
    line-height: 1.55;
    color: var(--color-text);
    max-width: 480px;
    margin: 0 0 24px;
  }
  .ctas {
    display: flex;
    margin-bottom: 20px;
  }
  .btn {
    padding: 12px 20px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    border: var(--border-w) solid var(--color-text);
    cursor: pointer;
  }
  .primary { background: var(--color-text); color: var(--color-bg); }
  .ghost { background: var(--color-bg); color: var(--color-text); border-left: 0; }
  .ghost:hover { background: var(--color-accent); }
  .portrait { width: 200px; height: 240px; border: var(--border-w) solid var(--color-border); overflow: hidden; }
  .portrait :global(img) { width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 720px) {
    .hero { grid-template-columns: 1fr; padding: 32px 20px; }
    .portrait { width: 140px; height: 170px; order: -1; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/organisms/Hero.astro
git commit -m "feat(org): Hero with tag, h1+Highlight, lead, CTAs, portrait, status"
```

---

### Task 2.12 — Create `SocialBar.astro` organism (D1 version)

**Files:**
- Replace: `src/components/organisms/SocialBar.astro`

- [ ] **Step 1 — Replace content**

```astro
---
import SocialLink from "@/components/molecules/SocialLink.astro";
import { socialLinks } from "@/data/socialLinks";
import type { Locale } from "@/types";
import { useTranslations } from "@/i18n/utils";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = useTranslations(locale);
---

<aside class="social-bar" aria-label={t("social.follow")}>
  <span class="label">{t("social.follow").toUpperCase()} /</span>
  <ul role="list">
    {socialLinks.map((link) => <li><SocialLink link={link} /></li>)}
  </ul>
  <span class="handle">@aymeric.builder</span>
</aside>

<style>
  .social-bar {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 14px 48px;
    border-bottom: var(--border-w) solid var(--color-border);
    background: var(--color-bg-soft);
  }
  .label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
  }
  ul { display: flex; gap: 8px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; }
  .handle {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
  }
  @media (max-width: 720px) {
    .social-bar { padding: 12px 20px; flex-wrap: wrap; gap: 12px; }
    .handle { margin-left: 0; width: 100%; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/organisms/SocialBar.astro
git commit -m "refactor(org): SocialBar in D1 with pills + handle"
```

---

### Task 2.13 — Create `AppsGrid.astro` organism (remplace ProductList)

**Files:**
- Create: `src/components/organisms/AppsGrid.astro`

- [ ] **Step 1 — Create the organism**

```astro
---
import AppCell from "@/components/molecules/AppCell.astro";
import { projects } from "@/data/projects";
import type { Locale } from "@/types";
import { useTranslations } from "@/i18n/utils";
import Highlight from "@/components/atoms/Highlight.astro";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = useTranslations(locale);
const liveCount = projects.filter((p) => p.status === "live").length;
---

<section id="apps" class="apps">
  <header class="head">
    <h2>{t("section.builds").replace(/( \S+)$/, "")}{" "}<Highlight>{t("section.builds").match(/\S+$/)?.[0] ?? ""}</Highlight></h2>
    <span class="count">{liveCount.toString().padStart(2, "0")} LIVE</span>
  </header>
  <div class="grid">
    {projects.map((project) => <AppCell project={project} locale={locale} />)}
  </div>
</section>

<style>
  .apps {
    padding: 40px 48px;
    border-bottom: var(--border-w) solid var(--color-border);
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24px;
  }
  h2 {
    font-size: clamp(24px, 4vw, 32px);
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0;
    line-height: 1;
  }
  .count {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 3px 8px;
    background: var(--color-text);
    color: var(--color-accent);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: var(--border-w) solid var(--color-border);
  }
  @media (max-width: 720px) {
    .apps { padding: 24px 20px; }
    .grid { grid-template-columns: 1fr; }
    .grid :global(.cell) { border-right: none; border-bottom: var(--border-w) solid var(--color-border); }
    .grid :global(.cell:last-child) { border-bottom: none; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/organisms/AppsGrid.astro
git commit -m "feat(org): AppsGrid 3-column bordered grid with AppCell"
```

---

### Task 2.14 — Create `AboutExcerpt.astro` organism

**Files:**
- Create: `src/components/organisms/AboutExcerpt.astro`

- [ ] **Step 1 — Create**

```astro
---
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import type { Locale } from "@/types";
import { useTranslations } from "@/i18n/utils";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = useTranslations(locale);

const titleFR = "Le builder derrière les apps.";
const titleEN = "The builder behind the apps.";
const bodyFR = [
  "10 ans de dev produit entre Paris et l'océan Indien. J'ai bossé en startup, en agence, et solo.",
  "Aujourd'hui je build mes propres apps et prête main forte à quelques équipes triées sur le volet.",
];
const bodyEN = [
  "10 years of product engineering between Paris and the Indian Ocean. Startups, agencies, and solo.",
  "Today I build my own apps and help a few hand-picked teams along the way.",
];
const body = locale === "fr" ? bodyFR : bodyEN;
const title = locale === "fr" ? titleFR : titleEN;
---

<section class="about">
  <div class="left">
    <SectionLabel>{t("section.about").toUpperCase()}</SectionLabel>
    <h2>{title}</h2>
  </div>
  <div class="body">
    {body.map((p) => <p>{p}</p>)}
    <p><a href={t.path("about")} class="more">{t("cta.readMore").toUpperCase()} →</a></p>
  </div>
</section>

<style>
  .about {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 32px;
    padding: 40px 48px;
    border-bottom: var(--border-w) solid var(--color-border);
  }
  h2 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 8px 0 0;
  }
  .body p {
    font-size: 15px;
    line-height: 1.65;
    margin: 0 0 10px;
  }
  .more {
    display: inline-block;
    margin-top: 8px;
    background: var(--color-accent);
    color: var(--color-text);
    padding: 4px 8px;
    font-weight: 600;
    font-size: 12px;
    text-decoration: none;
  }
  @media (max-width: 720px) {
    .about { grid-template-columns: 1fr; padding: 24px 20px; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/organisms/AboutExcerpt.astro
git commit -m "feat(org): AboutExcerpt 2-column with label, title, paragraphs, more CTA"
```

---

### Task 2.15 — Create `CollabBand.astro` organism

**Files:**
- Create: `src/components/organisms/CollabBand.astro`

- [ ] **Step 1 — Create**

```astro
---
import Highlight from "@/components/atoms/Highlight.astro";
import type { Locale } from "@/types";
import { useTranslations } from "@/i18n/utils";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = useTranslations(locale);

const titleFR = { pre: "On ", hl: "construit", post: " quelque chose ensemble ?" };
const titleEN = { pre: "Want to ", hl: "build", post: " something together?" };
const title = locale === "fr" ? titleFR : titleEN;
const subFR = "Je prends 1 à 2 projets par semestre. Mobile, web, prototype IA — tout ce qui se ship vite et bien.";
const subEN = "I take 1-2 projects per half. Mobile, web, AI prototype — anything that ships fast and well.";
---

<section class="band">
  <h2>{title.pre}<Highlight>{title.hl}</Highlight>{title.post}</h2>
  <p>{locale === "fr" ? subFR : subEN}</p>
  <a href={t.path("work")} class="cta">{t("cta.bookCall").toUpperCase()} →</a>
</section>

<style>
  .band {
    background: var(--color-text);
    color: var(--color-bg);
    padding: 56px 48px;
    text-align: center;
    border-bottom: var(--border-w) solid var(--color-border);
  }
  h2 {
    font-size: clamp(28px, 5vw, 40px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0 0 14px;
  }
  p {
    font-size: 14px;
    color: var(--color-text-muted);
    max-width: 460px;
    margin: 0 auto 24px;
    line-height: 1.6;
  }
  .cta {
    display: inline-block;
    padding: 12px 22px;
    background: var(--color-accent);
    color: var(--color-text);
    font-weight: 700;
    font-size: 13px;
    border: var(--border-w) solid var(--color-accent);
    text-decoration: none;
  }
  .cta:hover { background: var(--color-bg); border-color: var(--color-bg); }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/organisms/CollabBand.astro
git commit -m "feat(org): CollabBand black section with highlight title + Cal.com CTA"
```

---

### Task 2.16 — Create `Footer.astro` organism

**Files:**
- Create: `src/components/organisms/Footer.astro`

- [ ] **Step 1 — Create**

```astro
---
import { socialLinks } from "@/data/socialLinks";
import type { Locale } from "@/types";
import { useTranslations } from "@/i18n/utils";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = useTranslations(locale);
---

<footer class="footer">
  <span>{t("footer.copy").toUpperCase()}</span>
  <ul class="links" role="list">
    {socialLinks.map((l) => (
      <li><a href={l.url} target="_blank" rel="noopener noreferrer">{l.platform.toUpperCase()}</a></li>
    ))}
    <li><a href={locale === "fr" ? "/rss.xml" : "/en/rss.xml"}>RSS</a></li>
  </ul>
</footer>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 48px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
    background: var(--color-bg);
    flex-wrap: wrap;
    gap: 12px;
  }
  .links { display: flex; gap: 14px; list-style: none; margin: 0; padding: 0; }
  .links a { color: inherit; text-decoration: none; }
  .links a:hover { color: var(--color-text); }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/organisms/Footer.astro
git commit -m "feat(org): Footer with copy + mono uppercase social links + RSS"
```

---

### Task 2.17 — Compose home FR (`src/pages/index.astro`)

**Files:**
- Replace: `src/pages/index.astro`

- [ ] **Step 1 — Replace content**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Hero from "@/components/organisms/Hero.astro";
import SocialBar from "@/components/organisms/SocialBar.astro";
import AppsGrid from "@/components/organisms/AppsGrid.astro";
import AboutExcerpt from "@/components/organisms/AboutExcerpt.astro";
import CollabBand from "@/components/organisms/CollabBand.astro";
import Footer from "@/components/organisms/Footer.astro";
import { profile } from "@/data/profile";

const locale = "fr" as const;
const title = `${profile.name} — Indie builder & engineer`;
const description = profile.bio.fr;
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="home" />
  <Hero locale={locale} />
  <SocialBar locale={locale} />
  <AppsGrid locale={locale} />
  <AboutExcerpt locale={locale} />
  <CollabBand locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 2 — Verify**

```bash
npm run build && npm run dev &
sleep 4 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/
kill %1
```

Expected: 200. Manuellement, ouvrir http://localhost:4321/ → home complète D1 visible.

- [ ] **Step 3 — Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): compose full FR home with all D1 organisms"
```

---

### Task 2.18 — Compose home EN (`src/pages/en/index.astro`)

**Files:**
- Create: `src/pages/en/index.astro`

- [ ] **Step 1 — Create**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Hero from "@/components/organisms/Hero.astro";
import SocialBar from "@/components/organisms/SocialBar.astro";
import AppsGrid from "@/components/organisms/AppsGrid.astro";
import AboutExcerpt from "@/components/organisms/AboutExcerpt.astro";
import CollabBand from "@/components/organisms/CollabBand.astro";
import Footer from "@/components/organisms/Footer.astro";
import { profile } from "@/data/profile";

const locale = "en" as const;
const title = `${profile.name} — Indie builder & engineer`;
const description = profile.bio.en;
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="home" />
  <Hero locale={locale} />
  <SocialBar locale={locale} />
  <AppsGrid locale={locale} />
  <AboutExcerpt locale={locale} />
  <CollabBand locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 2 — Verify**

```bash
npm run build
```

Expected: builds `/en/index.html`.

- [ ] **Step 3 — Commit**

```bash
git add src/pages/en/index.astro
git commit -m "feat(home): compose full EN home mirror"
```

---

## 🛑 Phase 02 — Review checkpoint

- [ ] `npm run dev` → home FR rendue D1 correctement (typo Inter Tight bold, surligneur fluo sur "j'utilise", apps grid 3-col, social bar pills, collab band noir, footer mono)
- [ ] http://localhost:4321/en/ → home EN rendue
- [ ] Lighthouse mobile sur home FR ≥ 95 sur les 4 axes
- [ ] `axe` (via Playwright manuel ou extension navigateur) : 0 violation critique
- [ ] Mode dark fonctionnel (cliquer le toggle, vérifier que `data-theme="dark"` apparaît sur `<html>` et que les couleurs s'inversent)
- [ ] Responsive : tester 360px de large (DevTools), pas de débordement, hero/portrait wrap correctement, grid apps passe en 1-col
- [ ] Pas de console error / warning
- [ ] Tous les fichiers ≤ 150 lignes, aucun `any`

**STOP, validate avec Aymeric avant Phase 03.**

---

## Phase 03 — À propos + Notes

**Objectif** : livrer la page À propos FR/EN, le système de Notes (index + article + tags) FR/EN, les composants prose pour MDX, les RSS feeds.

---

### Task 3.1 — Create `Chapter.astro` molecule

**Files:**
- Create: `src/components/molecules/Chapter.astro`

- [ ] **Step 1 — Create**

```astro
---
import type { Chapter, Locale } from "@/types";

interface Props { chapter: Chapter; locale: Locale }
const { chapter, locale } = Astro.props;
---

<article class="chapter">
  <div class="years">{chapter.yearsLabel}</div>
  <div class="body">
    <h3>{chapter.title[locale]}</h3>
    <p class="role">{chapter.role[locale]}</p>
    <p class="desc">{chapter.body[locale]}</p>
  </div>
</article>

<style>
  .chapter {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 24px;
    padding: 18px 0;
    border-top: 1px dashed var(--color-border);
  }
  .chapter:first-of-type { border-top: none; padding-top: 0; }
  .years { font-family: var(--font-mono); font-size: 12px; color: var(--color-text-muted); padding-top: 2px; }
  h3 { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 4px; }
  .role { font-size: 12px; color: var(--color-text-muted); margin: 0 0 6px; }
  .desc { font-size: 13px; line-height: 1.6; margin: 0; }
  @media (max-width: 720px) {
    .chapter { grid-template-columns: 1fr; gap: 6px; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/Chapter.astro
git commit -m "feat(mol): Chapter with years column + title/role/body"
```

---

### Task 3.2 — Create `StackGroup.astro` molecule

**Files:**
- Create: `src/components/molecules/StackGroup.astro`

- [ ] **Step 1 — Create**

```astro
---
import type { StackEntry, Locale } from "@/types";

interface Props { entry: StackEntry; locale: Locale }
const { entry, locale } = Astro.props;
---

<div class="stack-group">
  <div class="category">{entry.category[locale]}</div>
  <ul class="items" role="list">
    {entry.items.map((item) => <li>{item}</li>)}
  </ul>
</div>

<style>
  .stack-group {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 24px;
    padding: 8px 0;
  }
  .category {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
  .items {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .items li {
    font-family: var(--font-mono);
    font-size: 12px;
    background: var(--color-bg-soft);
    padding: 2px 8px;
    border: 1px solid var(--color-border);
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/StackGroup.astro
git commit -m "feat(mol): StackGroup with category label + mono pills"
```

---

### Task 3.3 — Page `/a-propos.astro` (FR)

**Files:**
- Create: `src/pages/a-propos.astro`

- [ ] **Step 1 — Create**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import Chapter from "@/components/molecules/Chapter.astro";
import StackGroup from "@/components/molecules/StackGroup.astro";
import CollabBand from "@/components/organisms/CollabBand.astro";
import { chapters } from "@/data/chapters";
import { stack } from "@/data/stack";

const locale = "fr" as const;
const title = "À propos — Aymeric Dijoux, indie builder à Paris";
const description = "Aymeric Dijoux est un indie builder et software engineer basé à Paris. Il construit et lance ses propres apps consumer (VoiceJournal, Caroubolt, Tookta) et accompagne quelques équipes en freelance.";
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="about" />

  <section class="page-hero">
    <SectionLabel>— À PROPOS</SectionLabel>
    <h1>Builder, engineer, <Highlight>founder</Highlight>.</h1>
    <p class="deck">Aymeric Dijoux est un indie builder et software engineer basé à Paris. Il code, lance, et écrit ce qu'il apprend en chemin.</p>
  </section>

  <section class="section">
    <SectionLabel number="01">MAINTENANT</SectionLabel>
    <h2>Ce sur quoi je <Highlight>bosse</Highlight></h2>
    <p>Je passe l'essentiel de mes journées à itérer sur <strong>VoiceJournal</strong>, à explorer des idées d'IA appliquée, et à écrire ici de temps en temps.</p>
    <p>Je prends aussi 1 à 2 missions freelance par semestre quand le projet me parle.</p>
  </section>

  <section class="section">
    <SectionLabel number="02">PARCOURS</SectionLabel>
    <h2>Quelques <Highlight>chapitres</Highlight></h2>
    {chapters.map((c) => <Chapter chapter={c} locale={locale} />)}
  </section>

  <section class="section">
    <SectionLabel number="03">PHILOSOPHIE</SectionLabel>
    <h2>Comment je <Highlight>travaille</Highlight></h2>
    <p>Je ship vite et je ship souvent. La meilleure spec, c'est une version en prod qui se fait engueuler par 100 vrais utilisateurs.</p>
    <p>Je privilégie les stacks que je maîtrise bien à celles qui sont à la mode. L'IA est un outil, pas une religion — utile partout où elle remplace un formulaire ennuyeux.</p>
    <p>Je code seul mais je pense en équipe — chaque app est faite pour grossir au-delà de moi.</p>
  </section>

  <section class="section">
    <SectionLabel number="04">STACK 2026</SectionLabel>
    <h2>Ce que j'<Highlight>utilise</Highlight></h2>
    {stack.map((s) => <StackGroup entry={s} locale={locale} />)}
  </section>

  <CollabBand locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .page-hero {
    padding: 64px 48px 32px;
    border-bottom: var(--border-w) solid var(--color-border);
    max-width: var(--container-content);
    margin: 0 auto;
  }
  h1 {
    font-size: clamp(36px, 6vw, 48px);
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 14px 0 14px;
  }
  .deck {
    font-size: 17px;
    line-height: 1.6;
    color: var(--color-text-muted);
    max-width: 560px;
    margin: 0;
  }
  .section {
    padding: 40px 48px;
    border-bottom: var(--border-w) solid var(--color-border);
    max-width: var(--container-content);
    margin: 0 auto;
  }
  .section h2 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 12px 0 16px;
    line-height: 1;
  }
  .section p {
    font-size: 15px;
    line-height: 1.75;
    margin: 0 0 14px;
  }
  @media (max-width: 720px) {
    .page-hero, .section { padding-left: 20px; padding-right: 20px; }
  }
</style>
```

- [ ] **Step 2 — Verify**

```bash
npm run build && npm run dev &
sleep 4 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/a-propos
kill %1
```

Expected: 200.

- [ ] **Step 3 — Commit**

```bash
git add src/pages/a-propos.astro
git commit -m "feat(about): /a-propos page FR with 4 sections, chapters, stack, collab"
```

---

### Task 3.4 — Page `/en/about.astro` (EN mirror)

**Files:**
- Create: `src/pages/en/about.astro`

- [ ] **Step 1 — Create** (similar to FR but with `locale="en"` and EN text strings)

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import Chapter from "@/components/molecules/Chapter.astro";
import StackGroup from "@/components/molecules/StackGroup.astro";
import CollabBand from "@/components/organisms/CollabBand.astro";
import { chapters } from "@/data/chapters";
import { stack } from "@/data/stack";

const locale = "en" as const;
const title = "About — Aymeric Dijoux, indie builder in Paris";
const description = "Aymeric Dijoux is an indie builder and software engineer based in Paris. He builds and ships his own consumer apps (VoiceJournal, Caroubolt, Tookta) and helps select teams as a freelancer.";
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="about" />

  <section class="page-hero">
    <SectionLabel>— ABOUT</SectionLabel>
    <h1>Builder, engineer, <Highlight>founder</Highlight>.</h1>
    <p class="deck">Aymeric Dijoux is an indie builder and software engineer based in Paris. He codes, ships, and writes what he learns along the way.</p>
  </section>

  <section class="section">
    <SectionLabel number="01">NOW</SectionLabel>
    <h2>What I'm <Highlight>working on</Highlight></h2>
    <p>I spend most days iterating on <strong>VoiceJournal</strong>, exploring applied AI ideas, and writing here from time to time.</p>
    <p>I also take 1-2 freelance missions per half-year when the project resonates.</p>
  </section>

  <section class="section">
    <SectionLabel number="02">PATH</SectionLabel>
    <h2>A few <Highlight>chapters</Highlight></h2>
    {chapters.map((c) => <Chapter chapter={c} locale={locale} />)}
  </section>

  <section class="section">
    <SectionLabel number="03">PHILOSOPHY</SectionLabel>
    <h2>How I <Highlight>work</Highlight></h2>
    <p>I ship fast and often. The best spec is a production version getting yelled at by 100 real users.</p>
    <p>I favor stacks I know well over trendy ones. AI is a tool, not a religion — useful wherever it replaces a boring form.</p>
    <p>I code alone but think as a team — each app is built to grow beyond me.</p>
  </section>

  <section class="section">
    <SectionLabel number="04">STACK 2026</SectionLabel>
    <h2>What I <Highlight>use</Highlight></h2>
    {stack.map((s) => <StackGroup entry={s} locale={locale} />)}
  </section>

  <CollabBand locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .page-hero { padding: 64px 48px 32px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-content); margin: 0 auto; }
  h1 { font-size: clamp(36px, 6vw, 48px); line-height: 1; font-weight: 700; letter-spacing: -0.04em; margin: 14px 0; }
  .deck { font-size: 17px; line-height: 1.6; color: var(--color-text-muted); max-width: 560px; margin: 0; }
  .section { padding: 40px 48px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-content); margin: 0 auto; }
  .section h2 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin: 12px 0 16px; line-height: 1; }
  .section p { font-size: 15px; line-height: 1.75; margin: 0 0 14px; }
  @media (max-width: 720px) { .page-hero, .section { padding-left: 20px; padding-right: 20px; } }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/en/about.astro
git commit -m "feat(about): /en/about EN mirror with same structure"
```

---

### Task 3.5 — Create `lib/notes.ts` (loader util)

**Files:**
- Create: `src/lib/notes.ts`

- [ ] **Step 1 — Create**

```ts
import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/types";
import { computeReadingTime } from "./readingTime";

export type NoteEntry = CollectionEntry<"notes">;

export async function loadPublishedNotes(locale: Locale): Promise<NoteEntry[]> {
  const all = await getCollection("notes", ({ data }) => !data.draft && data.locale === locale);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function loadLatestNotes(locale: Locale, limit: number): Promise<NoteEntry[]> {
  const notes = await loadPublishedNotes(locale);
  return notes.slice(0, limit);
}

export async function findTranslation(
  translationKey: string,
  targetLocale: Locale
): Promise<NoteEntry | undefined> {
  const all = await getCollection("notes", ({ data }) => !data.draft && data.locale === targetLocale);
  return all.find((entry) => entry.data.translationKey === translationKey);
}

export async function listAllTags(locale: Locale): Promise<string[]> {
  const notes = await loadPublishedNotes(locale);
  const tags = new Set<string>();
  notes.forEach((n) => n.data.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getNoteReadingTime(entry: NoteEntry): { minutes: number; words: number } {
  return computeReadingTime(entry.body);
}

export function buildNoteUrl(entry: NoteEntry): string {
  return entry.data.locale === "fr" ? `/notes/${entry.slug}` : `/en/writing/${entry.slug}`;
}
```

- [ ] **Step 2 — Verify**

```bash
npm run astro check
```

- [ ] **Step 3 — Commit**

```bash
git add src/lib/notes.ts
git commit -m "feat(lib): notes loader with publish filter, tags, translation, reading time"
```

---

### Task 3.6 — Seed notes (1 FR + 1 EN paired)

**Files:**
- Create: `src/content/notes/fr/2026-04-hello.mdx`
- Create: `src/content/notes/en/2026-04-hello.mdx`

- [ ] **Step 1 — Create FR note**

```mdx
---
title: "Bienvenue sur ce nouveau site"
date: 2026-04-12
locale: fr
translationKey: "2026-04-hello"
tags: ["meta"]
excerpt: "Pourquoi j'ai refait mon site, ce qu'il y aura dessus, et comment je compte le maintenir."
draft: false
---

Bienvenue. Ce site est mon nouveau hub : mes apps, mon parcours, mes notes, et ma porte freelance.

## Pourquoi maintenant ?

Parce que j'avais un link-in-bio et qu'il ne suffisait plus.

## Ce que tu trouveras ici

- Les apps que je build (VoiceJournal, Caroubolt, Tookta)
- Mon parcours et ma philosophie
- Des notes courtes quand j'apprends quelque chose qui vaut le partage
- Une page pour bosser ensemble si tu cherches un builder

## La suite

Plus d'articles à venir.
```

- [ ] **Step 2 — Create EN paired note**

```mdx
---
title: "Welcome to this new site"
date: 2026-04-12
locale: en
translationKey: "2026-04-hello"
tags: ["meta"]
excerpt: "Why I rebuilt my site, what's on it, and how I plan to keep it alive."
draft: false
---

Welcome. This site is my new hub: my apps, my path, my notes, and my freelance door.

## Why now?

Because I had a link-in-bio and it stopped being enough.

## What you'll find here

- The apps I'm building (VoiceJournal, Caroubolt, Tookta)
- My path and philosophy
- Short notes when I learn something worth sharing
- A page to work together if you need a builder

## What's next

More articles to come.
```

- [ ] **Step 3 — Verify**

```bash
npm run astro sync && npm run astro check
```

Expected: 0 errors.

- [ ] **Step 4 — Commit**

```bash
git add src/content/notes/
git commit -m "feat(notes): seed first bilingual note (welcome) with translationKey"
```

---

### Task 3.7 — Create `Callout.astro` prose component

**Files:**
- Create: `src/components/prose/Callout.astro`

- [ ] **Step 1 — Create**

```astro
---
interface Props {
  tone?: "info" | "warn" | "ok";
}
const { tone = "info" } = Astro.props;
const labels = { info: "NOTE", warn: "ATTENTION", ok: "OK" };
---

<aside class:list={["callout", `tone-${tone}`]}>
  <span class="label">{labels[tone]}</span>
  <div class="content"><slot /></div>
</aside>

<style>
  .callout {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 16px;
    align-items: start;
    padding: 16px;
    border: var(--border-w) solid var(--color-border);
    background: var(--color-bg-soft);
    margin: 18px 0;
  }
  .label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 3px 6px;
    background: var(--color-text);
    color: var(--color-accent);
    align-self: start;
  }
  .tone-warn .label { background: #b45309; color: #fef3c7; }
  .tone-ok .label { background: var(--color-success); color: var(--color-text); }
  .content :global(p:last-child) { margin-bottom: 0; }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/prose/Callout.astro
git commit -m "feat(prose): Callout with info/warn/ok tones"
```

---

### Task 3.8 — Create `FileBlock.astro` prose component

**Files:**
- Create: `src/components/prose/FileBlock.astro`

- [ ] **Step 1 — Create**

```astro
---
interface Props {
  filename: string;
}
const { filename } = Astro.props;
---

<div class="file-block">
  <header>
    <span class="name">{filename}</span>
    <button type="button" class="copy" data-copy-target>copy</button>
  </header>
  <slot />
</div>

<script>
  document.querySelectorAll<HTMLButtonElement>(".file-block .copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const code = btn.closest(".file-block")?.querySelector("pre code")?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = "copied";
        setTimeout(() => (btn.textContent = "copy"), 1500);
      } catch (_) {
        btn.textContent = "failed";
      }
    });
  });
</script>

<style>
  .file-block { margin: 18px 0; }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #292524;
    color: #d6d3d1;
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 8px 14px;
  }
  .copy {
    background: rgba(255, 255, 255, 0.1);
    color: inherit;
    border: none;
    padding: 2px 8px;
    font-size: 10px;
    font-family: inherit;
    cursor: pointer;
  }
  .file-block :global(pre) { margin-top: 0; border-top-left-radius: 0; border-top-right-radius: 0; }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/prose/FileBlock.astro
git commit -m "feat(prose): FileBlock with filename header and copy-to-clipboard"
```

---

### Task 3.9 — Create `prose.css`

**Files:**
- Create: `src/styles/prose.css`

- [ ] **Step 1 — Create**

```css
/* MDX article typography */
.prose {
  max-width: var(--container-prose);
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text);
}
.prose p { margin: 0 0 18px; }
.prose h2 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 36px 0 14px;
  line-height: 1.15;
}
.prose h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 28px 0 10px;
}
.prose ul, .prose ol { padding-left: 22px; margin: 0 0 18px; }
.prose li { margin: 4px 0; }
.prose blockquote {
  border-left: 3px solid var(--color-accent);
  padding: 4px 16px;
  color: var(--color-text-muted);
  margin: 18px 0;
  font-style: italic;
}
.prose code {
  font-family: var(--font-mono);
  font-size: 0.92em;
  background: var(--color-bg-soft);
  padding: 2px 6px;
  border: 1px solid var(--color-border);
}
.prose pre {
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 18px;
  background: #1c1917;
  color: #fafaf9;
  overflow-x: auto;
  margin: 18px 0;
  line-height: 1.6;
}
.prose pre code { background: transparent; border: none; padding: 0; }
.prose a {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
.prose img {
  max-width: 100%;
  border: var(--border-w) solid var(--color-border);
  margin: 18px 0;
}
.prose hr { border: none; border-top: var(--border-w) solid var(--color-border); margin: 32px 0; }
```

- [ ] **Step 2 — Import in global.css**

Add at the end of `src/styles/global.css`:
```css
@import "./prose.css";
```

- [ ] **Step 3 — Commit**

```bash
git add src/styles/prose.css src/styles/global.css
git commit -m "feat(styles): add prose.css for MDX article typography"
```

---

### Task 3.10 — Create `NoteLayout.astro`

**Files:**
- Create: `src/layouts/NoteLayout.astro`

- [ ] **Step 1 — Create**

```astro
---
import MainLayout from "./MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import LangToggle from "@/components/molecules/LangToggle.astro";
import { useTranslations, alternateLocale } from "@/i18n/utils";
import { formatDate } from "@/lib/dates";
import type { Locale } from "@/types";

interface Props {
  title: string;
  description: string;
  locale: Locale;
  date: Date;
  tags: string[];
  readingMinutes: number;
  altUrl?: string;
}

const { title, description, locale, date, tags, readingMinutes, altUrl } = Astro.props;
const t = useTranslations(locale);
const dateLabel = formatDate(date, locale);
const altLocale = alternateLocale(locale);
---

<MainLayout title={`${title} — Aymeric Dijoux`} description={description} locale={locale} pageType="article">
  <Nav slot="nav" locale={locale} current="notes" />

  <article class="note">
    <a href={t.path("notes")} class="back">← {locale === "fr" ? "Notes" : "Writing"}</a>
    <h1>{title}</h1>
    <div class="meta">
      <time datetime={date.toISOString()}>{dateLabel}</time>
      <span class="sep">·</span>
      <span>{tags.join(" · ")}</span>
      <span class="sep">·</span>
      <span>{readingMinutes} min</span>
      {altUrl && (
        <>
          <span class="sep">·</span>
          <a href={altUrl} class="alt" hreflang={altLocale}>{altLocale.toUpperCase()}</a>
        </>
      )}
    </div>
    <div class="prose">
      <slot />
    </div>
  </article>

  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .note {
    padding: 56px 48px 48px;
    max-width: var(--container-content);
    margin: 0 auto;
  }
  .back {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .back:hover { color: var(--color-text); }
  h1 {
    font-size: clamp(28px, 5vw, 40px);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin: 16px 0 16px;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-text-muted);
    margin: 0 0 36px;
  }
  .sep { opacity: 0.6; }
  .alt {
    padding: 2px 6px;
    background: var(--color-bg-soft);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    text-decoration: none;
  }
  @media (max-width: 720px) {
    .note { padding: 32px 20px; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/layouts/NoteLayout.astro
git commit -m "feat(layout): NoteLayout with back link, h1, meta bar, alt-lang toggle"
```

---

### Task 3.11 — Create `NoteRow.astro` molecule

**Files:**
- Create: `src/components/molecules/NoteRow.astro`

- [ ] **Step 1 — Create**

```astro
---
import type { NoteEntry } from "@/lib/notes";
import type { Locale } from "@/types";
import { buildNoteUrl, getNoteReadingTime } from "@/lib/notes";
import { formatDate } from "@/lib/dates";

interface Props { note: NoteEntry; locale: Locale; showExcerpt?: boolean }
const { note, locale, showExcerpt = true } = Astro.props;
const { minutes } = getNoteReadingTime(note);
const url = buildNoteUrl(note);
---

<a href={url} class="note-row">
  <span class="date">{formatDate(note.data.date, locale)}</span>
  <div class="content">
    <h3>{note.data.title}</h3>
    {showExcerpt && <p class="lede">{note.data.excerpt}</p>}
    <div class="meta">
      {note.data.tags.length > 0 && <span class="tags">{note.data.tags.join(" · ")}</span>}
      <span class="sep">·</span>
      <span>{minutes} min</span>
    </div>
  </div>
</a>

<style>
  .note-row {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 24px;
    padding: 18px 0;
    border-top: var(--border-w) solid var(--color-border);
    color: var(--color-text);
    text-decoration: none;
  }
  .note-row:hover h3 { background: var(--color-accent); }
  .date {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-text-muted);
    padding-top: 4px;
  }
  h3 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 6px;
    line-height: 1.3;
    display: inline;
  }
  .lede { font-size: 14px; color: var(--color-text-muted); line-height: 1.5; margin: 8px 0 8px; }
  .meta { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); display: flex; gap: 6px; }
  .sep { opacity: 0.6; }
  @media (max-width: 720px) {
    .note-row { grid-template-columns: 1fr; gap: 8px; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/NoteRow.astro
git commit -m "feat(mol): NoteRow with date column, title, excerpt, meta"
```

---

### Task 3.12 — Create `NotesSection.astro` organism (for home)

**Files:**
- Create: `src/components/organisms/NotesSection.astro`

- [ ] **Step 1 — Create**

```astro
---
import NoteRow from "@/components/molecules/NoteRow.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import { useTranslations } from "@/i18n/utils";
import { loadLatestNotes } from "@/lib/notes";
import { NOTES_ON_HOME } from "@/lib/constants";
import type { Locale } from "@/types";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = useTranslations(locale);
const notes = await loadLatestNotes(locale, NOTES_ON_HOME);

const labelStr = t("section.latestNotes");
const lastWord = labelStr.match(/\S+$/)?.[0] ?? "";
const pre = labelStr.replace(/\S+$/, "");
---

{notes.length > 0 && (
  <section class="notes">
    <header class="head">
      <h2>{pre}<Highlight>{lastWord}</Highlight></h2>
      <a href={t.path("notes")} class="all">{t("section.allNotes").toUpperCase()} →</a>
    </header>
    <div class="list">
      {notes.map((note) => <NoteRow note={note} locale={locale} showExcerpt={false} />)}
    </div>
  </section>
)}

<style>
  .notes {
    padding: 40px 48px;
    border-bottom: var(--border-w) solid var(--color-border);
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;
  }
  h2 { font-size: clamp(24px, 4vw, 32px); font-weight: 700; letter-spacing: -0.03em; margin: 0; line-height: 1; }
  .all { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-decoration: none; }
  .all:hover { color: var(--color-text); }
  .list :global(.note-row:last-child) { border-bottom: var(--border-w) solid var(--color-border); }
  @media (max-width: 720px) { .notes { padding: 24px 20px; } }
</style>
```

- [ ] **Step 2 — Integrate into home FR and EN**

Modify `src/pages/index.astro` and `src/pages/en/index.astro` to insert `<NotesSection locale={locale} />` between `<AboutExcerpt />` and `<CollabBand />`:

```astro
<AboutExcerpt locale={locale} />
<NotesSection locale={locale} />
<CollabBand locale={locale} />
```

Add the import:
```astro
import NotesSection from "@/components/organisms/NotesSection.astro";
```

- [ ] **Step 3 — Verify**

```bash
npm run build
```

- [ ] **Step 4 — Commit**

```bash
git add src/components/organisms/NotesSection.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "feat(home): add NotesSection showing 3 latest notes per locale"
```

---

### Task 3.13 — Page `/notes/index.astro` (FR notes index)

**Files:**
- Create: `src/pages/notes/index.astro`

- [ ] **Step 1 — Create**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import NoteRow from "@/components/molecules/NoteRow.astro";
import { loadPublishedNotes, listAllTags } from "@/lib/notes";

const locale = "fr" as const;
const notes = await loadPublishedNotes(locale);
const tags = await listAllTags(locale);
const title = "Notes — Aymeric Dijoux";
const description = "Notes de build, retours d'expérience, et essais techniques d'Aymeric Dijoux. Pas un blog régulier — j'écris quand j'ai quelque chose qui vaut le coup d'être partagé.";
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="notes" />

  <section class="page-hero">
    <SectionLabel>— NOTES</SectionLabel>
    <h1>Ce que <Highlight>j'apprends</Highlight> en buildant.</h1>
    <p class="deck">{description}</p>
  </section>

  <nav class="filters" aria-label="Filtres tags">
    <a href="/notes" class="tag-pill active">tous</a>
    {tags.map((tag) => <a href={`/notes/tags/${tag}`} class="tag-pill">{tag}</a>)}
    <a href="/rss.xml" class="rss">— RSS ↗</a>
  </nav>

  <div class="list">
    {notes.map((note) => <NoteRow note={note} locale={locale} />)}
    {notes.length === 0 && <p class="empty">Pas encore d'article — reviens bientôt.</p>}
  </div>

  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .page-hero { padding: 56px 48px 24px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-narrow); margin: 0 auto; }
  h1 { font-size: clamp(28px, 5vw, 36px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 14px 0 12px; }
  .deck { font-size: 15px; color: var(--color-text-muted); line-height: 1.6; max-width: 560px; margin: 0; }
  .filters { display: flex; gap: 8px; align-items: center; padding: 16px 48px 8px; flex-wrap: wrap; max-width: var(--container-narrow); margin: 0 auto; }
  .tag-pill { padding: 4px 10px; font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-decoration: none; background: var(--color-bg-soft); border: 1px solid var(--color-border); }
  .tag-pill.active { background: var(--color-text); color: var(--color-accent); border-color: var(--color-text); }
  .rss { margin-left: auto; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; text-decoration: none; }
  .list { padding: 0 48px 48px; max-width: var(--container-narrow); margin: 0 auto; }
  .empty { padding: 40px 0; color: var(--color-text-muted); text-align: center; }
  @media (max-width: 720px) { .page-hero, .filters, .list { padding-left: 20px; padding-right: 20px; } .rss { margin-left: 0; width: 100%; } }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/notes/index.astro
git commit -m "feat(notes): /notes index FR with tags filters and RSS link"
```

---

### Task 3.14 — Page `/en/writing/index.astro` (EN mirror)

**Files:**
- Create: `src/pages/en/writing/index.astro`

- [ ] **Step 1 — Create** (mêmes patterns que FR, locale="en", strings EN)

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import NoteRow from "@/components/molecules/NoteRow.astro";
import { loadPublishedNotes, listAllTags } from "@/lib/notes";

const locale = "en" as const;
const notes = await loadPublishedNotes(locale);
const tags = await listAllTags(locale);
const title = "Writing — Aymeric Dijoux";
const description = "Build notes, lessons learned, and technical essays by Aymeric Dijoux. Not a regular blog — I write when I have something worth sharing.";
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="notes" />

  <section class="page-hero">
    <SectionLabel>— WRITING</SectionLabel>
    <h1>What I'm <Highlight>learning</Highlight> while building.</h1>
    <p class="deck">{description}</p>
  </section>

  <nav class="filters" aria-label="Tag filters">
    <a href="/en/writing" class="tag-pill active">all</a>
    {tags.map((tag) => <a href={`/en/writing/tags/${tag}`} class="tag-pill">{tag}</a>)}
    <a href="/en/rss.xml" class="rss">— RSS ↗</a>
  </nav>

  <div class="list">
    {notes.map((note) => <NoteRow note={note} locale={locale} />)}
    {notes.length === 0 && <p class="empty">No articles yet — check back soon.</p>}
  </div>

  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .page-hero { padding: 56px 48px 24px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-narrow); margin: 0 auto; }
  h1 { font-size: clamp(28px, 5vw, 36px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 14px 0 12px; }
  .deck { font-size: 15px; color: var(--color-text-muted); line-height: 1.6; max-width: 560px; margin: 0; }
  .filters { display: flex; gap: 8px; align-items: center; padding: 16px 48px 8px; flex-wrap: wrap; max-width: var(--container-narrow); margin: 0 auto; }
  .tag-pill { padding: 4px 10px; font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-decoration: none; background: var(--color-bg-soft); border: 1px solid var(--color-border); }
  .tag-pill.active { background: var(--color-text); color: var(--color-accent); border-color: var(--color-text); }
  .rss { margin-left: auto; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; text-decoration: none; }
  .list { padding: 0 48px 48px; max-width: var(--container-narrow); margin: 0 auto; }
  .empty { padding: 40px 0; color: var(--color-text-muted); text-align: center; }
  @media (max-width: 720px) { .page-hero, .filters, .list { padding-left: 20px; padding-right: 20px; } .rss { margin-left: 0; width: 100%; } }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/en/writing/index.astro
git commit -m "feat(notes): /en/writing index EN mirror"
```

---

### Task 3.15 — Page `/notes/[slug].astro` (FR article)

**Files:**
- Create: `src/pages/notes/[slug].astro`

- [ ] **Step 1 — Create**

```astro
---
import NoteLayout from "@/layouts/NoteLayout.astro";
import { loadPublishedNotes, findTranslation, getNoteReadingTime, buildNoteUrl } from "@/lib/notes";
import Callout from "@/components/prose/Callout.astro";
import FileBlock from "@/components/prose/FileBlock.astro";

export async function getStaticPaths() {
  const notes = await loadPublishedNotes("fr");
  return notes.map((note) => ({ params: { slug: note.slug }, props: { note } }));
}

const { note } = Astro.props;
const { Content } = await note.render();
const { minutes } = getNoteReadingTime(note);
const translation = await findTranslation(note.data.translationKey, "en");
const altUrl = translation ? buildNoteUrl(translation) : undefined;
---

<NoteLayout
  title={note.data.title}
  description={note.data.excerpt}
  locale="fr"
  date={note.data.date}
  tags={note.data.tags}
  readingMinutes={minutes}
  altUrl={altUrl}
>
  <Content components={{ Callout, FileBlock }} />
</NoteLayout>
```

- [ ] **Step 2 — Verify**

```bash
npm run build && npm run dev &
sleep 4 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/notes/2026-04-hello
kill %1
```

Expected: 200.

- [ ] **Step 3 — Commit**

```bash
git add src/pages/notes/\[slug\].astro
git commit -m "feat(notes): /notes/[slug] article route with FR-EN translation link"
```

---

### Task 3.16 — Page `/en/writing/[slug].astro`

**Files:**
- Create: `src/pages/en/writing/[slug].astro`

- [ ] **Step 1 — Create**

```astro
---
import NoteLayout from "@/layouts/NoteLayout.astro";
import { loadPublishedNotes, findTranslation, getNoteReadingTime, buildNoteUrl } from "@/lib/notes";
import Callout from "@/components/prose/Callout.astro";
import FileBlock from "@/components/prose/FileBlock.astro";

export async function getStaticPaths() {
  const notes = await loadPublishedNotes("en");
  return notes.map((note) => ({ params: { slug: note.slug }, props: { note } }));
}

const { note } = Astro.props;
const { Content } = await note.render();
const { minutes } = getNoteReadingTime(note);
const translation = await findTranslation(note.data.translationKey, "fr");
const altUrl = translation ? buildNoteUrl(translation) : undefined;
---

<NoteLayout
  title={note.data.title}
  description={note.data.excerpt}
  locale="en"
  date={note.data.date}
  tags={note.data.tags}
  readingMinutes={minutes}
  altUrl={altUrl}
>
  <Content components={{ Callout, FileBlock }} />
</NoteLayout>
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/en/writing/\[slug\].astro
git commit -m "feat(notes): /en/writing/[slug] article route mirror"
```

---

### Task 3.17 — Tag pages (FR + EN)

**Files:**
- Create: `src/pages/notes/tags/[tag].astro`
- Create: `src/pages/en/writing/tags/[tag].astro`

- [ ] **Step 1 — Create FR tag page**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import NoteRow from "@/components/molecules/NoteRow.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import { loadPublishedNotes, listAllTags } from "@/lib/notes";

export async function getStaticPaths() {
  const tags = await listAllTags("fr");
  return Promise.all(
    tags.map(async (tag) => {
      const notes = (await loadPublishedNotes("fr")).filter((n) => n.data.tags.includes(tag));
      return { params: { tag }, props: { tag, notes } };
    })
  );
}

const { tag, notes } = Astro.props;
const locale = "fr" as const;
const title = `Notes · #${tag} — Aymeric Dijoux`;
const description = `Articles taggés #${tag} sur le site d'Aymeric Dijoux.`;
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="notes" />
  <section class="hero">
    <SectionLabel>— TAG</SectionLabel>
    <h1>#{tag}</h1>
    <a href="/notes" class="back">← Toutes les notes</a>
  </section>
  <div class="list">
    {notes.map((note) => <NoteRow note={note} locale={locale} />)}
  </div>
  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .hero { padding: 56px 48px 24px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-narrow); margin: 0 auto; }
  h1 { font-size: 36px; font-weight: 700; letter-spacing: -0.04em; margin: 12px 0 8px; font-family: var(--font-mono); }
  .back { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-decoration: none; }
  .list { padding: 0 48px 48px; max-width: var(--container-narrow); margin: 0 auto; }
  @media (max-width: 720px) { .hero, .list { padding-left: 20px; padding-right: 20px; } }
</style>
```

- [ ] **Step 2 — Create EN tag page**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import NoteRow from "@/components/molecules/NoteRow.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import { loadPublishedNotes, listAllTags } from "@/lib/notes";

export async function getStaticPaths() {
  const tags = await listAllTags("en");
  return Promise.all(
    tags.map(async (tag) => {
      const notes = (await loadPublishedNotes("en")).filter((n) => n.data.tags.includes(tag));
      return { params: { tag }, props: { tag, notes } };
    })
  );
}

const { tag, notes } = Astro.props;
const locale = "en" as const;
const title = `Writing · #${tag} — Aymeric Dijoux`;
const description = `Articles tagged #${tag} on Aymeric Dijoux's site.`;
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="notes" />
  <section class="hero">
    <SectionLabel>— TAG</SectionLabel>
    <h1>#{tag}</h1>
    <a href="/en/writing" class="back">← All writing</a>
  </section>
  <div class="list">
    {notes.map((note) => <NoteRow note={note} locale={locale} />)}
  </div>
  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .hero { padding: 56px 48px 24px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-narrow); margin: 0 auto; }
  h1 { font-size: 36px; font-weight: 700; letter-spacing: -0.04em; margin: 12px 0 8px; font-family: var(--font-mono); }
  .back { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-decoration: none; }
  .list { padding: 0 48px 48px; max-width: var(--container-narrow); margin: 0 auto; }
  @media (max-width: 720px) { .hero, .list { padding-left: 20px; padding-right: 20px; } }
</style>
```

- [ ] **Step 3 — Commit**

```bash
git add src/pages/notes/tags/ src/pages/en/writing/tags/
git commit -m "feat(notes): tag filter pages FR + EN with static path generation"
```

---

### Task 3.18 — RSS feeds (FR + EN)

**Files:**
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/en/rss.xml.ts`

- [ ] **Step 1 — Create FR RSS**

```ts
import rss from "@astrojs/rss";
import { loadPublishedNotes, buildNoteUrl } from "@/lib/notes";
import { SITE_URL } from "@/lib/constants";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const notes = await loadPublishedNotes("fr");
  return rss({
    title: "Aymeric Dijoux — Notes",
    description: "Notes de build, retours d'expérience, et essais techniques.",
    site: context.site ?? SITE_URL,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      description: note.data.excerpt,
      link: buildNoteUrl(note),
    })),
    customData: `<language>fr-FR</language>`,
  });
}
```

- [ ] **Step 2 — Create EN RSS** (same but `loadPublishedNotes("en")` and English copy)

```ts
import rss from "@astrojs/rss";
import { loadPublishedNotes, buildNoteUrl } from "@/lib/notes";
import { SITE_URL } from "@/lib/constants";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const notes = await loadPublishedNotes("en");
  return rss({
    title: "Aymeric Dijoux — Writing",
    description: "Build notes, lessons learned, and technical essays.",
    site: context.site ?? SITE_URL,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      description: note.data.excerpt,
      link: buildNoteUrl(note),
    })),
    customData: `<language>en-US</language>`,
  });
}
```

- [ ] **Step 3 — Verify**

```bash
npm run build && cat dist/rss.xml | head -20
```

Expected: valid RSS XML.

- [ ] **Step 4 — Commit**

```bash
git add src/pages/rss.xml.ts src/pages/en/rss.xml.ts
git commit -m "feat(rss): RSS feeds per locale"
```

---

## 🛑 Phase 03 — Review checkpoint

- [ ] http://localhost:4321/a-propos → 4 sections, parcours, stack, end CTA collab band
- [ ] http://localhost:4321/en/about → mirror EN
- [ ] http://localhost:4321/notes → index avec 1 article, filtres tags, lien RSS
- [ ] http://localhost:4321/notes/2026-04-hello → article rendu, MDX, prose typography propre
- [ ] Toggle FR↔EN sur l'article fonctionnel (lien vers `/en/writing/2026-04-hello`)
- [ ] http://localhost:4321/notes/tags/meta → liste filtrée
- [ ] http://localhost:4321/rss.xml et `/en/rss.xml` → XML valide
- [ ] Latest notes section affichée sur home (FR + EN)
- [ ] Lighthouse ≥ 95 sur /notes et /notes/2026-04-hello
- [ ] Tous fichiers ≤ 150 lignes

**STOP, validate avec Aymeric avant Phase 04.**

---

## Phase 04 — Collaborer + GEO + Ship

**Objectif** : livrer la page Collaborer FR/EN, toute la GEO (llms.txt, robots.txt, ai.txt, JSON-LD complet, OG dynamiques), CI workflow, deploy production.

---

### Task 4.1 — Create `ServiceCard.astro` molecule

**Files:**
- Create: `src/components/molecules/ServiceCard.astro`

- [ ] **Step 1 — Create**

```astro
---
import Icon from "@/components/atoms/Icon.astro";
import type { Service, Locale } from "@/types";

interface Props { service: Service; locale: Locale }
const { service, locale } = Astro.props;
---

<article class="card">
  <Icon name={service.icon} size={20} />
  <h3>{service.title[locale]}</h3>
  <p>{service.description[locale]}</p>
</article>

<style>
  .card {
    padding: 18px;
    border: var(--border-w) solid var(--color-border);
    background: var(--color-bg-soft);
  }
  h3 { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; margin: 10px 0 6px; }
  p { font-size: 13px; line-height: 1.5; margin: 0; color: var(--color-text-muted); }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/ServiceCard.astro
git commit -m "feat(mol): ServiceCard with icon + title + description"
```

---

### Task 4.2 — Create `ProcessStep.astro` molecule

**Files:**
- Create: `src/components/molecules/ProcessStep.astro`

- [ ] **Step 1 — Create**

```astro
---
interface Props {
  roman: "i" | "ii" | "iii" | "iv";
  title: string;
  desc: string;
}
const { roman, title, desc } = Astro.props;
---

<div class="step">
  <span class="roman">{roman}.</span>
  <div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
</div>

<style>
  .step {
    display: grid;
    grid-template-columns: 36px 1fr;
    gap: 14px;
    padding: 14px 0;
    border-top: 1px dashed var(--color-border);
    align-items: start;
  }
  .step:first-of-type { border-top: none; padding-top: 0; }
  .roman { font-family: var(--font-mono); font-size: 18px; color: var(--color-text-muted); font-weight: 600; }
  h3 { font-size: 15px; font-weight: 700; margin: 0 0 4px; letter-spacing: -0.02em; }
  p { font-size: 13px; line-height: 1.6; color: var(--color-text-muted); margin: 0; }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/ProcessStep.astro
git commit -m "feat(mol): ProcessStep with roman numeral + title + description"
```

---

### Task 4.3 — Create `FAQItem.astro` molecule (with native `<details>`)

**Files:**
- Create: `src/components/molecules/FAQItem.astro`

- [ ] **Step 1 — Create**

```astro
---
interface Props {
  q: string;
  a: string;
  open?: boolean;
}
const { q, a, open = false } = Astro.props;
---

<details class="faq-item" open={open}>
  <summary>
    <span>{q}</span>
    <span class="marker" aria-hidden="true"></span>
  </summary>
  <p>{a}</p>
</details>

<style>
  .faq-item {
    padding: 14px 0;
    border-top: 1px solid var(--color-border);
  }
  .faq-item:first-of-type { border-top: none; padding-top: 0; }
  summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker { display: none; }
  .marker {
    width: 14px;
    height: 14px;
    position: relative;
  }
  .marker::before, .marker::after {
    content: "";
    position: absolute;
    background: var(--color-text);
    inset: 6px 0;
  }
  .marker::after {
    inset: 0 6px;
    transform: rotate(90deg);
    transition: transform 150ms ease-out;
  }
  details[open] .marker::after { transform: rotate(0deg); opacity: 0; }
  details p {
    font-size: 13px;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 8px 0 0;
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/molecules/FAQItem.astro
git commit -m "feat(mol): FAQItem using native <details> with custom marker"
```

---

### Task 4.4 — Page `/collaborer.astro` (FR)

**Files:**
- Create: `src/pages/collaborer.astro`

- [ ] **Step 1 — Create**

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import ServiceCard from "@/components/molecules/ServiceCard.astro";
import ProcessStep from "@/components/molecules/ProcessStep.astro";
import FAQItem from "@/components/molecules/FAQItem.astro";
import StatusBadge from "@/components/atoms/StatusBadge.astro";
import { services } from "@/data/services";
import { faq } from "@/data/faq";

const locale = "fr" as const;
const title = "Collaborer — Aymeric Dijoux, freelance builder à Paris";
const description = "Aymeric Dijoux prend 1 à 2 missions freelance par semestre — mobile, web, prototype IA. Process clair, prix fixes ou TJM, call intro gratuit de 30 min.";
const calcomUrl = import.meta.env.PUBLIC_CALCOM_URL ?? "https://cal.com/aymeric-dijoux/intro";

const processSteps = [
  { roman: "i" as const, title: "Call intro (30 min, gratuit)", desc: "Tu m'expliques le projet, je te dis si je suis le bon profil et combien ça prend." },
  { roman: "ii" as const, title: "Brief écrit (48h)", desc: "Je te renvoie un doc court : scope, timeline, jalons, prix fixe ou TJM." },
  { roman: "iii" as const, title: "Kick-off & build", desc: "Daily ou hebdo en async (Slack/Linear). Démo chaque semaine. Code sur ton GitHub dès le jour 1." },
  { roman: "iv" as const, title: "Ship & transition", desc: "Mise en prod + transmission propre (docs, Loom, repo clean). Support 2 semaines inclus." },
];
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="work" />

  <section class="page-hero">
    <SectionLabel>— COLLABORER</SectionLabel>
    <h1>Construire <Highlight>ensemble</Highlight>, pas juste coder pour toi.</h1>
    <p class="deck">Je prends 1 à 2 missions par semestre, en remote ou Paris. Mobile, web, prototype IA — tout ce qui se ship vite et bien.</p>
    <StatusBadge label="Dispo S2 2026 · 1 slot restant" />
  </section>

  <section class="section">
    <SectionLabel number="01">CE QUE JE FAIS</SectionLabel>
    <h2>Quatre <Highlight>formats</Highlight> de mission</h2>
    <div class="services-grid">
      {services.map((s) => <ServiceCard service={s} locale={locale} />)}
    </div>
  </section>

  <section class="section">
    <SectionLabel number="02">COMMENT ÇA SE PASSE</SectionLabel>
    <h2>Le <Highlight>process</Highlight></h2>
    {processSteps.map((s) => <ProcessStep roman={s.roman} title={s.title} desc={s.desc} />)}
  </section>

  <section class="section">
    <SectionLabel number="03">FAQ</SectionLabel>
    <h2>Les questions <Highlight>qu'on me pose</Highlight></h2>
    {faq.map((item, i) => <FAQItem q={item.q[locale]} a={item.a[locale]} open={i === 0} />)}
  </section>

  <section class="end-cta">
    <h2>On en <Highlight>parle</Highlight> ?</h2>
    <p>30 minutes, gratuit, sans engagement. Si je suis pas le bon profil, je te le dirai et je te recommanderai quelqu'un.</p>
    <a href={calcomUrl} target="_blank" rel="noopener noreferrer" class="cta">RÉSERVER UN CALL →</a>
    <p class="email">Ou par email : <a href="mailto:aymeric@dijoux.dev">aymeric@dijoux.dev</a></p>
  </section>

  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .page-hero { padding: 64px 48px 32px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-content); margin: 0 auto; }
  h1 { font-size: clamp(32px, 6vw, 48px); line-height: 1; font-weight: 700; letter-spacing: -0.04em; margin: 14px 0 14px; }
  .deck { font-size: 17px; line-height: 1.6; color: var(--color-text-muted); max-width: 560px; margin: 0 0 20px; }
  .section { padding: 40px 48px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-content); margin: 0 auto; }
  .section h2 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin: 12px 0 18px; line-height: 1; }
  .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .end-cta { background: var(--color-text); color: var(--color-bg); padding: 56px 48px; text-align: center; }
  .end-cta h2 { font-size: clamp(24px, 5vw, 32px); font-weight: 700; letter-spacing: -0.03em; margin: 0 0 14px; line-height: 1; color: var(--color-bg); }
  .end-cta p { font-size: 14px; color: rgba(246,246,244,0.6); max-width: 460px; margin: 0 auto 20px; line-height: 1.6; }
  .end-cta .cta { display: inline-block; padding: 12px 22px; background: var(--color-accent); color: var(--color-text); font-weight: 700; font-size: 13px; border: var(--border-w) solid var(--color-accent); text-decoration: none; }
  .end-cta .email { margin-top: 16px; font-size: 12px; font-family: var(--font-mono); }
  .end-cta .email a { color: var(--color-accent); text-decoration: underline; }
  @media (max-width: 720px) {
    .page-hero, .section, .end-cta { padding-left: 20px; padding-right: 20px; }
    .services-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/collaborer.astro
git commit -m "feat(work): /collaborer page FR with services, process, FAQ, Cal.com end CTA"
```

---

### Task 4.5 — Page `/en/work.astro` (EN mirror)

**Files:**
- Create: `src/pages/en/work.astro`

- [ ] **Step 1 — Create** (same structure, EN labels)

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import ServiceCard from "@/components/molecules/ServiceCard.astro";
import ProcessStep from "@/components/molecules/ProcessStep.astro";
import FAQItem from "@/components/molecules/FAQItem.astro";
import StatusBadge from "@/components/atoms/StatusBadge.astro";
import { services } from "@/data/services";
import { faq } from "@/data/faq";

const locale = "en" as const;
const title = "Work together — Aymeric Dijoux, freelance builder in Paris";
const description = "Aymeric Dijoux takes 1-2 freelance missions per half-year — mobile, web, AI prototype. Clear process, fixed price or day rate, free 30-min intro call.";
const calcomUrl = import.meta.env.PUBLIC_CALCOM_URL ?? "https://cal.com/aymeric-dijoux/intro";

const processSteps = [
  { roman: "i" as const, title: "Intro call (30 min, free)", desc: "You explain the project, I tell you if I'm the right fit and how long it takes." },
  { roman: "ii" as const, title: "Written brief (48h)", desc: "I send a short doc: scope, timeline, milestones, fixed price or day rate." },
  { roman: "iii" as const, title: "Kick-off & build", desc: "Async daily or weekly (Slack/Linear). Demo each week. Code on your GitHub from day 1." },
  { roman: "iv" as const, title: "Ship & handover", desc: "Production rollout + clean handover (docs, Loom, clean repo). 2 weeks of support included." },
];
---

<MainLayout title={title} description={description} locale={locale}>
  <Nav slot="nav" locale={locale} current="work" />

  <section class="page-hero">
    <SectionLabel>— WORK TOGETHER</SectionLabel>
    <h1>Building <Highlight>with you</Highlight>, not just for you.</h1>
    <p class="deck">I take 1-2 missions per half-year, remote or Paris. Mobile, web, AI prototype — anything that ships fast and well.</p>
    <StatusBadge label="Available H2 2026 · 1 slot left" />
  </section>

  <section class="section">
    <SectionLabel number="01">WHAT I DO</SectionLabel>
    <h2>Four <Highlight>mission formats</Highlight></h2>
    <div class="services-grid">
      {services.map((s) => <ServiceCard service={s} locale={locale} />)}
    </div>
  </section>

  <section class="section">
    <SectionLabel number="02">HOW IT WORKS</SectionLabel>
    <h2>The <Highlight>process</Highlight></h2>
    {processSteps.map((s) => <ProcessStep roman={s.roman} title={s.title} desc={s.desc} />)}
  </section>

  <section class="section">
    <SectionLabel number="03">FAQ</SectionLabel>
    <h2>The questions <Highlight>I hear most</Highlight></h2>
    {faq.map((item, i) => <FAQItem q={item.q[locale]} a={item.a[locale]} open={i === 0} />)}
  </section>

  <section class="end-cta">
    <h2>Let's <Highlight>talk</Highlight>?</h2>
    <p>30 minutes, free, no commitment. If I'm not the right fit, I'll tell you and recommend someone.</p>
    <a href={calcomUrl} target="_blank" rel="noopener noreferrer" class="cta">BOOK A CALL →</a>
    <p class="email">Or by email: <a href="mailto:aymeric@dijoux.dev">aymeric@dijoux.dev</a></p>
  </section>

  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .page-hero { padding: 64px 48px 32px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-content); margin: 0 auto; }
  h1 { font-size: clamp(32px, 6vw, 48px); line-height: 1; font-weight: 700; letter-spacing: -0.04em; margin: 14px 0 14px; }
  .deck { font-size: 17px; line-height: 1.6; color: var(--color-text-muted); max-width: 560px; margin: 0 0 20px; }
  .section { padding: 40px 48px; border-bottom: var(--border-w) solid var(--color-border); max-width: var(--container-content); margin: 0 auto; }
  .section h2 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin: 12px 0 18px; line-height: 1; }
  .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .end-cta { background: var(--color-text); color: var(--color-bg); padding: 56px 48px; text-align: center; }
  .end-cta h2 { font-size: clamp(24px, 5vw, 32px); font-weight: 700; letter-spacing: -0.03em; margin: 0 0 14px; line-height: 1; color: var(--color-bg); }
  .end-cta p { font-size: 14px; color: rgba(246,246,244,0.6); max-width: 460px; margin: 0 auto 20px; line-height: 1.6; }
  .end-cta .cta { display: inline-block; padding: 12px 22px; background: var(--color-accent); color: var(--color-text); font-weight: 700; font-size: 13px; border: var(--border-w) solid var(--color-accent); text-decoration: none; }
  .end-cta .email { margin-top: 16px; font-size: 12px; font-family: var(--font-mono); }
  .end-cta .email a { color: var(--color-accent); text-decoration: underline; }
  @media (max-width: 720px) {
    .page-hero, .section, .end-cta { padding-left: 20px; padding-right: 20px; }
    .services-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/en/work.astro
git commit -m "feat(work): /en/work EN mirror"
```

---

### Task 4.6 — Create `lib/jsonLd.ts` builders

**Files:**
- Create: `src/lib/jsonLd.ts`

- [ ] **Step 1 — Create**

```ts
import type { Locale } from "@/types";
import { SITE_URL, SITE_NAME, PERSON_ID, WEBSITE_ID } from "./constants";
import { socialLinks } from "@/data/socialLinks";
import { projects } from "@/data/projects";

const KNOWS_ABOUT = [
  "Indie hacking",
  "Consumer app development",
  "React Native",
  "Flutter",
  "Astro",
  "Next.js",
  "AI products",
  "Supabase",
  "Mobile app design",
  "TypeScript",
];

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    givenName: "Aymeric",
    familyName: "Dijoux",
    jobTitle: "Indie builder & software engineer",
    description:
      "Aymeric Dijoux is an indie builder and software engineer based in Paris, building and shipping consumer apps (VoiceJournal, Caroubolt, Tookta) and helping select teams as a freelancer.",
    url: SITE_URL,
    image: `${SITE_URL}/avatar.webp`,
    homeLocation: { "@type": "Place", name: "Paris, France" },
    knowsAbout: KNOWS_ABOUT,
    sameAs: socialLinks.map((l) => l.url),
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": PERSON_ID },
    inLanguage: ["fr-FR", "en-US"],
  };
}

export function buildSoftwareAppJsonLd() {
  return projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#app-${project.slug}`,
    name: project.title,
    description: project.tagline.en,
    url: project.url,
    operatingSystem: project.platform.join(", "),
    applicationCategory: "Productivity",
    creator: { "@id": PERSON_ID },
  }));
}

export function buildBlogPostingJsonLd(args: {
  title: string;
  description: string;
  url: string;
  datePublished: Date;
  locale: Locale;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    url: args.url,
    datePublished: args.datePublished.toISOString(),
    inLanguage: args.locale === "fr" ? "fr-FR" : "en-US",
    keywords: args.tags.join(", "),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
```

- [ ] **Step 2 — Commit**

```bash
git add src/lib/jsonLd.ts
git commit -m "feat(lib): JSON-LD builders for Person, WebSite, Software, Blog, FAQ, Breadcrumb"
```

---

### Task 4.7 — Create `JsonLd.astro` atom

**Files:**
- Create: `src/components/atoms/JsonLd.astro`

- [ ] **Step 1 — Create**

```astro
---
interface Props {
  data: object | object[];
}
const { data } = Astro.props;
const serialized = JSON.stringify(data);
---

<script type="application/ld+json" set:html={serialized} />
```

- [ ] **Step 2 — Commit**

```bash
git add src/components/atoms/JsonLd.astro
git commit -m "feat(atom): JsonLd injector"
```

---

### Task 4.8 — Inject JSON-LD on home, about, articles, collaborer

**Files:**
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro`, `src/pages/a-propos.astro`, `src/pages/en/about.astro`, `src/pages/collaborer.astro`, `src/pages/en/work.astro`, `src/layouts/NoteLayout.astro`

- [ ] **Step 1 — Home FR + EN** : ajouter dans le slot `head` du `<MainLayout>` :

```astro
import JsonLd from "@/components/atoms/JsonLd.astro";
import { buildPersonJsonLd, buildWebSiteJsonLd, buildSoftwareAppJsonLd } from "@/lib/jsonLd";
// ... existing imports

<MainLayout ...>
  <Fragment slot="head">
    <JsonLd data={[buildPersonJsonLd(), buildWebSiteJsonLd(), ...buildSoftwareAppJsonLd()]} />
  </Fragment>
  ...
</MainLayout>
```

- [ ] **Step 2 — About FR + EN** : injecter Person + Breadcrumb

```astro
import { buildPersonJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonLd";

<Fragment slot="head">
  <JsonLd data={[
    buildPersonJsonLd(),
    buildBreadcrumbJsonLd([
      { name: "Accueil", url: "https://aymeric.dijoux.dev/" },
      { name: "À propos", url: "https://aymeric.dijoux.dev/a-propos" },
    ]),
  ]} />
</Fragment>
```

(Idem en EN avec "Home" / "About" et URLs `/en/`.)

- [ ] **Step 3 — Collaborer FR + EN** : injecter Person + FAQPage

```astro
import { buildPersonJsonLd, buildFAQJsonLd } from "@/lib/jsonLd";
import { faq } from "@/data/faq";

<Fragment slot="head">
  <JsonLd data={[
    buildPersonJsonLd(),
    buildFAQJsonLd(faq.map((f) => ({ q: f.q[locale], a: f.a[locale] }))),
  ]} />
</Fragment>
```

- [ ] **Step 4 — NoteLayout** : injecter BlogPosting + Person + Breadcrumb

Ajouter dans le frontmatter de `NoteLayout.astro` :
```ts
import { buildBlogPostingJsonLd, buildPersonJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/constants";

const jsonLd = [
  buildPersonJsonLd(),
  buildBlogPostingJsonLd({
    title,
    description,
    url: Astro.url.href,
    datePublished: date,
    locale,
    tags,
  }),
  buildBreadcrumbJsonLd([
    { name: locale === "fr" ? "Accueil" : "Home", url: locale === "fr" ? SITE_URL + "/" : SITE_URL + "/en/" },
    { name: locale === "fr" ? "Notes" : "Writing", url: locale === "fr" ? SITE_URL + "/notes" : SITE_URL + "/en/writing" },
    { name: title, url: Astro.url.href },
  ]),
];
```

Puis dans le slot `head` du `<MainLayout>` du `NoteLayout` :
```astro
<Fragment slot="head"><JsonLd data={jsonLd} /></Fragment>
```

- [ ] **Step 5 — Verify**

```bash
npm run build
grep -r "application/ld+json" dist/ | wc -l
```

Expected: ≥ 8 pages have JSON-LD.

- [ ] **Step 6 — Commit**

```bash
git add src/pages/ src/layouts/NoteLayout.astro
git commit -m "feat(geo): inject Person/WebSite/Software/Article/FAQ JSON-LD across pages"
```

---

### Task 4.9 — Create `/robots.txt`

**Files:**
- Create: `src/pages/robots.txt.ts`

- [ ] **Step 1 — Create**

```ts
import type { APIContext } from "astro";
import { SITE_URL } from "@/lib/constants";

const AI_AGENTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "anthropic-ai", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export async function GET(_ctx: APIContext) {
  const body = [
    "# robots.txt — aymeric.dijoux.dev",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    ...AI_AGENTS.flatMap((ua) => [`User-agent: ${ua}`, "Allow: /", ""]),
    "User-agent: Bytespider",
    "Disallow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/robots.txt.ts
git commit -m "feat(geo): robots.txt explicit allow for AI crawlers + sitemap link"
```

---

### Task 4.10 — Create `/llms.txt` and `/llms-full.txt`

**Files:**
- Create: `src/pages/llms.txt.ts`
- Create: `src/pages/llms-full.txt.ts`

- [ ] **Step 1 — Create `llms.txt.ts`**

```ts
import type { APIContext } from "astro";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { loadPublishedNotes } from "@/lib/notes";

export async function GET(_ctx: APIContext) {
  const frNotes = await loadPublishedNotes("fr");
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${profile.bio.en}`,
    "",
    "## About",
    "- Aymeric Dijoux — indie builder & software engineer based in Paris",
    "- Builds consumer apps: VoiceJournal, Caroubolt, Tookta",
    "- Available for select freelance projects (mobile, web, AI prototypes)",
    "",
    "## Apps",
    ...projects.map((p) => `- [${p.title}](${p.url}): ${p.tagline.en}`),
    "",
    "## Key pages",
    `- [Home](${SITE_URL}/): apps showcase, latest writing, freelance pitch`,
    `- [About](${SITE_URL}/en/about): path, philosophy, stack`,
    `- [Writing](${SITE_URL}/en/writing): notes and essays`,
    `- [Work together](${SITE_URL}/en/work): services, process, FAQ, booking`,
    "",
    "## Latest writing",
    ...frNotes.slice(0, 5).map((n) => `- [${n.data.title}](${SITE_URL}/notes/${n.slug})`),
    "",
    "## Contact",
    `- Email: ${profile.email ?? "aymeric@dijoux.dev"}`,
    `- Book a call: https://cal.com/aymeric-dijoux/intro`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```

- [ ] **Step 2 — Create `llms-full.txt.ts`** (concatène les contenus EN clés)

```ts
import type { APIContext } from "astro";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { services } from "@/data/services";
import { loadPublishedNotes } from "@/lib/notes";

export async function GET(_ctx: APIContext) {
  const enNotes = await loadPublishedNotes("en");
  const parts: string[] = [];

  parts.push(`# ${SITE_NAME}\n\n${profile.bio.en}\n`);
  parts.push(`## Apps\n`);
  projects.forEach((p) => {
    parts.push(`### ${p.title}\n${p.tagline.en}\nURL: ${p.url}\nStack: ${p.techStack.join(", ")}\n`);
  });

  parts.push(`## Stack\n`);
  stack.forEach((s) => parts.push(`- ${s.category.en}: ${s.items.join(", ")}`));

  parts.push(`\n## Services\n`);
  services.forEach((s) => parts.push(`### ${s.title.en}\n${s.description.en}\n`));

  parts.push(`\n## Recent writing\n`);
  enNotes.forEach((n) => {
    parts.push(`### ${n.data.title} (${n.data.date.toISOString().slice(0, 10)})\n${n.data.excerpt}\nURL: ${SITE_URL}/en/writing/${n.slug}\n`);
  });

  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```

- [ ] **Step 3 — Commit**

```bash
git add src/pages/llms.txt.ts src/pages/llms-full.txt.ts
git commit -m "feat(geo): llms.txt summary + llms-full.txt exhaustive for AI ingestion"
```

---

### Task 4.11 — Create `/ai.txt`

**Files:**
- Create: `src/pages/ai.txt.ts`

- [ ] **Step 1 — Create**

```ts
import type { APIContext } from "astro";
import { SITE_URL } from "@/lib/constants";

export async function GET(_ctx: APIContext) {
  const body = [
    "# ai.txt — AI usage policy for aymeric.dijoux.dev",
    "",
    "User-agent: *",
    "Allow: training, search-indexing, citation",
    "",
    `Contact: aymeric@dijoux.dev`,
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```

- [ ] **Step 2 — Commit**

```bash
git add src/pages/ai.txt.ts
git commit -m "feat(geo): ai.txt policy allowing training and citation"
```

---

### Task 4.12 — Static OG images (home + default)

**Files:**
- Create: `src/pages/og/home.png.ts`
- Create: `src/pages/og/default.png.ts`
- Create: `src/lib/ogImage.ts`

- [ ] **Step 1 — Create `lib/ogImage.ts`**

```ts
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { html } from "satori-html";
import fs from "node:fs";
import path from "node:path";

let interBoldBuffer: Buffer | null = null;
let monoBuffer: Buffer | null = null;

function loadFonts() {
  if (interBoldBuffer && monoBuffer) return { interBoldBuffer, monoBuffer };
  const interPath = path.resolve("node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2");
  const monoPath = path.resolve("node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2");
  // For Satori, we need TTF/OTF. Use fallback system fonts in dev; in production add real .ttf files into src/assets/fonts/.
  // Simpler V1: bundle Inter Tight TTF manually under src/assets/fonts/.
  interBoldBuffer = fs.readFileSync(path.resolve("src/assets/fonts/InterTight-Bold.ttf"));
  monoBuffer = fs.readFileSync(path.resolve("src/assets/fonts/JetBrainsMono-Regular.ttf"));
  return { interBoldBuffer, monoBuffer };
}

export async function renderOg(args: { title: string; subtitle: string }): Promise<Buffer> {
  const { interBoldBuffer, monoBuffer } = loadFonts();
  const markup = html(`
    <div style="display:flex;flex-direction:column;justify-content:space-between;width:1200px;height:630px;padding:64px;background:#f6f6f4;border:8px solid #0a0a0a;font-family:Inter;color:#0a0a0a;">
      <div style="font-family:Mono;font-size:18px;letter-spacing:.1em;">AYMERIC.DIJOUX.DEV</div>
      <div style="font-size:80px;line-height:.95;font-weight:700;letter-spacing:-0.04em;">${args.title}</div>
      <div style="font-family:Mono;font-size:18px;color:#404040;">${args.subtitle}</div>
    </div>
  `);
  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: interBoldBuffer, weight: 700, style: "normal" },
      { name: "Mono", data: monoBuffer, weight: 400, style: "normal" },
    ],
  });
  return new Resvg(svg).render().asPng();
}
```

- [ ] **Step 2 — Add fonts to `src/assets/fonts/`** (Aymeric : récupérer TTF Inter Tight Bold et JetBrains Mono Regular et les placer dans ce dossier)

- [ ] **Step 3 — Create `pages/og/home.png.ts`**

```ts
import type { APIContext } from "astro";
import { renderOg } from "@/lib/ogImage";

export async function GET(_ctx: APIContext) {
  const png = await renderOg({
    title: "I build the apps I wish existed.",
    subtitle: "AYMERIC DIJOUX · INDIE BUILDER · PARIS",
  });
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}
```

- [ ] **Step 4 — Create `pages/og/default.png.ts`**

```ts
import type { APIContext } from "astro";
import { renderOg } from "@/lib/ogImage";

export async function GET(_ctx: APIContext) {
  const png = await renderOg({
    title: "Aymeric Dijoux",
    subtitle: "INDIE BUILDER · ENGINEER · FOUNDER",
  });
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}
```

- [ ] **Step 5 — Commit**

```bash
git add src/pages/og/ src/lib/ogImage.ts
git commit -m "feat(og): static home + default OG images via Satori"
```

---

### Task 4.13 — Dynamic OG per article

**Files:**
- Create: `src/pages/notes/og/[slug].png.ts`

- [ ] **Step 1 — Create**

```ts
import type { APIContext } from "astro";
import { renderOg } from "@/lib/ogImage";
import { loadPublishedNotes } from "@/lib/notes";

export async function getStaticPaths() {
  const fr = await loadPublishedNotes("fr");
  const en = await loadPublishedNotes("en");
  return [...fr, ...en].map((note) => ({ params: { slug: note.slug }, props: { note } }));
}

export async function GET({ props }: APIContext & { props: { note: any } }) {
  const png = await renderOg({
    title: props.note.data.title,
    subtitle: `${props.note.data.locale.toUpperCase()} · ${props.note.data.date.toISOString().slice(0, 10)}`,
  });
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}
```

- [ ] **Step 2 — Update NoteLayout to use it**

In `src/layouts/NoteLayout.astro`, pass `ogImage={\`/notes/og/${slug}.png\`}` to MainLayout. Add a `slug` prop to NoteLayout:

```astro
// In NoteLayout.astro interface Props { ... slug: string }
// Pass to MainLayout: <MainLayout title={...} description={...} locale={locale} pageType="article" ogImage={`/notes/og/${slug}.png`}>
```

And in `src/pages/notes/[slug].astro` and `src/pages/en/writing/[slug].astro`, pass `slug={note.slug}` to NoteLayout.

- [ ] **Step 3 — Commit**

```bash
git add src/pages/notes/og/ src/layouts/NoteLayout.astro src/pages/notes/\[slug\].astro src/pages/en/writing/\[slug\].astro
git commit -m "feat(og): dynamic OG image per article via Satori"
```

---

### Task 4.14 — Scroll-reveal animations (respecting reduced motion)

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/layouts/MainLayout.astro`

- [ ] **Step 1 — Add CSS in `global.css`**

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 2 — Add Intersection Observer in MainLayout `<head>` (before `</body>`)**

```astro
<script>
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  }
</script>
```

- [ ] **Step 3 — Annotate key sections with `data-reveal`** in Hero, AppsGrid, AboutExcerpt, NotesSection, CollabBand (just add `data-reveal` attribute on the `<section>` root).

- [ ] **Step 4 — Commit**

```bash
git add src/styles/global.css src/layouts/MainLayout.astro src/components/organisms/
git commit -m "feat(motion): scroll-reveal via Intersection Observer with reduced-motion respect"
```

---

### Task 4.15 — JSON-LD validation script

**Files:**
- Create: `scripts/validate-jsonld.mjs`

- [ ] **Step 1 — Create**

```js
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const required = ["Person", "WebSite"];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

let failed = 0;
for await (const file of walk(DIST)) {
  const html = await readFile(file, "utf8");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const types = new Set();
  for (const [, body] of blocks) {
    try {
      const data = JSON.parse(body);
      const arr = Array.isArray(data) ? data : [data];
      arr.forEach((node) => node["@type"] && types.add(node["@type"]));
    } catch (e) {
      console.error(`✗ ${file} — invalid JSON-LD: ${e.message}`);
      failed++;
    }
  }
  // Only check pages that are real public pages (skip 404, rss, etc.)
  if (file.endsWith("index.html") && !types.has("Person")) {
    console.error(`✗ ${file} — missing Person JSON-LD`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} JSON-LD issue(s) found`);
  process.exit(1);
} else {
  console.log("✓ JSON-LD validation passed");
}
```

- [ ] **Step 2 — Add npm script**

In `package.json`:
```json
"scripts": {
  ...,
  "validate:jsonld": "node scripts/validate-jsonld.mjs"
}
```

- [ ] **Step 3 — Verify**

```bash
npm run build && npm run validate:jsonld
```

Expected: "✓ JSON-LD validation passed".

- [ ] **Step 4 — Commit**

```bash
git add scripts/validate-jsonld.mjs package.json
git commit -m "feat(ci): JSON-LD validation script"
```

---

### Task 4.16 — Lighthouse + axe CI workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `lighthouserc.json`
- Create: `tests/axe.spec.ts` + `playwright.config.ts`

- [ ] **Step 1 — Create `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "dist",
      "url": [
        "http://localhost/index.html",
        "http://localhost/a-propos/index.html",
        "http://localhost/notes/index.html",
        "http://localhost/collaborer/index.html"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1 }]
      }
    }
  }
}
```

- [ ] **Step 2 — Create `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  webServer: {
    command: "npx http-server dist -p 4321 -s",
    port: 4321,
    reuseExistingServer: true,
  },
  use: { baseURL: "http://localhost:4321" },
});
```

- [ ] **Step 3 — Create `tests/axe.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/a-propos", "/notes", "/collaborer", "/en/", "/en/about", "/en/writing", "/en/work"];

for (const route of ROUTES) {
  test(`a11y — ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
```

- [ ] **Step 4 — Install `http-server`**

```bash
npm install -D http-server
```

- [ ] **Step 5 — Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run astro check
      - run: npx eslint "src/**/*.{js,ts,astro}"
      - run: npx prettier --check "src/**/*.{astro,ts,css,md}"
      - run: npm run build
      - run: npm run validate:jsonld
      - run: npx playwright test
      - run: npx lhci autorun
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 6 — Commit**

```bash
git add .github/ lighthouserc.json playwright.config.ts tests/ package.json package-lock.json
git commit -m "ci: lighthouse + axe + jsonld validation + gh-pages deploy"
```

---

### Task 4.17 — Final manual QA checklist

- [ ] **Step 1 — Local build & preview**

```bash
npm run build && npm run preview
```

Open http://localhost:4321 and walk through every page.

- [ ] **Step 2 — Run the full CI gate locally**

```bash
npm run astro check
npm run build
npm run validate:jsonld
npx playwright test
npx lhci autorun
```

Expected: all green.

- [ ] **Step 3 — Manual visual QA**
  - [ ] Home FR + EN render D1 properly (Inter Tight, fluo highlight, 2px borders, mono pills)
  - [ ] Dark mode toggle works on all pages
  - [ ] Lang toggle works on all pages
  - [ ] Scroll-reveal animations subtle and unobtrusive
  - [ ] `prefers-reduced-motion` (DevTools → Rendering → Emulate) kills animations
  - [ ] Mobile (360px wide) layout holds without overflow
  - [ ] Tab through home — focus rings visible everywhere
  - [ ] Skip-link visible on first Tab press
  - [ ] All external links open in new tab with `noopener`
  - [ ] Cal.com link on /collaborer works
  - [ ] `/rss.xml`, `/en/rss.xml`, `/sitemap-index.xml`, `/robots.txt`, `/llms.txt`, `/ai.txt` all return 200 with correct content-type

---

### Task 4.18 — Deploy to production

- [ ] **Step 1 — Configure GitHub Pages**
  - Repository → Settings → Pages → Source = "GitHub Actions"
  - Confirm custom domain shows `aymeric.dijoux.dev`
  - Enforce HTTPS checked

- [ ] **Step 2 — DNS check**

```bash
dig aymeric.dijoux.dev +short
```

Expected: should resolve to GitHub Pages IPs (185.199.108.153 family).

- [ ] **Step 3 — Push to main**

```bash
git push origin main
```

Wait for CI to complete. Lighthouse + axe + JSON-LD all pass.

- [ ] **Step 4 — Verify production**

```bash
curl -I https://aymeric.dijoux.dev/
curl -s https://aymeric.dijoux.dev/llms.txt | head -20
curl -s https://aymeric.dijoux.dev/robots.txt
```

Open https://aymeric.dijoux.dev and validate all pages end-to-end.

- [ ] **Step 5 — Submit sitemap to Google Search Console + Bing Webmaster Tools** (manual, one-time)

- [ ] **Step 6 — Final commit (CHANGELOG or notes if relevant)**

```bash
git commit --allow-empty -m "release: portfolio v1.0 live on aymeric.dijoux.dev"
git tag v1.0
git push origin main --tags
```

---

## 🛑 Phase 04 — Final review checkpoint

- [ ] Production live sur https://aymeric.dijoux.dev
- [ ] Lighthouse Performance ≥ 95, A11y = 100, BP ≥ 95, SEO = 100 sur les 4 pages clés (mobile + desktop)
- [ ] axe-core : 0 violation sur toutes les routes critiques (FR + EN)
- [ ] JSON-LD valide partout (Person + WebSite + Article/FAQ selon page)
- [ ] `/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/robots.txt` accessibles
- [ ] Sitemap.xml présent avec hreflang
- [ ] OG images dynamiques sur articles fonctionnent (test : ouvrir un article et inspecter `<meta property="og:image">`)
- [ ] Dark mode + FR↔EN switching fluides
- [ ] Cal.com link sur /collaborer ouvre la page de booking
- [ ] Tous les commits sont sur main
- [ ] Tag `v1.0` créé

🚀 Portfolio V1 livré.

---

## Self-review

**Spec coverage** (vérification manuelle) :
- [✓] Section 1 Overview → tasks couvrent toutes les success criteria
- [✓] Section 2 In scope → 4 pages + i18n + dark mode + content collections + Cal.com + RSS + OG dynamiques + sitemap + view transitions = couverts
- [✓] Section 3 IA → sitemap + slugs i18n FR/EN couvertes via i18n/ui.ts + routes constants
- [✓] Section 4 Page specs → Home, About, Notes, Collaborer toutes implémentées avec leurs sections
- [✓] Section 5 Visual system → tokens D1 dans theme.css, Highlight/SectionLabel/Buttons composants créés
- [✓] Section 6 Tech architecture → deps installées, config Astro, Tailwind 4 @theme, Zod schema avec translationKey
- [✓] Section 7.1 Performance → Lighthouse CI avec budget 95/100/95/100
- [✓] Section 7.2 A11y → @axe-core/playwright sur 8 routes, focus rings, skip-link, reduced-motion, landmarks
- [✓] Section 7.3 SEO → hreflang, OG, canonical, Twitter Card
- [✓] Section 7.4 GEO → llms.txt + llms-full.txt + ai.txt + robots.txt + JSON-LD entity graph
- [✓] Section 7.5 Analytics → différée (decision open per spec)
- [✓] Section 7.6 Tests & CI → workflow GH Actions complet

**Placeholders scan** : aucun "TBD" ou "à compléter" dans les tâches.

**Type consistency** : `NoteEntry`, `Locale`, `Profile`, `Project` etc. cohérents entre tasks.

**Spec exigences ouvertes** : analytics, tarifs Collaborer, shiki theme — restent open decisions, mentionnées dans `## Open decisions` du spec, non bloquantes pour V1.

---

## Execution

Plan complete and saved to `docs/superpowers/plans/2026-05-21-portfolio.md`. Two execution options:

1. **Subagent-Driven (recommended)** — un subagent frais par tâche, review entre tâches, itération rapide. Idéal pour avancer en parallèle sur des tâches indépendantes.

2. **Inline Execution** — exécution dans cette session via `executing-plans`, batches avec checkpoints. Idéal si tu veux suivre pas à pas et garder le contexte conversationnel.

**Which approach?**
