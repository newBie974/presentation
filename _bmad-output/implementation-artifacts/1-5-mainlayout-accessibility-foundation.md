# Story 1.5: MainLayout & Accessibility Foundation

Status: review

## Story

As a **visitor using assistive technology**,
I want the page to have proper semantic structure and keyboard support,
So that I can navigate and understand the content.

## Acceptance Criteria

1. **Given** the MainLayout component
   **When** it renders
   **Then** HTML has `lang="en"` attribute

2. **Given** the MainLayout component
   **When** the page structure is inspected
   **Then** page contains `<header>`, `<main>`, `<footer>` semantic landmarks

3. **Given** a keyboard user
   **When** they press Tab on page load
   **Then** a skip link appears (hidden until focused, jumps to `#main-content`)
   **And** the skip link is visually hidden but accessible to screen readers

4. **Given** any interactive element
   **When** it receives focus via keyboard
   **Then** a focus-visible ring is displayed (3px solid, accent color, 2px offset) (FR27)

5. **Given** the page
   **When** fonts are loaded
   **Then** system font stack is applied (`system-ui, -apple-system, sans-serif`)

6. **Given** `index.astro`
   **When** it renders
   **Then** it uses MainLayout as wrapper
   **And** content renders inside the `<main>` section

## Tasks / Subtasks

