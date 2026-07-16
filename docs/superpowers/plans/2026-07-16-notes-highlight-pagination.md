# Notes Highlight + Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manually-flagged featured article (big card, with cover image) at the top of the notes archive page 1 and the homepage, paginate the archive at 5 per page, and slim the tag filter down to a curated set plus an "all tags" index page.

**Architecture:** Convert the two `index.astro` note pages into rest-param paginated routes (`[...page].astro`) that stay thin and delegate rendering to a shared `NotesArchive` organism. New `NoteHighlight` and `Pagination` molecules. Pure helpers in `lib/notes.ts` drive selection/counting. Cover images bridge the string frontmatter field to `astro:assets` via a `data/noteCovers.ts` map. The homepage `NotesSection` reuses the same highlight.

**Tech Stack:** Astro 5 (static), TypeScript strict, Tailwind 4 (`@theme` tokens), `astro:assets`, Astro `paginate()`, Astro Content Collections (glob loader).

## Global Constraints

Copied verbatim from the spec and CLAUDE.md — every task must satisfy these:

- **Verification model:** this repo has **no Vitest/unit-test setup** for components (CLAUDE.md: "Pas de tests unitaires Vitest sur les composants"). Verification per task = `npx astro check` (0 error / 0 warning) + targeted `npm run build` + assertions against generated `dist/`. Do **not** introduce a test runner.
- **File size:** ≤ 150 lines per `.astro` component, ≤ 120 lines per `.ts` file.
- **Functions:** ≤ 20 lines, single responsibility.
- **TypeScript strict:** no `any`, no unjustified casts. Explicit return types on exported functions. Union types over free strings.
- **No hardcoded UI strings:** every user-facing string via `useTranslations` (`src/i18n/ui.ts`, both FR + EN).
- **No hardcoded internal hrefs:** always via `t.path(...)` / `localizePath(route, locale)`.
- **No hardcoded colors/sizes:** design values come from `src/styles/theme.css` tokens (`var(--color-*)`, `var(--border-w)`, etc.). `--color-accent` (#ccff00) only as background behind dark text, never as `color:` on light bg.
- **Images:** always `<Image>` from `astro:assets` (never `<img>`, never `public/`).
- **A11y:** `prefers-reduced-motion` respected; focus rings inherited; one `<h1>` per page; `<nav>` landmarks get translated `aria-label`.
- **Commits:** conventional commits, ending with the Co-Authored-By trailer:
  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```
- Work on a feature branch, not `main`.

**Key existing signatures the tasks rely on:**
```ts
// src/lib/notes.ts
export type NoteEntry = CollectionEntry<"notes">;
export function getNoteSlug(entry: NoteEntry): string;
export async function loadPublishedNotes(locale: Locale): Promise<NoteEntry[]>; // sorted date desc
export async function loadLatestNotes(locale: Locale, limit: number): Promise<NoteEntry[]>;
export async function listAllTags(locale: Locale): Promise<string[]>;
export function getNoteReadingTime(entry: NoteEntry): { minutes: number; words: number };
export function buildNoteUrl(entry: NoteEntry): string; // "/notes/<slug>" | "/en/writing/<slug>"

// src/lib/dates.ts
export function formatDate(date: Date, locale: Locale): string;

// src/i18n/utils.ts
export function useTranslations(locale: Locale): { (key: UiKey): string; path(route): string };
export function localizePath(route: keyof routes["fr"], locale: Locale): string;

// src/lib/jsonLd.ts
export function buildPersonJsonLd(): object;
export function buildBlogJsonLd(posts: BlogPostRef[], locale: Locale, url: string): object;
// BlogPostRef = { title: string; url: string; datePublished: Date; description: string }

// src/lib/constants.ts
export const SITE_URL = "https://aymeric.dijoux.dev";
export const NOTES_ON_HOME = 3;
```

`MainLayout` props: `{ title, description, locale?, ogImage?, pageType?, routeKey?, alternatePath? }`, with a `<slot name="head" />`, `<slot name="nav" />`, default `<slot />` (inside `<main id="main">`), and `<slot name="footer" />`.

Note atoms: `Highlight.astro` (wraps slot in accent span, optional `as` prop), `SectionLabel.astro` (mono uppercase label, slot content, optional `number`).

---

## Task 0: Branch

**Files:** none (git only)

- [ ] **Step 1: Create the feature branch**

Run:
```bash
git checkout -b feat/notes-highlight-pagination
```
Expected: `Switched to a new branch 'feat/notes-highlight-pagination'`

---

## Task 1: Foundation — schema, cover map, curated tags, page size, featured content

Adds the data plumbing with no UI change yet: `featured` in the schema, the curated tag
list, the cover-image map, the page-size constant, and the Ti Boug frontmatter flags.

**Files:**
- Modify: `src/content.config.ts` (add `featured`)
- Modify: `src/lib/constants.ts:5` (`NOTES_PER_PAGE`)
- Create: `src/data/tags.ts`
- Create: `src/data/noteCovers.ts`
- Modify: `src/content/notes/fr/2026-07-ti-boug-prix-marche-reunion.mdx` (frontmatter)
- Modify: `src/content/notes/en/2026-07-ti-boug-reunion-market-prices.mdx` (frontmatter)

**Interfaces:**
- Produces:
  - `notes` collection schema gains `featured: boolean` (default `false`); `cover?: string` already exists.
  - `export const PRIMARY_TAGS: readonly string[]` from `@/data/tags`.
  - `export const noteCovers: Record<string, ImageMetadata>` from `@/data/noteCovers`.
  - `NOTES_PER_PAGE === 5`.

- [ ] **Step 1: Add `featured` to the content schema**

In `src/content.config.ts`, add the field inside the `z.object({ ... })` (keep `cover` as-is):
```ts
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
```

- [ ] **Step 2: Regenerate content types**

Run:
```bash
npx astro sync
```
Expected: completes without error; `.astro/` types now include `featured` on the notes collection.

- [ ] **Step 3: Set the page size constant**

In `src/lib/constants.ts`, change:
```ts
export const NOTES_PER_PAGE = 5;
```

- [ ] **Step 4: Create the curated tag list**

Create `src/data/tags.ts`:
```ts
export const PRIMARY_TAGS = [
  "indie",
  "build",
  "process",
  "claude",
  "ia",
] as const;
```

- [ ] **Step 5: Create the cover-image map**

Create `src/data/noteCovers.ts`:
```ts
import type { ImageMetadata } from "astro";
import tibougPanier from "@/assets/mascot/ti-boug-panier.png";

/** Maps a note's frontmatter `cover` string to an imported asset for astro:assets. */
export const noteCovers: Record<string, ImageMetadata> = {
  "tiboug-panier": tibougPanier,
};
```

- [ ] **Step 6: Flag the Ti Boug articles as featured with a cover**

In `src/content/notes/fr/2026-07-ti-boug-prix-marche-reunion.mdx`, add to the frontmatter (before the closing `---`):
```yaml
featured: true
cover: "tiboug-panier"
```
Do the same in `src/content/notes/en/2026-07-ti-boug-reunion-market-prices.mdx`.

- [ ] **Step 7: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors, 0 warnings.

- [ ] **Step 8: Commit**

```bash
git add src/content.config.ts src/lib/constants.ts src/data/tags.ts src/data/noteCovers.ts \
  src/content/notes/fr/2026-07-ti-boug-prix-marche-reunion.mdx \
  src/content/notes/en/2026-07-ti-boug-reunion-market-prices.mdx
git commit -m "feat(notes): add featured flag, cover map, curated tags, page size

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Pure helpers in `lib/notes.ts`

Adds the selection/counting logic used by pages and the homepage. Pure functions, logic out of markup.

**Files:**
- Modify: `src/lib/notes.ts` (append helpers; file stays ≤ 120 lines — currently 58)

**Interfaces:**
- Consumes: `loadPublishedNotes`, `NoteEntry`, `Locale` (already in file).
- Produces:
  ```ts
  export interface TagCount { tag: string; count: number; }
  export function partitionFeatured(notes: NoteEntry[]): { featured: NoteEntry | null; rest: NoteEntry[] };
  export async function listTagsWithCount(locale: Locale): Promise<TagCount[]>;
  export async function loadHomeNotes(locale: Locale, limit: number): Promise<{ featured: NoteEntry | null; latest: NoteEntry[] }>;
  ```

- [ ] **Step 1: Add `partitionFeatured`**

Append to `src/lib/notes.ts`:
```ts
export function partitionFeatured(notes: NoteEntry[]): {
  featured: NoteEntry | null;
  rest: NoteEntry[];
} {
  // notes are pre-sorted newest→oldest, so .find picks the most recent featured
  const featured = notes.find((note) => note.data.featured) ?? null;
  const rest = featured ? notes.filter((note) => note !== featured) : notes;
  return { featured, rest };
}
```

- [ ] **Step 2: Add `TagCount` + `listTagsWithCount`**

Append:
```ts
export interface TagCount {
  tag: string;
  count: number;
}

export async function listTagsWithCount(locale: Locale): Promise<TagCount[]> {
  const notes = await loadPublishedNotes(locale);
  const counts = new Map<string, number>();
  notes.forEach((note) =>
    note.data.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)),
  );
  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
}
```

- [ ] **Step 3: Add `loadHomeNotes`**

Append:
```ts
export async function loadHomeNotes(
  locale: Locale,
  limit: number,
): Promise<{ featured: NoteEntry | null; latest: NoteEntry[] }> {
  const all = await loadPublishedNotes(locale);
  const { featured, rest } = partitionFeatured(all);
  return { featured, latest: rest.slice(0, limit) };
}
```

- [ ] **Step 4: Verify types and file size**

Run:
```bash
npx astro check && wc -l src/lib/notes.ts
```
Expected: 0 errors / 0 warnings; line count ≤ 120.

- [ ] **Step 5: Commit**

```bash
git add src/lib/notes.ts
git commit -m "feat(notes): add partitionFeatured, listTagsWithCount, loadHomeNotes helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: i18n strings + routes

Adds every FR + EN string the new UI needs and the `tags` / `rss` route entries.

**Files:**
- Modify: `src/i18n/ui.ts` (add keys to `ui.fr` and `ui.en`; add `tags`/`rss` to `routes.fr`/`routes.en`)

**Interfaces:**
- Produces (new `UiKey`s, all present in BOTH locales — the `satisfies Record<Locale, ...>` enforces parity):
  `pagination.prev`, `pagination.next`, `pagination.page`, `pagination.label`,
  `notes.sectionLabel`, `notes.heroPre`, `notes.heroHl`, `notes.heroPost`, `notes.deck`,
  `notes.metaTitle`, `notes.featured`, `notes.allTags`, `notes.filtersLabel`,
  `notes.allPill`, `notes.rss`, `notes.empty`,
  `tags.sectionLabel`, `tags.title`, `tags.deck`, `tags.metaTitle`, `tags.back`.
- Produces new route keys: `routes.{fr,en}.tags`, `routes.{fr,en}.rss`.

- [ ] **Step 1: Add the FR keys**

In `src/i18n/ui.ts`, inside the `fr: { ... }` block (before its closing `},`), add:
```ts
    "pagination.prev": "Précédent",
    "pagination.next": "Suivant",
    "pagination.page": "Page",
    "pagination.label": "Pagination",
    "notes.sectionLabel": "— NOTES",
    "notes.heroPre": "Ce que ",
    "notes.heroHl": "j'apprends",
    "notes.heroPost": " en buildant.",
    "notes.deck":
      "Notes de build, retours d'expérience, et essais techniques d'Aymeric Dijoux. Pas un blog régulier — j'écris quand j'ai quelque chose qui vaut le coup d'être partagé.",
    "notes.metaTitle": "Notes — Aymeric Dijoux",
    "notes.featured": "À la une",
    "notes.allTags": "tous les tags",
    "notes.filtersLabel": "Filtres tags",
    "notes.allPill": "tous",
    "notes.rss": "RSS",
    "notes.empty": "Pas encore d'article — reviens bientôt.",
    "tags.sectionLabel": "— TAGS",
    "tags.title": "Tags",
    "tags.deck": "Tous les sujets abordés dans les notes.",
    "tags.metaTitle": "Tags — Aymeric Dijoux",
    "tags.back": "← Toutes les notes",
