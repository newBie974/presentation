# Story 5.3: SEO & Structured Data

Status: done

## Story

As a **search engine crawler**,
I want proper meta tags and structured data,
So that the page is correctly indexed and discoverable.

## Acceptance Criteria

1. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** `<meta name="description">` is always present (uses fallback if prop not provided)

2. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** `<link rel="canonical">` points to the site URL (`https://newbie974.github.io/presentation/`)

3. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** `<meta name="robots" content="index, follow">` is present

4. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** JSON-LD structured data with `@type: "Person"` is included in a `<script type="application/ld+json">` tag

5. **Given** the JSON-LD structured data
   **When** parsed
   **Then** it includes `name`, `url`, and `sameAs` array with social link URLs (FR23)

## Tasks / Subtasks

- [x] Task 1: Update `src/layouts/MainLayout.astro` with SEO meta tags (AC: #1-#3)
  - [x] 1.1: Ensure `<meta name="description">` always renders (with fallback)
  - [x] 1.2: Add `<link rel="canonical">` with full site URL
  - [x] 1.3: Add `<meta name="robots" content="index, follow">`
- [x] Task 2: Add JSON-LD structured data to MainLayout (AC: #4, #5)
  - [x] 2.1: Create Person schema object with name, url, sameAs
  - [x] 2.2: Render as `<script type="application/ld+json">` in `<head>`
- [x] Task 3: Validate build and formatting (AC: all)
  - [x] 3.1: Run `npm run build` and verify SEO tags + JSON-LD in output HTML
  - [x] 3.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Primary file**: `src/layouts/MainLayout.astro` — all meta tags and JSON-LD live in the `<head>`
- **Static output**: All SEO content is embedded at build time
- **Props pattern**: MainLayout already has `title` and `description` props
- **Data imports**: May import `socialLinks` for `sameAs` URLs in JSON-LD

### Critical Technical Details

**SEO meta tags to add/update:**

```astro
<!-- Always render description (with fallback) -->
<meta
  name="description"
  content={description || "Builder & Creator — AI-powered SaaS products"}
/>

<!-- SEO -->
<link rel="canonical" href={Astro.url.href} />
<meta name="robots" content="index, follow" />
```

**Note on description:** Currently `description` only renders conditionally (`{description && ...}`). For SEO, it should ALWAYS render with a fallback value. Replace the conditional with an always-present tag.

**JSON-LD Person schema:**

```astro
<script
  type="application/ld+json"
  set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aymeric",
    url: new URL("presentation/", Astro.site).href,
    sameAs: [
      "https://linkedin.com/in/aymeric",
      "https://x.com/aymeric",
      "https://instagram.com/aymeric",
      "https://tiktok.com/@aymeric",
    ],
  })}
/>
```

**Why `set:html`:** Astro's `set:html` directive injects raw HTML content without escaping. This is needed for JSON-LD because the JSON string should not be HTML-escaped inside the `<script>` tag.

**Alternative approach for JSON-LD:**

```astro
---
import { socialLinks } from "../data/socialLinks";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aymeric",
  url: new URL("presentation/", Astro.site).href,
  sameAs: socialLinks.map((link) => link.url),
};
---

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

This approach imports `socialLinks` to dynamically build the `sameAs` array, ensuring it stays in sync with the actual social links data.

**Updated MainLayout.astro head section (final state):**

```astro
<head>
  <meta charset="utf-8" />
  <link
    rel="icon"
    type="image/svg+xml"
    href={`${import.meta.env.BASE_URL}/favicon.svg`}
  />
  <link rel="icon" href={`${import.meta.env.BASE_URL}/favicon.ico`} />
  <meta name="viewport" content="width=device-width" />
  <meta name="generator" content={Astro.generator} />
  <title>{title}</title>
  <meta
    name="description"
    content={description || "Builder & Creator — AI-powered SaaS products"}
  />
  <link rel="canonical" href={Astro.url.href} />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  ...existing OG tags...

  <!-- Twitter Card -->
  ...existing Twitter tags...

  <!-- Structured Data -->
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
</head>
```

**Canonical URL:** Uses `Astro.url.href` which resolves to `https://newbie974.github.io/presentation/` for the index page. This is the same value used for `og:url`.

### Previous Story Intelligence (Story 5.2)

- MainLayout.astro already has OG + Twitter Card meta tags in `<head>`
- `description` prop is optional with conditional rendering — needs to become always-present with fallback
- `Astro.url.href` already used for `og:url`
- Social links data: `src/data/socialLinks.ts` exports `socialLinks: SocialLink[]` with 4 entries
- Site URL: `https://newbie974.github.io`, base: `/presentation`

### Project Structure Notes

- `src/layouts/MainLayout.astro` — updated to add canonical, robots, always-present description, JSON-LD

### What NOT To Do

- Do NOT add `sitemap.xml` generation — out of scope for this story (can be added via Astro integration later)
- Do NOT hardcode social URLs in JSON-LD — import from socialLinks data to stay DRY
- Do NOT use `innerHTML` — use Astro's `set:html` directive for script content
- Do NOT add `@type: "WebSite"` — the spec calls for `Person` type only
- Do NOT forget to remove the conditional `description` render and replace with always-present
- Do NOT escape the JSON-LD content — `set:html` handles raw injection

### References

- [Source: epics.md#Epic-5-Story-5.3] - canonical, robots, JSON-LD Person schema
- [Source: architecture.md#SEO-Social-Sharing] - Meta tags in MainLayout head
- [Source: project-context.md#Astro-Rules] - Static output, set:html for raw content
- [Source: socialLinks.ts] - Social platform URLs for sameAs array

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Replaced conditional description with always-present meta tag using `metaDescription` variable
- Added `<link rel="canonical">` using `Astro.url.href`
- Added `<meta name="robots" content="index, follow">`
- Created JSON-LD Person schema with name, url, and sameAs array
- Imported socialLinks data to dynamically populate sameAs (stays in sync with social data)
- Used `set:html` directive for unescaped JSON-LD injection
- Refactored OG/Twitter description to reuse `metaDescription` variable (DRY)
- Build, lint, and format all pass cleanly

### File List

- `src/layouts/MainLayout.astro` (updated)
