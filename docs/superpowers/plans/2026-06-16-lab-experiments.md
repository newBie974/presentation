# Lab Experiments Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight "Lab" surface (page `/lab` + `/en/lab`, home teaser, footer link) that showcases experimental GitHub Pages mini-apps from a manual data file, distinct from the premium product grid.

**Architecture:** Mirror the existing `projects.ts` → `AppsGrid`/`AppCell` pattern with a leaner `experiments.ts` → `LabGrid`/`LabCell`. Pure static Astro, bilingual via the existing i18n `routes`/`ui` maps and the `routeKey` hreflang system. No new dependencies, no Content Collection, no GitHub API.

**Tech Stack:** Astro 5 (static), TypeScript strict, Tailwind 4 `@theme` tokens, `@astrojs/sitemap`. Verification: `astro check`, `npm run build` + grep `dist/`, `npm run validate:jsonld`, `npm run validate:contrast`. (No Vitest in this project — do NOT add it.)

**Source spec:** `docs/superpowers/specs/2026-06-16-lab-experiments-design.md`

**Conventions to respect (from CLAUDE.md):**

- Astro component ≤ 150 lines, `.ts` ≤ 120 lines, function ≤ 20 lines.
- No hardcoded colors outside `theme.css` — use existing tokens only.
- No hardcoded internal hrefs — use `t.path(...)` / the `routes` map.
- No hardcoded UI strings — add keys to `src/i18n/ui.ts` (both locales). Exception: the footer already hardcodes acronym-style link text (`RSS`, `SITEMAP`); `LAB` follows that same existing pattern.
- Import order: framework → external → internal (`@/`) → `import type`.

---

## File Structure

**Create:**

- `src/data/experiments.ts` — the experiments data array (seed: World Cup IA Prono).
- `src/lib/experiments.ts` — `loadExperiments(limit?)`: sort by date desc, optional slice.
- `src/components/molecules/LabCell.astro` — one experiment card (leaner/flatter than `AppCell`).
- `src/components/organisms/LabGrid.astro` — grid of `LabCell`, with optional header + "see all" link (serves both the full page and the home teaser).
- `src/pages/lab.astro` — `/lab` (FR).
- `src/pages/en/lab.astro` — `/en/lab` (EN).

**Modify:**

- `src/types/index.ts` — add `Experiment` interface.
- `src/i18n/ui.ts` — add `lab` route (both locales) + UI strings.
- `src/lib/jsonLd.ts` — add `buildLabItemListJsonLd(locale)`.
- `src/components/organisms/Footer.astro` — add the Lab link.
- `src/pages/index.astro` + `src/pages/en/index.astro` — insert the home teaser.
- `astro.config.mjs` — add the `/lab` ↔ `/en/lab` sitemap pair.
- `src/pages/llms.txt.ts` — add a "Key pages" line for the Lab.

---

## Task 1: Data foundation (type + data + loader)

**Files:**

- Modify: `src/types/index.ts` (add `Experiment` after the `Project` interface)
- Create: `src/data/experiments.ts`
- Create: `src/lib/experiments.ts`

- [ ] **Step 1: Add the `Experiment` type**

In `src/types/index.ts`, add immediately after the closing `}` of the `Project` interface:

```typescript
export interface Experiment {
  slug: string;
  title: string;
  tagline: { fr: string; en: string };
  url: string;
  date: string; // "YYYY-MM" — used for descending sort
  techStack: string[];
  repoUrl?: string;
}
```

- [ ] **Step 2: Create the data file**

Create `src/data/experiments.ts`:

```typescript
import type { Experiment } from "@/types";

export const experiments: Experiment[] = [
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
  },
];
```

> Note: confirm the real `techStack` with Aymeric; the value above is a reasonable default and does not block the build.

- [ ] **Step 3: Create the loader**

Create `src/lib/experiments.ts`:

```typescript
import { experiments } from "@/data/experiments";
import type { Experiment } from "@/types";

export function loadExperiments(limit?: number): Experiment[] {
  const sorted = [...experiments].sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
```

- [ ] **Step 4: Verify types pass**