```

- [ ] **Step 2: Add the EN keys**

Inside the `en: { ... }` block, add:
```ts
    "pagination.prev": "Previous",
    "pagination.next": "Next",
    "pagination.page": "Page",
    "pagination.label": "Pagination",
    "notes.sectionLabel": "— WRITING",
    "notes.heroPre": "What I'm ",
    "notes.heroHl": "learning",
    "notes.heroPost": " while building.",
    "notes.deck":
      "Build notes, lessons learned, and technical essays by Aymeric Dijoux. Not a regular blog — I write when I have something worth sharing.",
    "notes.metaTitle": "Writing — Aymeric Dijoux",
    "notes.featured": "Featured",
    "notes.allTags": "all tags",
    "notes.filtersLabel": "Tag filters",
    "notes.allPill": "all",
    "notes.rss": "RSS",
    "notes.empty": "No articles yet — check back soon.",
    "tags.sectionLabel": "— TAGS",
    "tags.title": "Tags",
    "tags.deck": "Every topic covered in the notes.",
    "tags.metaTitle": "Tags — Aymeric Dijoux",
    "tags.back": "← All writing",
```

- [ ] **Step 3: Add the route entries**

In `src/i18n/ui.ts`, inside `routes.fr` add `tags` and `rss`:
```ts
  fr: {
    home: "/",
    about: "/a-propos",
    notes: "/notes",
    work: "/collaborer",
    now: "/now",
    lab: "/lab",
    tags: "/notes/tags",
    rss: "/rss.xml",
  },
