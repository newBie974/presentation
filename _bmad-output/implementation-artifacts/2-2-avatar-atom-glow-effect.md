# Story 2.2: Avatar Atom with Glow Effect

Status: review

## Story

As a **visitor**,
I want to see a professional profile photo with a premium glow,
So that I immediately recognize this as a personal brand page.

## Acceptance Criteria

1. **Given** the Avatar atom component
   **When** it renders with a profile image
   **Then** the image displays at 96px circle with 2px gradient border (`accent-start` → `accent-end`)

2. **Given** the Avatar component
   **When** rendering
   **Then** a 40px ambient glow shadow surrounds the avatar (FR3)

3. **Given** the Avatar component
   **When** it renders
   **Then** Astro `<Image />` is used with proper `alt` text and explicit dimensions (CLS=0)
   **And** the image is optimized to WebP/AVIF at build time

4. **Given** the Avatar component
   **When** rendering
   **Then** `aria-label="Aymeric's profile photo"` is present

## Tasks / Subtasks

- [x] Task 1: Add avatar image to project (AC: #3)
  - [x] 1.1: Add a profile image to `src/assets/avatar.png` (placeholder — Astro optimizes to WebP at build)
  - [x] 1.2: Ensure the image is at least 192px (2x for retina) and square aspect ratio
- [x] Task 2: Create `src/components/atoms/Avatar.astro` (AC: #1, #2, #3, #4)
  - [x] 2.1: Create the component file with Props interface: `src: ImageMetadata`, `alt: string`
  - [x] 2.2: Import `Image` from `astro:assets`
  - [x] 2.3: Render outer wrapper with `relative inline-block` for glow positioning
  - [x] 2.4: Add glow shadow element (absolute positioned, rounded-full, 40px box-shadow using `--glow`)
  - [x] 2.5: Add gradient border wrapper (rounded-full, 2px padding, gradient background accent-start → accent-end)
  - [x] 2.6: Render `<Image>` inside with `width={96}` `height={96}` `class="rounded-full"` and the `alt` prop
  - [x] 2.7: Add `role="img"` and `aria-label` on the outer container
- [x] Task 3: Create component directory structure (AC: #1)
  - [x] 3.1: Create `src/components/atoms/` directory if it doesn't exist
- [x] Task 4: Demo Avatar in index.astro (AC: all)
  - [x] 4.1: Import the avatar image from `../assets/avatar.png` in index.astro
  - [x] 4.2: Import Avatar component and render it with the image and alt text
  - [x] 4.3: Verify the avatar renders with gradient border and glow
- [x] Task 5: Validate build and output (AC: #3)
  - [x] 5.1: Run `npm run build` — verify image is optimized (WebP output confirmed in dist/\_astro/)
  - [x] 5.2: Verify built HTML has explicit width/height attributes (CLS=0)
  - [x] 5.3: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/atoms/Avatar.astro`
- **Atom rules**: No child component imports, purely presentational, receives all data via props
- **Image optimization**: Must use `<Image />` from `astro:assets` for WebP/AVIF generation at build time
- **Image source**: Avatar image goes in `src/assets/` (NOT `public/`) for build-time optimization
- **Props pattern**: Interface named `Props`, destructured in frontmatter
- **Naming**: PascalCase component file
- **Accessibility**: `role="img"` + `aria-label` on container, descriptive `alt` on Image

### Critical Technical Details

**Avatar.astro structure:**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  src: ImageMetadata;
  alt: string;
}

const { src, alt } = Astro.props;
---

<div class="relative inline-block" role="img" aria-label={alt}>
  <div class="avatar-glow absolute inset-0 rounded-full"></div>
  <div class="avatar-border rounded-full" style="padding: 2px">
    <Image src={src} alt={alt} width={96} height={96} class="rounded-full" />
  </div>
</div>
```

**Avatar styles (in global.css or component `<style>`):**

Since atoms are self-contained, use a scoped `<style>` block in the component:

```css
.avatar-glow {
  box-shadow: 0 0 40px var(--glow);
}

.avatar-border {
  background: linear-gradient(
    to bottom right,
    var(--accent-start),
    var(--accent-end)
  );
}
```

**Why `src/assets/` not `public/`:**

- Astro's `<Image />` component only optimizes images imported from `src/`
- Images in `public/` are served as-is without WebP/AVIF conversion
- The `avatarPath` in `profile.ts` (`/presentation/avatar.webp`) is for meta tags/OG images, not for the component

**Avatar image requirements:**

- Minimum 192px × 192px (2x for 96px display on retina)
- Square aspect ratio (will be clipped to circle)
- Any format accepted (webp, jpg, png) — Astro converts at build time
- If no real photo available, use a placeholder (solid color circle or generated avatar)

**Responsive scaling (noted for Story 2.4):**

- Mobile: 96px (current implementation)
- Desktop (lg:): 112px (to be added when HeroSection composes this)

**Demo in index.astro:**

```astro
---
import MainLayout from "../layouts/MainLayout.astro";
import Avatar from "../components/atoms/Avatar.astro";
import avatarImage from "../assets/avatar.webp";
---

<MainLayout title="Aymeric - Builder & Creator">
  <Avatar src={avatarImage} alt="Aymeric's profile photo" />
  <h1 class="mt-sm text-2xl font-bold motion-safe:animate-fade-in-up">
    Aymeric
  </h1>
  <p
    class="mt-sm text-text-secondary motion-safe:animate-fade-in-up"
    style="animation-delay: var(--stagger-hero)"
  >
    Builder & Creator
  </p>
</MainLayout>
```

### Previous Story Intelligence (Story 2.1)

- `src/types/index.ts` has `Profile` interface with `avatarPath: string`
- `src/data/profile.ts` exports typed profile with `avatarPath: "/presentation/avatar.webp"`
- `avatarPath` will be used by OG meta tags (Story 5.1), not by the Avatar component directly
- The Avatar component imports the image directly from `src/assets/` for build-time optimization
- `src/components/` directory may not exist yet — needs to be created along with `atoms/` subdirectory

### Project Structure Notes

- `src/assets/avatar.webp` — the actual profile image (optimized at build time)
- `src/components/atoms/Avatar.astro` — the Avatar atom component
- `src/components/atoms/` — first atom, directory needs creation
- No changes to global.css — use scoped `<style>` in the component

### What NOT To Do

- Do NOT put the avatar image in `public/` — it won't be optimized by Astro
- Do NOT use raw `<img>` tag — must use Astro `<Image />` from `astro:assets`
- Do NOT use Tailwind arbitrary values (`shadow-[...]`, `p-[2px]`) — use style attributes for one-off values
- Do NOT use `@apply` — keep Tailwind utilities inline, use scoped CSS for complex styles
- Do NOT import other components in this atom — atoms are self-contained
- Do NOT hard-code the alt text — receive it as a prop
- Do NOT add responsive sizing yet — that's handled in Story 2.4 (HeroSection)
- Do NOT use animation on the glow yet — the UX spec mentions a GlowEffect organism-level animation, not on the atom

### References

- [Source: architecture.md#Atomic-Design-Boundaries] - Avatar.astro as atom, no child imports
- [Source: architecture.md#Image-Optimization] - Astro Image, WebP/AVIF, CLS prevention
- [Source: ux-design-specification.md#Avatar-Atom] - 96px, 2px gradient border, 40px glow
- [Source: ux-design-specification.md#Hero-Section] - Avatar specs in context
- [Source: project-context.md#Astro-Rules] - Use Image from astro:assets, never raw img
- [Source: Astro Docs - Images](https://docs.astro.build/en/guides/images/)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Used scoped `<style>` block for avatar-glow and avatar-border (not global.css, not @apply)
- Gradient border uses wrapper div with `padding: 2px` via style attribute (avoids Tailwind arbitrary values)
- Astro auto-adds `loading="lazy"`, `decoding="async"`, `fetchpriority="auto"` to Image component
- Prettier reformatted index.astro (h1 content on separate line)

### Completion Notes List

- Avatar atom created with Props: `src: ImageMetadata`, `alt: string`
- Uses Astro `<Image />` from `astro:assets` — confirmed WebP optimization at build
- 96px circle with 2px gradient border (accent-start → accent-end via linear-gradient)
- 40px ambient glow via box-shadow using `--glow` CSS variable
- Accessibility: `role="img"` + `aria-label` on container, descriptive `alt` on img
- Built HTML has explicit `width="96" height="96"` — CLS=0
- Placeholder avatar (192x192 solid indigo PNG) — replace with real photo
- Build, lint, and format checks all pass

### File List

- `src/assets/avatar.png` (created: 192x192 placeholder — replace with real photo)
- `src/components/atoms/Avatar.astro` (created: Avatar atom with Image, gradient border, glow)
- `src/pages/index.astro` (modified: imports Avatar + avatar image for demo)