Run: `npx astro check`
Expected: `0 errors, 0 warnings` (the existing 2 hints are pre-existing and fine).

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/data/experiments.ts src/lib/experiments.ts
git commit -m "feat(lab): add Experiment type, data file, and loader"
```

---

## Task 2: i18n routes + strings

**Files:**

- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Add UI strings to the FR block**

In `src/i18n/ui.ts`, in the `fr:` object, add these keys right after the `"cta.visitSite": "Voir le site",` line:

```typescript
    "cta.demo": "Démo",
    "cta.code": "Code",
    "cta.viewAllLab": "Voir tout le lab",
    "section.lab": "Le lab",
```

- [ ] **Step 2: Add the same keys to the EN block**

In the `en:` object, right after `"cta.visitSite": "Visit site",`:

```typescript
    "cta.demo": "Demo",
    "cta.code": "Code",
    "cta.viewAllLab": "See the whole lab",
    "section.lab": "The lab",
```

- [ ] **Step 3: Add the `lab` route to both locales**

In the `routes` object, add `lab` to each locale. Replace:

```typescript
  fr: {
    home: "/",
    about: "/a-propos",
    notes: "/notes",
    work: "/collaborer",
    now: "/now",
  },
  en: {
    home: "/en/",
    about: "/en/about",
    notes: "/en/writing",
    work: "/en/work",
    now: "/en/now",
  },
```

with:

```typescript
  fr: {
    home: "/",
    about: "/a-propos",
    notes: "/notes",
    work: "/collaborer",
    now: "/now",
    lab: "/lab",
  },
  en: {
    home: "/en/",
    about: "/en/about",
    notes: "/en/writing",
    work: "/en/work",
    now: "/en/now",
    lab: "/en/lab",
  },
```

- [ ] **Step 4: Verify types pass**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`. (The `satisfies Record<Locale, Record<string,string>>` constraint confirms both locales have identical keys; `routeKey="lab"` and `t.path("lab")` are now valid types.)

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat(lab): add lab route and i18n strings"
```

---

## Task 3: LabCell + LabGrid components

**Files:**

- Create: `src/components/molecules/LabCell.astro`
- Create: `src/components/organisms/LabGrid.astro`

- [ ] **Step 1: Create `LabCell.astro`**

Create `src/components/molecules/LabCell.astro` (tokens only — no hardcoded colors; flatter than `AppCell` to read as "experiment, not product"):

```astro
---
import { useTranslations } from "@/i18n/utils";
import type { Experiment, Locale } from "@/types";

interface Props {
  experiment: Experiment;
  locale: Locale;
}

const { experiment, locale } = Astro.props;
const t = useTranslations(locale);
---

<article class="lab-cell">
  <div class="top">
    <h3 class="name">
      <a href={experiment.url} target="_blank" rel="noopener noreferrer">
        {experiment.title}
      </a>
    </h3>
    <span class="date">{experiment.date}</span>
  </div>
  <p class="desc">{experiment.tagline[locale]}</p>
  <ul class="tech" role="list">
    {experiment.techStack.slice(0, 3).map((tech) => <li>{tech}</li>)}
  </ul>
  <div class="links">
    <a href={experiment.url} target="_blank" rel="noopener noreferrer">
      {t("cta.demo")} ↗
    </a>
    {
      experiment.repoUrl && (
        <a href={experiment.repoUrl} target="_blank" rel="noopener noreferrer">
          {t("cta.code")} ↗
        </a>
      )
    }
  </div>
</article>

<style>
  .lab-cell {
    display: flex;
    flex-direction: column;
    padding: 16px 18px;
    background: var(--color-bg-soft);
    border: 1px solid color-mix(in srgb, var(--color-border) 14%, transparent);
    border-radius: var(--radius-card);
    color: var(--color-text);
    transition: transform 150ms ease;
  }
  .lab-cell:hover {
    transform: translateY(-3px);
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 6px;
  }
  .name {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .name a {
    color: inherit;
    text-decoration: none;
  }
  .name a:hover {
    background: var(--color-accent);
    color: var(--color-on-accent);
    padding: 0 4px;
    margin: 0 -4px;
    border-radius: 5px;
  }
  .date {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-text-muted);
    white-space: nowrap;
  }
  .desc {
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--color-text-muted);
    margin: 0 0 12px;
  }
  .tech {
    list-style: none;
    margin: 0 0 14px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .tech li {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-text-muted);
    padding: 3px 8px;
    background: var(--color-bg);
    border: 1px solid color-mix(in srgb, var(--color-border) 10%, transparent);
    border-radius: var(--radius-pill);
  }
  .links {
    margin-top: auto;
    display: flex;
    gap: 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .links a {
    color: var(--color-text);
    text-decoration: none;
    border-bottom: 1px solid var(--color-accent);
    padding-bottom: 1px;
  }
  .links a:hover {
    background: var(--color-accent);
    color: var(--color-on-accent);
  }
</style>
```

- [ ] **Step 2: Create `LabGrid.astro`**

Create `src/components/organisms/LabGrid.astro`. It renders the grid; the header and "see all" link are optional so the same component serves the full page (no header) and the home teaser (header + link):

```astro
---
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import LabCell from "@/components/molecules/LabCell.astro";
import { loadExperiments } from "@/lib/experiments";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
  limit?: number;
  heading?: string;
  moreHref?: string;
  moreLabel?: string;
}

