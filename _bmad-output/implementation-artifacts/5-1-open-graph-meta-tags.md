# Story 5.1: Open Graph Meta Tags

Status: done

## Story

As a **visitor sharing the page on social media**,
I want a rich preview to appear with image, title, and description,
So that the shared link looks professional and inviting.

## Acceptance Criteria

1. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `og:title` set to "Aymeric - Builder & Creator"

2. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `og:description` with a concise professional summary

3. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `og:image` pointing to the absolute URL of `/presentation/og-image.png` (1200x630px)

4. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `og:url` set to the canonical site URL (`https://newbie974.github.io/presentation/`)

5. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `og:type` set to `website` (FR21)

6. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `og:site_name` set to "Aymeric"

7. **Given** the `public/` directory
   **When** the project is built
   **Then** `og-image.png` (1200x630px) exists and is copied to the dist output

## Tasks / Subtasks

- [x] Task 1: Create OG image placeholder in `public/og-image.png` (AC: #3, #7)
  - [x] 1.1: Create a 1200x630px PNG image for social preview in `public/`
- [x] Task 2: Update `src/layouts/MainLayout.astro` to include OG meta tags (AC: #1-#6)
  - [x] 2.1: Add `og:title` meta tag using the page title prop
  - [x] 2.2: Add `og:description` meta tag using the description prop
  - [x] 2.3: Add `og:image` meta tag with absolute URL to og-image.png
  - [x] 2.4: Add `og:url` meta tag with canonical site URL
  - [x] 2.5: Add `og:type` meta tag set to "website"
  - [x] 2.6: Add `og:site_name` meta tag set to "Aymeric"
- [x] Task 3: Validate build and formatting (AC: all)
  - [x] 3.1: Run `npm run build` and verify OG tags in output HTML
  - [x] 3.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Primary file**: `src/layouts/MainLayout.astro` — all meta tags live in the `<head>`
- **Static output**: Meta tags are embedded in HTML at build time (no runtime computation)
- **Props pattern**: MainLayout already has `title: string` and `description?: string` props
- **Public assets**: `public/og-image.png` is copied directly to `dist/` root by Astro

### Critical Technical Details

**OG meta tags to add in `<head>`:**

```astro
<meta property="og:title" content={title} />
<meta
  property="og:description"
  content={description || "Builder & Creator — AI-powered SaaS products"}
/>
<meta property="og:image" content={`${Astro.site}presentation/og-image.png`} />
<meta property="og:url" content={Astro.url.href} />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Aymeric" />
```

**URL construction:**

- `Astro.site` returns `https://newbie974.github.io/` (from `astro.config.mjs` site field — note: no trailing base path)
- Base path is `/presentation` (from `astro.config.mjs` base field)
- OG image absolute URL: `https://newbie974.github.io/presentation/og-image.png`
- Canonical URL: `https://newbie974.github.io/presentation/`

**Important:** Astro's `Astro.site` gives `https://newbie974.github.io/` and `import.meta.env.BASE_URL` gives `/presentation`. For og:image we need the full absolute URL including base path. Use string concatenation: `${Astro.site}presentation/og-image.png` or use `new URL('/presentation/og-image.png', Astro.site).href`.

**OG image requirements:**

- Dimensions: 1200x630px (standard OG image size)
- Format: PNG
- Location: `public/og-image.png`
- Content: Should represent the site visually (dark background, name, tagline)
- Since we can't generate a real design image in code, create a simple placeholder PNG. The user can replace it later with a proper design.

**Alternative approach for og:image placeholder:**

Since generating a real 1200x630 PNG programmatically is not trivial, we have two options:

1. Create a minimal valid PNG file as placeholder (user replaces later)
2. Use an SVG-based approach (but OG requires raster image)

The recommended approach is to create a minimal 1x1 PNG placeholder and note that the user should replace it with a properly designed 1200x630 image.

**Updated MainLayout.astro head section:**

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
  {description && <meta name="description" content={description} />}

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta
    property="og:description"
    content={description || "Builder & Creator — AI-powered SaaS products"}
  />
  <meta
    property="og:image"
    content={new URL("presentation/og-image.png", Astro.site).href}
  />
  <meta property="og:url" content={Astro.url.href} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Aymeric" />
</head>
```

**Fallback description:**

If `description` prop is not provided, use a sensible default: `"Builder & Creator — AI-powered SaaS products"`. This matches the profile tagline enriched with context.

### Previous Story Intelligence (Story 4.4)

- `MainLayout.astro` already has `title` and optional `description` props
- `astro.config.mjs` has `site: 'https://newbie974.github.io'` and `base: '/presentation'`
- `public/` directory exists with favicon.svg and favicon.ico
- Profile data: name="Aymeric", tagline="Builder & Creator"
- Page title currently passed as "Aymeric - Builder & Creator" from index.astro

### Project Structure Notes

- `public/og-image.png` — new file (placeholder, user replaces)
- `src/layouts/MainLayout.astro` — updated to add OG meta tags

### What NOT To Do

- Do NOT use relative URLs for og:image — social crawlers need absolute URLs
- Do NOT hardcode the site URL — use `Astro.site` from config
- Do NOT add Twitter Card tags — that's Story 5.2
- Do NOT add JSON-LD structured data — that's Story 5.3
- Do NOT add `<link rel="canonical">` — that's Story 5.3
- Do NOT modify the body or any components — only `<head>` changes
- Do NOT use `import.meta.env.SITE` — use `Astro.site` (the standard Astro API)
- Do NOT forget the base path when constructing og:image URL

### References

- [Source: architecture.md#SEO-Social-Sharing] - Meta tags in MainLayout head
- [Source: epics.md#Epic-5-Story-5.1] - OG title, description, image, url, type, site_name
- [Source: project-context.md#Astro-Rules] - Static output, Props interface pattern
- [Source: astro.config.mjs] - site URL and base path configuration

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Added 6 OG meta tags to MainLayout.astro `<head>` section
- Used `Astro.site` + base path for absolute og:image URL construction
- Used `Astro.url.href` for og:url (canonical page URL)
- Fallback description: "Builder & Creator — AI-powered SaaS products" when prop not provided
- Created 1200x630px dark background (#0a0a0f) PNG placeholder in public/og-image.png
- User should replace og-image.png with a properly designed social preview image
- Build output verified: all OG tags render correctly in dist/index.html
- Build, lint, and format all pass cleanly

### File List

- `src/layouts/MainLayout.astro` (updated)
- `public/og-image.png` (created — placeholder)