- [x] Task 1: Create `MainLayout.astro` component (AC: #1, #2, #5)
  - [x] 1.1: Create `src/layouts/MainLayout.astro` with Props interface (title, description)
  - [x] 1.2: Add `<html lang="en">` with full head section (charset, viewport, favicon, generator, title)
  - [x] 1.3: Import `global.css` in the layout frontmatter
  - [x] 1.4: Add `<body>` with base token classes (`bg-surface-base text-text-primary font-sans min-h-screen`)
  - [x] 1.5: Add semantic landmarks: `<header>`, `<main id="main-content">`, `<footer>`
- [x] Task 2: Add skip link for keyboard navigation (AC: #3)
  - [x] 2.1: Add skip link as first element inside `<body>` before `<header>`
  - [x] 2.2: Style with `sr-only` by default, visible on `focus` (positioned absolute, styled prominently)
  - [x] 2.3: Link target is `#main-content` (the `<main>` element's id)
- [x] Task 3: Define global focus-visible ring style (AC: #4)
  - [x] 3.1: Add focus-visible styles in `global.css` targeting all interactive elements
  - [x] 3.2: Ring: 3px solid accent-start color, 2px offset, rounded
  - [x] 3.3: Ensure it works on `<a>`, `<button>`, and other focusable elements
- [x] Task 4: Update `index.astro` to use MainLayout (AC: #6)
  - [x] 4.1: Remove HTML shell from `index.astro` (html, head, body tags)
  - [x] 4.2: Import and wrap content with `<MainLayout>` component
  - [x] 4.3: Keep existing demo content (heading + paragraph) inside the slot
- [x] Task 5: Validate build and accessibility (AC: all)
  - [x] 5.1: Run `npm run build` and verify output HTML has correct landmarks
  - [x] 5.2: Verify built HTML contains skip link, lang attribute, semantic elements
  - [x] 5.3: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **MainLayout** lives at `src/layouts/MainLayout.astro` (per architecture directory structure)
- **Slot-based composition** — MainLayout wraps page content via Astro's `<slot />`
- **Props**: `title` (page title) and `description` (meta description, optional for now)
- **Semantic landmarks**: `<header>`, `<main>`, `<footer>` — required for screen reader navigation
- **Skip link**: First focusable element, hidden until focused, links to `#main-content`
- **Focus ring**: Global style for all interactive elements (FR27)
- **System font**: Already defined as `--font-sans` token in global.css (`system-ui, -apple-system, sans-serif`)

### Critical Technical Details

**MainLayout.astro structure:**

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;

import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body class="min-h-screen bg-surface-base font-sans text-text-primary">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header>
      <!-- Header content added in later stories -->
    </header>
    <main id="main-content" class="mx-auto max-w-md px-lg py-xl">
      <slot />
    </main>
    <footer>
      <!-- Footer content added in later stories -->
    </footer>
  </body>
</html>
```

**Skip link styling (in global.css):**

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 8px 16px;
  background: var(--accent-start);
  color: #ffffff;
  border-radius: 0 0 8px 8px;
  font-weight: 600;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

**Focus-visible global style (in global.css):**

```css
:focus-visible {
  outline: 3px solid var(--accent-start);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Updated index.astro:**

```astro
---
import MainLayout from "../layouts/MainLayout.astro";
---

<MainLayout title="Aymeric - Builder & Creator">
  <h1 class="text-2xl font-bold motion-safe:animate-fade-in-up">Aymeric</h1>
  <p
    class="mt-sm text-text-secondary motion-safe:animate-fade-in-up"
    style="animation-delay: var(--stagger-hero)"
  >
    Builder & Creator
  </p>
</MainLayout>
```

**Astro Props pattern:**

- Interface named `Props` (Astro convention)
- Destructured in frontmatter
- `title` is required, `description` is optional

### Previous Story Intelligence (Story 1.4)

- `src/styles/global.css` contains design tokens (@theme inline, @theme) and animation system
- `index.astro` currently has full HTML shell (html, head, body) — must be moved to MainLayout
- The `global.css` import currently in `index.astro` frontmatter — move to MainLayout
- Demo content uses `motion-safe:animate-fade-in-up` — keep this in index.astro
- `src/layouts/` directory already exists (created in Story 1.1)
- ESLint + Prettier will auto-format on commit

### Project Structure Notes

- `src/layouts/MainLayout.astro` — the only layout file
- Skip link + focus styles added to `src/styles/global.css`
- `index.astro` becomes minimal (just imports layout + content)
- `<header>` and `<footer>` are empty landmarks for now — filled by later stories

### What NOT To Do

- Do NOT add navigation elements yet — this story is just the structural foundation
- Do NOT add content to `<header>` or `<footer>` — those are for later stories
- Do NOT use Tailwind `@apply` for skip-link styles — use regular CSS (it's a one-off element)
- Do NOT use `<div>` where semantic elements belong — use `<header>`, `<main>`, `<footer>`
- Do NOT forget the `id="main-content"` on `<main>` — skip link targets it
- Do NOT remove the favicon link from the head
- Do NOT add OG meta tags yet — those are Story 5.1

### References

- [Source: architecture.md#Project-Structure-Boundaries] - MainLayout.astro location and purpose
- [Source: architecture.md#Accessibility-Enforcement] - Semantic HTML, focus-visible ring
- [Source: ux-design-specification.md#Keyboard-Navigation] - Skip link, focus indicators
- [Source: ux-design-specification.md#Accessibility-Strategy] - WCAG AAA, landmarks, focus ring specs
- [Source: project-context.md#Accessibility] - Focus indicators, semantic landmarks, heading order

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Skip link uses regular CSS (not Tailwind @apply) as specified in story constraints
- Focus-visible uses `:focus-visible` pseudo-class (not `:focus`) for keyboard-only focus ring
- Kept both favicon links (svg + ico) from original index.astro in MainLayout

### Completion Notes List

- MainLayout.astro created with Props interface (title required, description optional)
- HTML has `lang="en"` attribute on root element
- Semantic landmarks: `<header>`, `<main id="main-content">`, `<footer>` present
- Skip link positioned absolute, hidden off-screen, revealed on focus at top center
- Focus-visible ring: 3px solid accent-start, 2px offset, 4px border-radius
- System font stack applied via `font-sans` class (maps to `--font-sans` token)
- index.astro refactored to use MainLayout — HTML shell removed, content in slot
- Build, lint, and format checks all pass

### File List

- `src/layouts/MainLayout.astro` (created: layout with Props, landmarks, skip link, slot)
- `src/styles/global.css` (modified: added skip-link styles and :focus-visible ring)
- `src/pages/index.astro` (modified: removed HTML shell, uses MainLayout wrapper)