const { locale, limit, heading, moreHref, moreLabel } = Astro.props;
const items = loadExperiments(limit);
---

<section class="lab" data-reveal>
  {
    heading && (
      <header class="head">
        <SectionLabel>— LAB</SectionLabel>
        <h2>
          <Highlight>{heading}</Highlight>
        </h2>
      </header>
    )
  }
  <div class="grid">
    {
      items.map((experiment) => (
        <LabCell experiment={experiment} locale={locale} />
      ))
    }
  </div>
  {
    moreHref && moreLabel && (
      <a class="more" href={moreHref}>
        {moreLabel} →
      </a>
    )
  }
</section>

<style>
  .lab {
    padding: 40px 48px;
    border-bottom: var(--border-w) solid var(--color-border);
  }
  .head {
    margin-bottom: 20px;
  }
  h2 {
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 8px 0 0;
    line-height: 1;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }
  .more {
    display: inline-block;
    margin-top: 20px;
    background: var(--color-accent);
    color: var(--color-on-accent);
    padding: 6px 12px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    border-radius: var(--radius-pill);
  }
  @media (max-width: 720px) {
    .lab {
      padding: 24px 20px;
    }
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: Verify types pass**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`. (Components are not yet referenced by any page; Astro does not error on that.)

- [ ] **Step 4: Commit**

```bash
git add src/components/molecules/LabCell.astro src/components/organisms/LabGrid.astro
git commit -m "feat(lab): add LabCell and LabGrid components"
```

---

## Task 4: Lab pages (/lab + /en/lab) + JSON-LD + sitemap pair

**Files:**

- Modify: `src/lib/jsonLd.ts` (add `buildLabItemListJsonLd`)
- Create: `src/pages/lab.astro`
- Create: `src/pages/en/lab.astro`
- Modify: `astro.config.mjs` (add the i18n pair)

- [ ] **Step 1: Add the JSON-LD builder**

In `src/lib/jsonLd.ts`, add the import near the other data imports at the top (after `import { projects } from "@/data/projects";`):

```typescript
import { experiments } from "@/data/experiments";
```

Then add this function at the end of the file (`WEBSITE_ID` and `SITE_URL` are already imported; `Locale` is already imported):

```typescript
export function buildLabItemListJsonLd(locale: Locale) {
  const labUrl = `${SITE_URL}${locale === "fr" ? "/lab" : "/en/lab"}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${labUrl}#lab`,
    url: labUrl,
    name: "Lab — Aymeric Dijoux",
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: experiments.map((exp, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: exp.title,
        url: exp.url,
      })),
    },
  };
}
```

- [ ] **Step 2: Create the FR page**

Create `src/pages/lab.astro`:

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import LabGrid from "@/components/organisms/LabGrid.astro";
import JsonLd from "@/components/atoms/JsonLd.astro";
import { buildPersonJsonLd, buildLabItemListJsonLd } from "@/lib/jsonLd";

const locale = "fr" as const;
const title = "Lab — Aymeric Dijoux, expériences & mini-apps IA";
const description =
  "Le lab d'Aymeric Dijoux : mini-apps et expériences IA buildées vite fait, hébergées sur GitHub Pages. La preuve par le débit.";
---

<MainLayout
  title={title}
  description={description}
  locale={locale}
  routeKey="lab"
>
  <Fragment slot="head">
    <JsonLd data={[buildPersonJsonLd(), buildLabItemListJsonLd(locale)]} />
  </Fragment>
  <Nav slot="nav" locale={locale} />

  <section class="page-hero">
    <SectionLabel>— LAB</SectionLabel>
    <h1>Des trucs que je <Highlight>bricole</Highlight>.</h1>
    <p class="deck">{description}</p>
  </section>

  <LabGrid locale={locale} />

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
    font-size: clamp(32px, 6vw, 48px);
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 14px 0;
  }
  .deck {
    font-size: 17px;
    line-height: 1.6;
    color: var(--color-text-muted);
    max-width: 560px;
    margin: 0;
  }
  @media (max-width: 720px) {
    .page-hero {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
</style>
```