```
Inside `routes.en`:
```ts
  en: {
    home: "/en/",
    about: "/en/about",
    notes: "/en/writing",
    work: "/en/work",
    now: "/en/now",
    lab: "/en/lab",
    tags: "/en/writing/tags",
    rss: "/en/rss.xml",
  },
```

- [ ] **Step 4: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors / 0 warnings (both locales have identical key sets, so `satisfies` passes).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "i18n(notes): add pagination, hero, tags strings + tags/rss routes

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: `Pagination.astro` molecule

**Files:**
- Create: `src/components/molecules/Pagination.astro`

**Interfaces:**
- Consumes: `useTranslations` (`pagination.*` keys from Task 3); an Astro `Page` object (`page.url.prev`, `page.url.next`, `page.currentPage`, `page.lastPage`).
- Produces: `<Pagination page={page} locale={locale} />`.

- [ ] **Step 1: Write the component**

Create `src/components/molecules/Pagination.astro`:
```astro
---
import type { Page } from "astro";
import { useTranslations } from "@/i18n/utils";
import type { Locale } from "@/types";

interface Props {
  page: Page;
  locale: Locale;
}

const { page, locale } = Astro.props;
const t = useTranslations(locale);
const label = `${t("pagination.page")} ${page.currentPage} / ${page.lastPage}`;
---

{
  page.lastPage > 1 && (
    <nav class="pager" aria-label={t("pagination.label")}>
      {page.url.prev ? (
        <a class="link" href={page.url.prev} rel="prev">
          ← {t("pagination.prev")}
        </a>
      ) : (
        <span class="link is-disabled" aria-disabled="true">
          ← {t("pagination.prev")}
        </span>
      )}
      <span class="count">{label}</span>
      {page.url.next ? (
        <a class="link" href={page.url.next} rel="next">
          {t("pagination.next")} →
        </a>
      ) : (
        <span class="link is-disabled" aria-disabled="true">
          {t("pagination.next")} →
        </span>
      )}
    </nav>
  )
}

