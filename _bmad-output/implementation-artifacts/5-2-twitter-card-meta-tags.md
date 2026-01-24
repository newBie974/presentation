# Story 5.2: Twitter Card Meta Tags

Status: done

## Story

As a **visitor sharing the page on X (Twitter)**,
I want a large image card to appear in the tweet,
So that the link stands out in the feed.

## Acceptance Criteria

1. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `twitter:card` set to `summary_large_image`

2. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `twitter:title` matching the OG title (page title prop)

3. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `twitter:description` matching the OG description

4. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `twitter:image` pointing to the same OG image (absolute URL)

5. **Given** the MainLayout component head section
   **When** the page is rendered
   **Then** it includes `twitter:creator` set to Aymeric's X handle (FR22)

## Tasks / Subtasks

- [x] Task 1: Update `src/layouts/MainLayout.astro` to include Twitter Card meta tags (AC: #1-#5)
  - [x] 1.1: Add `twitter:card` meta tag set to "summary_large_image"
  - [x] 1.2: Add `twitter:title` meta tag using the page title prop
  - [x] 1.3: Add `twitter:description` meta tag using the description prop (with fallback)
  - [x] 1.4: Add `twitter:image` meta tag with absolute URL to og-image.png
  - [x] 1.5: Add `twitter:creator` meta tag with X handle
- [x] Task 2: Validate build and formatting (AC: all)
  - [x] 2.1: Run `npm run build` and verify Twitter Card tags in output HTML
  - [x] 2.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Primary file**: `src/layouts/MainLayout.astro` — all meta tags live in the `<head>`
- **Static output**: Meta tags are embedded in HTML at build time
- **Props pattern**: MainLayout already has `title: string` and `description?: string` props
- **No new props needed**: Twitter Card tags reuse existing title/description values

### Critical Technical Details

**Twitter Card meta tags to add in `<head>` (after OG tags):**

```astro
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta
  name="twitter:description"
  content={description || "Builder & Creator — AI-powered SaaS products"}
/>
<meta
  name="twitter:image"
  content={new URL("presentation/og-image.png", Astro.site).href}
/>
<meta name="twitter:creator" content="@aymeric" />
```

**Key decisions:**

- `twitter:card` = `summary_large_image` — displays a large image preview in tweets
- `twitter:title` and `twitter:description` mirror OG values (same props, same fallback)
- `twitter:image` uses the same absolute URL as `og:image`
- `twitter:creator` uses the X handle from socialLinks data (`@aymeric`)

**Note on twitter:site vs twitter:creator:**

- `twitter:creator` — the @username of the content creator (the person)
- `twitter:site` — the @username of the website (optional, same as creator for personal sites)
- For a personal landing page, only `twitter:creator` is needed

**Meta tag naming:**

- OG tags use `property` attribute: `<meta property="og:..." />`
- Twitter tags use `name` attribute: `<meta name="twitter:..." />`
- This is per the respective specifications

### Previous Story Intelligence (Story 5.1)

- OG meta tags already in MainLayout.astro `<head>` (title, description, image, url, type, site_name)
- `og:image` URL: `new URL("presentation/og-image.png", Astro.site).href`
- Description fallback: `"Builder & Creator — AI-powered SaaS products"`
- X handle from socialLinks: `https://x.com/aymeric` → creator handle is `@aymeric`
- `public/og-image.png` already exists (1200x630px placeholder)

### Project Structure Notes

- `src/layouts/MainLayout.astro` — updated to add Twitter Card meta tags after OG section

### What NOT To Do

- Do NOT add `twitter:site` — not needed for personal landing page
- Do NOT use `property` attribute for Twitter tags — use `name` attribute
- Do NOT create a separate Twitter image — reuse the OG image
- Do NOT add JSON-LD or canonical — that's Story 5.3
- Do NOT modify the body or any components — only `<head>` changes
- Do NOT add `twitter:image:alt` — optional and not in spec requirements

### References

- [Source: epics.md#Epic-5-Story-5.2] - Twitter Card: card type, title, description, image, creator
- [Source: architecture.md#SEO-Social-Sharing] - Meta tags in MainLayout head
- [Source: socialLinks.ts] - X platform URL for creator handle

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Added 5 Twitter Card meta tags to MainLayout.astro `<head>` after OG section
- `twitter:card` = "summary_large_image" for large preview
- `twitter:title` and `twitter:description` mirror OG values (same fallback)
- `twitter:image` reuses the same absolute URL as og:image
- `twitter:creator` = "@aymeric" (from socialLinks X handle)
- Used `name` attribute (not `property`) per Twitter Card specification
- Build, lint, and format all pass cleanly

### File List

- `src/layouts/MainLayout.astro` (updated)