- [ ] **Step 3: Create the EN page**

Create `src/pages/en/lab.astro`:

```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import LabGrid from "@/components/organisms/LabGrid.astro";
import JsonLd from "@/components/atoms/JsonLd.astro";
import { buildPersonJsonLd, buildLabItemListJsonLd } from "@/lib/jsonLd";

const locale = "en" as const;
const title = "Lab — Aymeric Dijoux, AI experiments & mini-apps";
const description =
  "Aymeric Dijoux's lab: AI mini-apps and experiments shipped fast, hosted on GitHub Pages. Proof by throughput.";
---

<MainLayout
  title={title}
  description={description}
  locale={locale}
  routeKey="lab"
>
  <Fragment slot="head">
    <JsonLd data={[buildPersonJsonLd(), buildLabItemListJsonLd(locale)]} />
  </Fragment>
  <Nav slot="nav" locale={locale} />

  <section class="page-hero">
    <SectionLabel>— LAB</SectionLabel>
    <h1>Stuff I <Highlight>tinker with</Highlight>.</h1>
    <p class="deck">{description}</p>
  </section>

  <LabGrid locale={locale} />

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
    font-size: clamp(32px, 6vw, 48px);
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 14px 0;
  }
  .deck {
    font-size: 17px;
    line-height: 1.6;
    color: var(--color-text-muted);
    max-width: 560px;
    margin: 0;
  }
  @media (max-width: 720px) {
    .page-hero {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
</style>
```

- [ ] **Step 4: Add the sitemap i18n pair**

In `astro.config.mjs`, in the `I18N_PAIRS` array, add the lab pair. Replace:

```javascript
  ["/now/", "/en/now/"],
];
```

with:

```javascript
  ["/now/", "/en/now/"],
  ["/lab/", "/en/lab/"],
];
```

- [ ] **Step 5: Build and verify the pages + pairing exist**

Run:

```bash
npx astro build && \
  ls dist/lab/index.html dist/en/lab/index.html && \
  grep -o '<link rel="alternate"[^>]*>' dist/lab/index.html
```

Expected: both files listed, and three `<link rel="alternate">` lines where `hreflang="fr"` → `/lab/`, `hreflang="en"` → `/en/lab/`, `hreflang="x-default"` → `/lab/`.

- [ ] **Step 6: Verify JSON-LD still validates**

Run: `npm run validate:jsonld`
Expected: `✓ JSON-LD validation passed (N pages)` (N increased by 2).

- [ ] **Step 7: Commit**

```bash
git add src/lib/jsonLd.ts src/pages/lab.astro src/pages/en/lab.astro astro.config.mjs
git commit -m "feat(lab): add /lab + /en/lab pages with ItemList JSON-LD and sitemap pair"
```

---

## Task 5: Home teaser + footer link

**Files:**

- Modify: `src/components/organisms/Footer.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

- [ ] **Step 1: Add the Lab link to the footer**

In `src/components/organisms/Footer.astro`, replace:

```astro
<li><a href={rssHref}>RSS</a></li>
<li><a href="/sitemap-index.xml">SITEMAP</a></li>
```

with:

```astro
<li><a href={t.path("lab")}>LAB</a></li>
<li><a href={rssHref}>RSS</a></li>
<li><a href="/sitemap-index.xml">SITEMAP</a></li>
```

(`t` is already defined in `Footer.astro`. `LAB` is hardcoded text to match the existing `RSS`/`SITEMAP` acronym pattern in this file.)

- [ ] **Step 2: Add the teaser to the FR home**

In `src/pages/index.astro`, add two imports to the frontmatter — after `import Footer from "@/components/organisms/Footer.astro";` add:

```astro
import LabGrid from "@/components/organisms/LabGrid.astro";
```

and after `import { profile } from "@/data/profile";` add:

```astro
import {useTranslations} from "@/i18n/utils";
```

Then, after `const description = profile.bio.fr;`, add:

```astro
const t = useTranslations(locale);
```

Finally, in the markup, replace:

```astro
<AppsGrid locale={locale} />
<AboutExcerpt locale={locale} />
```

with:

```astro
<AppsGrid locale={locale} />
<LabGrid
  locale={locale}
  limit={3}
  heading={t("section.lab")}
  moreHref={t.path("lab")}
  moreLabel={t("cta.viewAllLab")}