<style>
  .pager {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 0;
    border-top: var(--border-w) solid var(--color-border);
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .link {
    color: var(--color-text);
    text-decoration: none;
    padding: 4px 8px;
    border: 1px solid var(--color-border);
    background: var(--color-bg-soft);
  }
  .link:hover {
    background: var(--color-strong-bg);
    color: var(--color-strong-fg);
  }
  .is-disabled {
    opacity: 0.4;
    pointer-events: none;
  }
  .count {
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 2: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors / 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/Pagination.astro
git commit -m "feat(notes): add Pagination molecule

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: `NoteHighlight.astro` molecule

Big featured card: cover image (left) + text block (right), stacked on mobile. Whole card is a link.

**Files:**
- Create: `src/components/molecules/NoteHighlight.astro`

**Interfaces:**
- Consumes: `NoteEntry`, `buildNoteUrl`, `getNoteReadingTime` (`lib/notes`), `formatDate` (`lib/dates`), `noteCovers` (`data/noteCovers`), `useTranslations` (`notes.featured`), `Image` (`astro:assets`).
- Produces: `<NoteHighlight note={note} locale={locale} />`.

- [ ] **Step 1: Write the component**

Create `src/components/molecules/NoteHighlight.astro`:
```astro
---
import { Image } from "astro:assets";
import { buildNoteUrl, getNoteReadingTime } from "@/lib/notes";
import type { NoteEntry } from "@/lib/notes";
import { formatDate } from "@/lib/dates";
import { noteCovers } from "@/data/noteCovers";
import { useTranslations } from "@/i18n/utils";
import type { Locale } from "@/types";

interface Props {
  note: NoteEntry;
  locale: Locale;
}

const { note, locale } = Astro.props;
const t = useTranslations(locale);
const url = buildNoteUrl(note);
const { minutes } = getNoteReadingTime(note);
const cover = note.data.cover ? noteCovers[note.data.cover] : undefined;
const tech = note.data.tags.join(" · ");
---

<a href={url} class="highlight" class:list={[{ "has-cover": cover }]}>
  {
    cover && (
      <div class="cover">
        <Image src={cover} alt="" widths={[320, 640]} sizes="(max-width: 720px) 100vw, 320px" />
      </div>
    )
  }
  <div class="body">
    <span class="badge">★ {t("notes.featured")}</span>
    <h3>{note.data.title}</h3>
    <p class="lede">{note.data.excerpt}</p>
    <div class="meta">
      <span>{formatDate(note.data.date, locale)}</span>
      <span class="sep">·</span>
      {tech && (<><span>{tech}</span><span class="sep">·</span></>)}
      <span>{minutes} min</span>
    </div>
  </div>
</a>

<style>
  .highlight {
    display: block;
    border: var(--border-w) solid var(--color-border);
    background: var(--color-bg-soft);
    color: var(--color-text);
    text-decoration: none;
    margin: 8px 0 24px;
  }
  .highlight.has-cover {
    display: grid;
    grid-template-columns: 320px 1fr;
  }
  .cover :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-right: var(--border-w) solid var(--color-border);
  }
  .body {
    padding: 24px;
  }
  .badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 8px;
    background: var(--color-strong-bg);
    color: var(--color-strong-fg);
    margin-bottom: 12px;
  }
  h3 {
    font-size: clamp(20px, 3vw, 26px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin: 0 0 10px;
    display: inline;
  }
  .highlight:hover h3 {
    background: var(--color-accent);
    color: var(--color-on-accent);
  }
  .lede {
    font-size: 14px;
    color: var(--color-text-muted);
    line-height: 1.55;
    margin: 10px 0 12px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .sep {
    opacity: 0.6;
  }
  @media (max-width: 720px) {
    .highlight.has-cover {
      grid-template-columns: 1fr;
    }
    .cover :global(img) {
      border-right: none;
      border-bottom: var(--border-w) solid var(--color-border);
      max-height: 220px;
    }
  }
</style>
```

Note: `class:list` is Astro's directive; the `has-cover` class only applies grid layout when a cover exists. `alt=""` is intentional — the image is decorative (the title is the link text).

- [ ] **Step 2: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors / 0 warnings.

- [ ] **Step 3: Verify `--color-on-accent` token exists**

Run:
```bash
grep -n "color-on-accent\|color-strong-bg\|color-strong-fg\|color-bg-soft" src/styles/theme.css
```
Expected: all four tokens are defined (they are used by existing `NoteRow`/`SectionLabel`). If `--color-on-accent` is missing, use the same hover pattern as `NoteRow.astro` (which already uses `--color-on-accent`) — it exists.

- [ ] **Step 4: Commit**

```bash
git add src/components/molecules/NoteHighlight.astro
git commit -m "feat(notes): add NoteHighlight molecule with cover image

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: `NotesArchive.astro` organism

Shared archive view: hero + filter bar + highlight (page 1) + list + pagination. Consumes only what page files pass.

**Files:**
- Create: `src/components/organisms/NotesArchive.astro`

**Interfaces:**
- Consumes: `useTranslations`, `localizePath` (`i18n/utils`); `PRIMARY_TAGS` (`data/tags`); `NoteRow`, `NoteHighlight`, `Pagination` molecules; `SectionLabel`, `Highlight` atoms; `NoteEntry` (`lib/notes`); Astro `Page`.
- Produces: `<NotesArchive locale={locale} page={page} featured={featured} />`.

- [ ] **Step 1: Write the component**

Create `src/components/organisms/NotesArchive.astro`:
```astro
---
import type { Page } from "astro";
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import Highlight from "@/components/atoms/Highlight.astro";
import NoteRow from "@/components/molecules/NoteRow.astro";
import NoteHighlight from "@/components/molecules/NoteHighlight.astro";
import Pagination from "@/components/molecules/Pagination.astro";
import { useTranslations, localizePath } from "@/i18n/utils";
import { PRIMARY_TAGS } from "@/data/tags";
import type { NoteEntry } from "@/lib/notes";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
  page: Page<NoteEntry>;
  featured: NoteEntry | null;
}

const { locale, page, featured } = Astro.props;
const t = useTranslations(locale);
const notesPath = localizePath("notes", locale);
const tagsBase = localizePath("tags", locale);
const showHighlight = page.currentPage === 1 && featured;
---

<section class="page-hero">
  <SectionLabel>{t("notes.sectionLabel")}</SectionLabel>
  <h1>{t("notes.heroPre")}<Highlight>{t("notes.heroHl")}</Highlight>{t("notes.heroPost")}</h1>
  <p class="deck">{t("notes.deck")}</p>
</section>

<nav class="filters" aria-label={t("notes.filtersLabel")}>
  <a href={notesPath} class="tag-pill active">{t("notes.allPill")}</a>
  {PRIMARY_TAGS.map((tag) => (
    <a href={`${tagsBase}/${tag}`} class="tag-pill">{tag}</a>
  ))}
  <a href={tagsBase} class="all-tags">{t("notes.allTags")} →</a>
  <a href={localizePath("rss", locale)} class="rss">— {t("notes.rss")} ↗</a>
</nav>

<div class="list">
  {showHighlight && featured && <NoteHighlight note={featured} locale={locale} />}
  {page.data.map((note) => <NoteRow note={note} locale={locale} />)}
  {page.data.length === 0 && !showHighlight && <p class="empty">{t("notes.empty")}</p>}
  <Pagination page={page} locale={locale} />
</div>

<style>
  .page-hero {
    padding: 56px 48px 24px;
    border-bottom: var(--border-w) solid var(--color-border);
    max-width: var(--container-narrow);
    margin: 0 auto;
  }
  h1 {
    font-size: clamp(28px, 5vw, 36px);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 14px 0 12px;
  }
  .deck {
    font-size: 15px;
    color: var(--color-text-muted);
    line-height: 1.6;
    max-width: 560px;
    margin: 0;
  }
  .filters {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 16px 48px 8px;
    flex-wrap: wrap;
    max-width: var(--container-narrow);
    margin: 0 auto;
  }
  .tag-pill {
    padding: 4px 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
    text-decoration: none;
    background: var(--color-bg-soft);
    border: 1px solid var(--color-border);
  }
  .tag-pill.active {
    background: var(--color-strong-bg);
    color: var(--color-strong-fg);
    border-color: var(--color-strong-bg);
  }
  .all-tags {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
    text-decoration: none;
  }
  .all-tags:hover {
    color: var(--color-text);
  }
  .rss {
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    text-decoration: none;
  }
  .list {
    padding: 0 48px 48px;
    max-width: var(--container-narrow);
    margin: 0 auto;
  }
  .empty {
    padding: 40px 0;
    color: var(--color-text-muted);
    text-align: center;
  }
  @media (max-width: 720px) {
    .page-hero,
    .filters,
    .list {
      padding-left: 20px;
      padding-right: 20px;
    }
    .all-tags {
      margin-left: 0;
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 2: Verify types and file size**

Run:
```bash
npx astro check && wc -l src/components/organisms/NotesArchive.astro
```
Expected: 0 errors / 0 warnings; ≤ 150 lines.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/NotesArchive.astro
git commit -m "feat(notes): add shared NotesArchive organism

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Convert FR + EN archive pages to paginated routes

Replace the two `index.astro` files with thin `[...page].astro` routes that paginate and delegate to `NotesArchive`, wiring JSON-LD, hreflang, and prev/next.

**Files:**
- Create: `src/pages/notes/[...page].astro`
- Delete: `src/pages/notes/index.astro`
- Create: `src/pages/en/writing/[...page].astro`
- Delete: `src/pages/en/writing/index.astro`

**Interfaces:**
- Consumes: `partitionFeatured`, `loadPublishedNotes`, `buildNoteUrl` (`lib/notes`); `NOTES_PER_PAGE`, `SITE_URL` (`constants`); `buildPersonJsonLd`, `buildBlogJsonLd` (`jsonLd`); `useTranslations` (`i18n/utils`); `NotesArchive` organism; Astro `paginate`, `Page`, `PaginateFunction`.

- [ ] **Step 1: Create the FR paginated page**

Create `src/pages/notes/[...page].astro`:
```astro
---
import type { Page, PaginateFunction } from "astro";
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import NotesArchive from "@/components/organisms/NotesArchive.astro";
import JsonLd from "@/components/atoms/JsonLd.astro";
import {
  loadPublishedNotes,
  partitionFeatured,
  buildNoteUrl,
  type NoteEntry,
} from "@/lib/notes";
import { buildPersonJsonLd, buildBlogJsonLd } from "@/lib/jsonLd";
import { NOTES_PER_PAGE, SITE_URL } from "@/lib/constants";
import { useTranslations } from "@/i18n/utils";

const locale = "fr" as const;

export async function getStaticPaths({
  paginate,
}: {
  paginate: PaginateFunction;
}) {
  const all = await loadPublishedNotes("fr");
  const { featured, rest } = partitionFeatured(all);
  return paginate(rest, { pageSize: NOTES_PER_PAGE, props: { featured } });
}

interface Props {
  page: Page<NoteEntry>;
  featured: NoteEntry | null;
}
const { page, featured } = Astro.props;
const t = useTranslations(locale);

const isFirst = page.currentPage === 1;
const title = isFirst
  ? t("notes.metaTitle")
  : `${t("notes.metaTitle")} · ${t("pagination.page")} ${page.currentPage}`;
const description = t("notes.deck");
const alternatePath = isFirst ? undefined : `/en/writing/${page.currentPage}`;

const allNotes = isFirst ? await loadPublishedNotes("fr") : [];
const blogPosts = allNotes.map((note) => ({
  title: note.data.title,
  url: `${SITE_URL}${buildNoteUrl(note)}`,
  datePublished: note.data.date,
  description: note.data.excerpt,
}));
const jsonLd = isFirst
  ? [buildPersonJsonLd(), buildBlogJsonLd(blogPosts, locale, `${SITE_URL}/notes`)]
  : [buildPersonJsonLd()];

const prevHref = page.url.prev ? new URL(page.url.prev, SITE_URL).href : null;
const nextHref = page.url.next ? new URL(page.url.next, SITE_URL).href : null;
---

<MainLayout
  title={title}
  description={description}
  locale={locale}
  routeKey={isFirst ? "notes" : undefined}
  alternatePath={alternatePath}
>
  <Fragment slot="head">
    <JsonLd data={jsonLd} />
    {prevHref && <link rel="prev" href={prevHref} />}
    {nextHref && <link rel="next" href={nextHref} />}
  </Fragment>
  <Nav slot="nav" locale={locale} current="notes" />

  <NotesArchive locale={locale} page={page} featured={featured} />

  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 2: Delete the old FR index**

Run:
```bash
git rm src/pages/notes/index.astro
```

- [ ] **Step 3: Create the EN paginated page**

Create `src/pages/en/writing/[...page].astro` — identical to Step 1 except: `const locale = "en" as const;`, `loadPublishedNotes("en")` (both places), `alternatePath = .../notes/${page.currentPage}`, and the Blog URL `${SITE_URL}/en/writing`:
```astro
---
import type { Page, PaginateFunction } from "astro";
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import NotesArchive from "@/components/organisms/NotesArchive.astro";
import JsonLd from "@/components/atoms/JsonLd.astro";
import {
  loadPublishedNotes,
  partitionFeatured,
  buildNoteUrl,
  type NoteEntry,
} from "@/lib/notes";
import { buildPersonJsonLd, buildBlogJsonLd } from "@/lib/jsonLd";
import { NOTES_PER_PAGE, SITE_URL } from "@/lib/constants";
import { useTranslations } from "@/i18n/utils";

const locale = "en" as const;

export async function getStaticPaths({
  paginate,
}: {
  paginate: PaginateFunction;
}) {
  const all = await loadPublishedNotes("en");
  const { featured, rest } = partitionFeatured(all);
  return paginate(rest, { pageSize: NOTES_PER_PAGE, props: { featured } });
}

interface Props {
  page: Page<NoteEntry>;
  featured: NoteEntry | null;
}
const { page, featured } = Astro.props;
const t = useTranslations(locale);

const isFirst = page.currentPage === 1;
const title = isFirst
  ? t("notes.metaTitle")
  : `${t("notes.metaTitle")} · ${t("pagination.page")} ${page.currentPage}`;
const description = t("notes.deck");
const alternatePath = isFirst ? undefined : `/notes/${page.currentPage}`;

const allNotes = isFirst ? await loadPublishedNotes("en") : [];
const blogPosts = allNotes.map((note) => ({
  title: note.data.title,
  url: `${SITE_URL}${buildNoteUrl(note)}`,
  datePublished: note.data.date,
  description: note.data.excerpt,
}));
const jsonLd = isFirst
  ? [buildPersonJsonLd(), buildBlogJsonLd(blogPosts, locale, `${SITE_URL}/en/writing`)]
  : [buildPersonJsonLd()];

const prevHref = page.url.prev ? new URL(page.url.prev, SITE_URL).href : null;
const nextHref = page.url.next ? new URL(page.url.next, SITE_URL).href : null;
---

<MainLayout
  title={title}
  description={description}
  locale={locale}
  routeKey={isFirst ? "notes" : undefined}
  alternatePath={alternatePath}
>
  <Fragment slot="head">
    <JsonLd data={jsonLd} />
    {prevHref && <link rel="prev" href={prevHref} />}
    {nextHref && <link rel="next" href={nextHref} />}
  </Fragment>
  <Nav slot="nav" locale={locale} current="notes" />

  <NotesArchive locale={locale} page={page} featured={featured} />

  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 4: Delete the old EN index**

Run:
```bash
git rm src/pages/en/writing/index.astro
```

- [ ] **Step 5: Build and verify the generated routes**

Run:
```bash
npx astro check && npm run build
```
Expected: 0 errors / 0 warnings.

Then assert the paginated pages and highlight exist:
```bash
ls dist/notes/index.html dist/notes/2/index.html dist/notes/3/index.html
ls dist/en/writing/index.html dist/en/writing/2/index.html
grep -l "tiboug-panier" dist/notes/index.html          # highlight image on FR page 1
grep -L "tiboug-panier" dist/notes/2/index.html || true # NOT on page 2
grep -c "note-row" dist/notes/2/index.html              # ~5 rows on page 2
```
Expected: page-1/2/3 HTML files exist for FR, EN mirror exists, the Ti Boug cover image reference appears on page 1 only, and page 2 has ~5 note rows.

> Note: the exact last page number depends on the published (non-draft, non-featured) note count at build time — roughly 21 FR notes ⇒ pages 1–5 (`/notes` … `/notes/5`), and EN may differ. Adjust the `ls` list to the real last page accordingly; the assertion that matters is that `/notes/2` exists and page 1 differs from page 2.

- [ ] **Step 6: Commit**

```bash
git add src/pages/notes/[...page].astro src/pages/en/writing/[...page].astro
git commit -m "feat(notes): paginate archive pages with featured highlight on page 1

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Tag index pages (FR + EN)

New `/notes/tags` and `/en/writing/tags` pages listing every tag with its count. Two thin pages sharing a small organism to avoid duplication.

**Files:**
- Create: `src/components/organisms/TagIndex.astro`
- Create: `src/pages/notes/tags/index.astro`
- Create: `src/pages/en/writing/tags/index.astro`

**Interfaces:**
- Consumes: `listTagsWithCount`, `TagCount` (`lib/notes`); `localizePath`, `useTranslations` (`i18n/utils`); `SectionLabel` atom.
- Produces: `<TagIndex locale={locale} tags={tags} />`.

- [ ] **Step 1: Write the `TagIndex` organism**

Create `src/components/organisms/TagIndex.astro`:
```astro
---
import SectionLabel from "@/components/atoms/SectionLabel.astro";
import { useTranslations, localizePath } from "@/i18n/utils";
import type { TagCount } from "@/lib/notes";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
  tags: TagCount[];
}

const { locale, tags } = Astro.props;
const t = useTranslations(locale);
const tagsBase = localizePath("tags", locale);
const notesPath = localizePath("notes", locale);
---

<section class="hero">
  <SectionLabel>{t("tags.sectionLabel")}</SectionLabel>
  <h1>{t("tags.title")}</h1>
  <p class="deck">{t("tags.deck")}</p>
  <a href={notesPath} class="back">{t("tags.back")}</a>
</section>

<ul class="grid">
  {tags.map(({ tag, count }) => (
    <li>
      <a href={`${tagsBase}/${tag}`}>
        <span class="name">#{tag}</span>
        <span class="count">{count}</span>
      </a>
    </li>
  ))}
</ul>

<style>
  .hero {
    padding: 56px 48px 24px;
    border-bottom: var(--border-w) solid var(--color-border);
    max-width: var(--container-narrow);
    margin: 0 auto;
  }
  h1 {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 12px 0 8px;
    font-family: var(--font-mono);
  }
  .deck {
    font-size: 15px;
    color: var(--color-text-muted);
    margin: 0 0 12px;
  }
  .back {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
    text-decoration: none;
  }
  .grid {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 24px 48px 48px;
    margin: 0;
    max-width: var(--container-narrow);
  }
  .grid a {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    padding: 6px 12px;
    font-family: var(--font-mono);
    font-size: 12px;
    text-decoration: none;
    color: var(--color-text);
    background: var(--color-bg-soft);
    border: 1px solid var(--color-border);
  }
  .grid a:hover {
    background: var(--color-strong-bg);
    color: var(--color-strong-fg);
  }
  .count {
    color: var(--color-text-muted);
  }
  .grid a:hover .count {
    color: var(--color-strong-fg);
  }
  @media (max-width: 720px) {
    .hero,
    .grid {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
</style>
```

- [ ] **Step 2: Write the FR tags index page**

Create `src/pages/notes/tags/index.astro`:
```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import TagIndex from "@/components/organisms/TagIndex.astro";
import JsonLd from "@/components/atoms/JsonLd.astro";
import { listTagsWithCount } from "@/lib/notes";
import { buildPersonJsonLd } from "@/lib/jsonLd";
import { useTranslations } from "@/i18n/utils";

const locale = "fr" as const;
const t = useTranslations(locale);
const tags = await listTagsWithCount(locale);
---

<MainLayout
  title={t("tags.metaTitle")}
  description={t("tags.deck")}
  locale={locale}
  alternatePath="/en/writing/tags"
>
  <Fragment slot="head"><JsonLd data={buildPersonJsonLd()} /></Fragment>
  <Nav slot="nav" locale={locale} current="notes" />
  <TagIndex locale={locale} tags={tags} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 3: Write the EN tags index page**

Create `src/pages/en/writing/tags/index.astro` — identical except `locale = "en"` and `alternatePath="/notes/tags"`:
```astro
---
import MainLayout from "@/layouts/MainLayout.astro";
import Nav from "@/components/organisms/Nav.astro";
import Footer from "@/components/organisms/Footer.astro";
import TagIndex from "@/components/organisms/TagIndex.astro";
import JsonLd from "@/components/atoms/JsonLd.astro";
import { listTagsWithCount } from "@/lib/notes";
import { buildPersonJsonLd } from "@/lib/jsonLd";
import { useTranslations } from "@/i18n/utils";

const locale = "en" as const;
const t = useTranslations(locale);
const tags = await listTagsWithCount(locale);
---

<MainLayout
  title={t("tags.metaTitle")}
  description={t("tags.deck")}
  locale={locale}
  alternatePath="/notes/tags"
>
  <Fragment slot="head"><JsonLd data={buildPersonJsonLd()} /></Fragment>
  <Nav slot="nav" locale={locale} current="notes" />
  <TagIndex locale={locale} tags={tags} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 4: Build and verify**

Run:
```bash
npx astro check && npm run build
ls dist/notes/tags/index.html dist/en/writing/tags/index.html
grep -c "#indie\|#build\|#claude" dist/notes/tags/index.html
```
Expected: 0 errors / 0 warnings; both tag index HTML files exist; tag entries render.

- [ ] **Step 5: Commit**

```bash
git add src/components/organisms/TagIndex.astro src/pages/notes/tags/index.astro src/pages/en/writing/tags/index.astro
git commit -m "feat(notes): add all-tags index pages (FR + EN)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Homepage highlight in `NotesSection`

Show the featured card at the top of the "Dernières notes" section, with the 3 latest below it (featured excluded).

**Files:**
- Modify: `src/components/organisms/NotesSection.astro`

**Interfaces:**
- Consumes: `loadHomeNotes` (Task 2), `NoteHighlight` (Task 5), existing `NoteRow`, `Highlight`, `NOTES_ON_HOME`.

- [ ] **Step 1: Update the component**

In `src/components/organisms/NotesSection.astro`, replace the frontmatter import + data line and the list rendering.

Change the imports/data block from:
```astro
import { loadLatestNotes } from "@/lib/notes";
import { NOTES_ON_HOME } from "@/lib/constants";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const t = useTranslations(locale);
const notes = await loadLatestNotes(locale, NOTES_ON_HOME);
```
to:
```astro
import NoteHighlight from "@/components/molecules/NoteHighlight.astro";
import { loadHomeNotes } from "@/lib/notes";
import { NOTES_ON_HOME } from "@/lib/constants";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const t = useTranslations(locale);
const { featured, latest } = await loadHomeNotes(locale, NOTES_ON_HOME);
const hasContent = featured !== null || latest.length > 0;
```

Change the section guard from `notes.length > 0 && (` to `hasContent && (`, and the list body from:
```astro
      <div class="list">
        {notes.map((note) => (
          <NoteRow note={note} locale={locale} showExcerpt={false} />
        ))}
      </div>
```
to:
```astro
      {featured && <NoteHighlight note={featured} locale={locale} />}
      <div class="list">
        {latest.map((note) => (
          <NoteRow note={note} locale={locale} showExcerpt={false} />
        ))}
      </div>
```

Leave the `<header>`, headings, `<style>`, and `data-reveal` wrapper untouched.

- [ ] **Step 2: Build and verify the homepage**

Run:
```bash
npx astro check && npm run build
grep -c "tiboug-panier" dist/index.html          # highlight image on FR home
grep -c "tiboug-panier" dist/en/index.html       # highlight image on EN home
```
Expected: 0 errors / 0 warnings; `tiboug-panier` appears at least once on both home pages. Confirm the Ti Boug row is not ALSO listed below the highlight (it is excluded because `latest` comes from `rest`).

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/NotesSection.astro
git commit -m "feat(home): show featured note highlight atop latest notes

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Full verification pass

Run the whole quality gate the CI runs, plus route/behavior assertions, and fix anything that fails.

**Files:** none (verification; fix in the relevant task's files if something fails)

- [ ] **Step 1: Types, lint, format**

Run:
```bash
npx astro check
npm run lint
npm run format:check
```
Expected: all pass, 0 errors / 0 warnings. If format fails, run `npm run format` and re-commit.

- [ ] **Step 2: Build**

Run:
```bash
npm run build
```
Expected: 0 errors / 0 warnings.

- [ ] **Step 3: JSON-LD + contrast validators**

Run:
```bash
npm run validate:jsonld
npm run validate:contrast
```
Expected: both pass. (No new color tokens were introduced, so contrast should be unaffected; the badge reuses `--color-strong-bg/-fg`.)

- [ ] **Step 4: Route + behavior assertions**

Run:
```bash
# archive pagination FR + EN
ls dist/notes/index.html dist/notes/2/index.html
ls dist/en/writing/index.html dist/en/writing/2/index.html
# tag index
ls dist/notes/tags/index.html dist/en/writing/tags/index.html
# existing per-tag pages still generated
ls dist/notes/tags/indie/index.html
# highlight on page 1 only
grep -q "tiboug-panier" dist/notes/index.html && echo "FR p1 highlight OK"
! grep -q "tiboug-panier" dist/notes/2/index.html && echo "FR p2 no highlight OK"
# home highlight
grep -q "tiboug-panier" dist/index.html && echo "FR home highlight OK"
# prev/next link tags on page 2
grep -q 'rel="prev"' dist/notes/2/index.html && echo "prev link OK"
```
Expected: every `ls` succeeds and every `echo` prints its OK line.

- [ ] **Step 5: File-size audit**

Run:
```bash
wc -l src/components/molecules/NoteHighlight.astro \
      src/components/molecules/Pagination.astro \
      src/components/organisms/NotesArchive.astro \
      src/components/organisms/TagIndex.astro \
      src/pages/notes/[...page].astro \
      src/pages/en/writing/[...page].astro \
      src/lib/notes.ts
```
Expected: every `.astro` ≤ 150, `notes.ts` ≤ 120. If any exceeds, extract per CLAUDE.md (e.g. split the hero out of `NotesArchive`).

- [ ] **Step 6: Finish the branch**

Use the `superpowers:finishing-a-development-branch` skill to decide merge/PR/cleanup with the user.

---

## Self-Review Notes

- **Spec coverage:** highlight flag (T1), page-1-only + list exclusion (T6/T7 via `partitionFeatured` + `currentPage`), 5/page (T1 constant + T7 `paginate`), curated filter + `PRIMARY_TAGS` (T1/T6), all-tags index (T8), tag pages unchanged (untouched; asserted T10), homepage highlight + dedup (T9), cover image via `astro:assets` map (T1/T5), i18n + routes (T3), SEO hreflang/prev-next/JSON-LD (T7), thin DRY pages (T6/T7). All spec sections map to a task.
- **Type consistency:** `partitionFeatured` returns `{ featured, rest }` everywhere; page files consume `{ page, featured }` matching `paginate({ props: { featured } })`; `NotesArchive` prop set matches T7 usage; `loadHomeNotes` returns `{ featured, latest }` matching T9.
- **No placeholders:** every code step shows complete content; the only build-time variable (last page number) is called out explicitly in T7 Step 5.
```
