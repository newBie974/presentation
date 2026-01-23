# Story 1.1: Project Initialization

Status: done

## Story

As a **developer**,
I want the Astro project initialized with TypeScript and Tailwind CSS v4,
So that I have a working development environment matching the architecture.

## Acceptance Criteria

1. **Given** a fresh repository
   **When** the initialization commands are run
   **Then** Astro v5.x is installed with `strict` TypeScript preset

2. **Given** the Astro project is initialized
   **When** Tailwind CSS v4 is configured
   **Then** it uses `@tailwindcss/vite` plugin (NOT deprecated `@astrojs/tailwind`)
   **And** `src/styles/global.css` imports Tailwind with `@import "tailwindcss"`

3. **Given** the project configuration
   **When** `astro.config.mjs` is reviewed
   **Then** it has `output: 'static'` and `site: 'https://newbie974.github.io'`
   **And** the `@tailwindcss/vite` plugin is in the `vite.plugins` array

4. **Given** the configured project
   **When** `npm run dev` is executed
   **Then** the dev server serves at `localhost:4321` without errors

5. **Given** the configured project
   **When** `npm run build` is executed
   **Then** static files are produced in `dist/`

## Tasks / Subtasks

- [x] Task 1: Scaffold Astro project with minimal template (AC: #1)
  - [x] 1.1: Run `npm create astro@latest . -- --template minimal --no` in the project root (--no skips all prompts, strict TS is default in v5)
  - [x] 1.2: Verify `tsconfig.json` extends `astro/tsconfigs/strict`
  - [x] 1.3: Verify `package.json` has Astro v5.x dependency
- [x] Task 2: Install and configure Tailwind CSS v4 via Vite plugin (AC: #2, #3)
  - [x] 2.1: Install dependencies: `npm install tailwindcss @tailwindcss/vite`
  - [x] 2.2: Create `src/styles/global.css` with `@import "tailwindcss";`
  - [x] 2.3: Update `astro.config.mjs` to add `@tailwindcss/vite` plugin in `vite.plugins` array
  - [x] 2.4: Set `output: 'static'` and `site: 'https://newbie974.github.io'` in astro config
- [x] Task 3: Create Atomic Design directory structure (AC: foundational)
  - [x] 3.1: Create `src/components/atoms/` directory
  - [x] 3.2: Create `src/components/molecules/` directory
  - [x] 3.3: Create `src/components/organisms/` directory
  - [x] 3.4: Create `src/data/` directory
  - [x] 3.5: Create `src/types/` directory
  - [x] 3.6: Create `src/layouts/` directory
- [x] Task 4: Create placeholder files for type safety (AC: foundational)
  - [x] 4.1: Create `src/types/index.ts` with placeholder export (`export {}`)
  - [x] 4.2: Verify TypeScript compilation works (validated via successful `npm run build`)
- [x] Task 5: Verify dev server and build (AC: #4, #5)
  - [x] 5.1: Run `npm run dev` and confirm localhost:4321 serves without errors
  - [x] 5.2: Run `npm run build` and confirm `dist/` output is generated
  - [x] 5.3: Verify `dist/index.html` contains Tailwind-processed CSS

## Dev Notes

### Architecture Requirements

- **Starter template:** `npm create astro@latest -- --template minimal` (strict TS is default in Astro v5, no need for separate flag)
- **Tailwind v4 setup:** Use `@tailwindcss/vite` plugin directly in `astro.config.mjs` under `vite.plugins` — NOT the deprecated `@astrojs/tailwind` integration
- **Output mode:** `output: 'static'` — no SSR, no server endpoints
- **Site URL:** `https://newbie974.github.io` — required for canonical URLs and OG tags later

### Critical Technical Details

**Astro v5.x Changes:**

- Strict TypeScript is now the DEFAULT for all new projects — no `--typescript strict` flag needed
- The `--no` flag skips all interactive prompts during scaffolding
- `tsconfig.json` should extend `astro/tsconfigs/strict`

**Tailwind CSS v4 Changes:**

- No `tailwind.config.js` file is needed for basic setup — config can be done in CSS with `@theme` directive
- However, we WILL create `tailwind.config.mjs` in Story 1.3 for design tokens
- The `@tailwindcss/vite` plugin handles automatic content detection — no content globs needed
- Import is simply `@import "tailwindcss";` in CSS (no layers/components/utilities directives)
- Minimum browser support: Safari 16.4+, Chrome 111+, Firefox 128+

**Astro Config Pattern:**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  site: "https://newbie974.github.io",
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Global CSS Pattern:**

```css
/* src/styles/global.css */
@import "tailwindcss";
```

### Project Structure Notes

- Alignment with unified project structure from architecture.md
- Directory structure created here is foundational — actual component files added in later stories
- `src/layouts/` will contain `MainLayout.astro` (Story 1.5)
- `src/types/index.ts` is the barrel export for all type interfaces
- Keep `src/pages/index.astro` from the minimal template — it will be the single page entry

### What NOT To Do

- Do NOT run `npx astro add tailwind` — this may install the deprecated `@astrojs/tailwind` integration
- Do NOT create a `postcss.config.cjs` — Tailwind v4 Vite plugin doesn't need PostCSS
- Do NOT create a `tailwind.config.mjs` yet — that's Story 1.3 (Design Tokens)
- Do NOT add any content/components beyond directory structure — keep this story minimal
- Do NOT install additional dependencies beyond astro + tailwindcss + @tailwindcss/vite

### References

- [Source: architecture.md#Starter-Template-Evaluation] - Initialization command and rationale
- [Source: architecture.md#Project-Structure-Boundaries] - Complete directory structure
- [Source: project-context.md#Technology-Stack] - Version requirements
- [Source: project-context.md#Tailwind-CSS-v4-Rules] - Import pattern, no @apply, no arbitrary values
- [Source: ux-design-specification.md#Design-System-Foundation] - Custom design system on Tailwind
- [Source: Tailwind CSS Docs](https://tailwindcss.com/docs/installation/framework-guides/astro) - Official Astro + Tailwind v4 guide
- [Source: Astro Docs](https://docs.astro.build/en/install-and-setup/) - Astro installation guide

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Scaffolding required temp directory workaround (project root not empty due to `_bmad-output/`)
- `npx astro check` requires optional `@astrojs/check` dependency — TypeScript validated via successful build instead

### Completion Notes List

- Astro v5.16.15 scaffolded with strict TypeScript (default in v5)
- Tailwind CSS v4.1.18 configured via `@tailwindcss/vite` plugin
- `astro.config.mjs` configured with static output, site URL, and Tailwind vite plugin
- Atomic Design directory structure created (atoms/molecules/organisms/data/types/layouts)
- Dev server confirmed working at localhost:4321
- Build produces static HTML with Tailwind CSS processed output
- All 5 acceptance criteria satisfied

### File List

- `package.json` (modified: name, added tailwindcss + @tailwindcss/vite deps)
- `astro.config.mjs` (modified: added output, site, vite.plugins)
- `tsconfig.json` (created by scaffold: extends strict)
- `src/pages/index.astro` (modified: added global.css import)
- `src/styles/global.css` (created: @import "tailwindcss")
- `src/types/index.ts` (created: placeholder barrel export)
- `src/components/atoms/` (created: directory)
- `src/components/molecules/` (created: directory)
- `src/components/organisms/` (created: directory)
- `src/data/` (created: directory)
- `src/layouts/` (created: directory)
- `.gitignore` (created by scaffold)
- `.vscode/` (created by scaffold)
- `public/favicon.svg` (created by scaffold)
- `README.md` (created by scaffold)