/>
<AboutExcerpt locale={locale} />
```

- [ ] **Step 3: Add the teaser to the EN home**

In `src/pages/en/index.astro`, apply the exact same three edits as Step 2 (same import lines, same `const t = useTranslations(locale);` after the `const description = ...` line — note here it is `profile.bio.en`, leave that as-is — and the same `<LabGrid ... />` insertion between `<AppsGrid />` and `<AboutExcerpt />`).

- [ ] **Step 4: Build and verify the teaser renders on both homes**

Run:

```bash
npx astro build && \
  grep -c "lab-cell" dist/index.html && \
  grep -c "lab-cell" dist/en/index.html && \
  grep -o 'href="/lab"' dist/index.html | head -1 && \
  grep -o 'href="/en/lab"' dist/en/index.html | head -1
```

Expected: both `grep -c` return a count ≥ 1 (the 3 teaser cards) and the footer/more `href` lines print.

- [ ] **Step 5: Verify types + contrast**

Run: `npx astro check && npm run validate:contrast`
Expected: `0 errors, 0 warnings`, and `✓ Contrast validation passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/organisms/Footer.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "feat(lab): add home teaser and footer link"
```

---

## Task 6: GEO (llms.txt) + final verification

**Files:**

- Modify: `src/pages/llms.txt.ts`

- [ ] **Step 1: Add the Lab line to llms.txt**

In `src/pages/llms.txt.ts`, in the `## Key pages` block, replace:

```typescript
    `- [Work together](${SITE_URL}/en/work): services, process, FAQ, booking`,
```

with:

```typescript
    `- [Work together](${SITE_URL}/en/work): services, process, FAQ, booking`,
    `- [Lab](${SITE_URL}/lab): quick AI experiments & mini-apps on GitHub Pages`,
```

- [ ] **Step 2: Build and verify llms.txt contains the Lab line**

Run:

```bash
npx astro build && grep -i "Lab" dist/llms.txt
```

Expected: the line `- [Lab](https://aymeric.dijoux.dev/lab): quick AI experiments & mini-apps on GitHub Pages` prints.

- [ ] **Step 3: Full gate — run every validator**

Run:

```bash
npx astro check && \
  npm run lint && \
  npm run format:check && \
  npm run build && \
  npm run validate:jsonld && \
  npm run validate:contrast
```

Expected: `astro check` 0/0; lint clean; prettier reports all files formatted (if it flags new files, run `npm run format` then re-commit); build completes; both validators pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/llms.txt.ts
git commit -m "feat(lab): list the Lab page in llms.txt for GEO"
```

- [ ] **Step 5 (optional): Push**

Only if Aymeric asks to deploy:

```bash
git push origin main
```

---

## Self-Review (completed by plan author)

**Spec coverage:** §3 data model → Task 1. §4 components → Task 3. §5 pages/routing/i18n → Tasks 2 + 4; footer link + teaser → Task 5. §6 SEO/GEO (hreflang, sitemap, ItemList, llms.txt) → Tasks 4 + 6. §7 seed content → Task 1. §9 success criteria → verified across Tasks 4–6. No gaps.

**Placeholder scan:** No TBD/TODO; all code blocks are complete. The one `> Note` about `techStack` is a content confirmation, not a code placeholder, and does not block the build.

**Type consistency:** `Experiment` fields are identical across the type (Task 1), data (Task 1), `loadExperiments` (Task 1), `LabCell`/`LabGrid` (Task 3), and `buildLabItemListJsonLd` (Task 4). `routeKey="lab"` and `t.path("lab")` are valid only after Task 2 (ordered before Tasks 4–5 that use them). `t("cta.demo")`, `t("cta.code")`, `t("section.lab")`, `t("cta.viewAllLab")` are all defined in Task 2.
