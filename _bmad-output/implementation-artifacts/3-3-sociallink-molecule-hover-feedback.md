# Story 3.3: SocialLink Molecule with Hover Feedback

Status: review

## Story

As a **visitor** (Sophie),
I want social icons to glow and lift when I hover,
So that tapping feels inviting and satisfying.

## Acceptance Criteria

1. **Given** the SocialLink molecule
   **When** it renders with a SocialLink data entry
   **Then** it displays a 48x48px container with 14px border-radius

2. **Given** the SocialLink molecule in default state
   **When** rendered
   **Then** it has gradient background (`rgba(99,102,241,0.15)` → `rgba(139,92,246,0.1)`) with 1px border

3. **Given** the SocialLink molecule
   **When** hovered
   **Then** it shows full gradient fill, scale(1.1), translateY(-2px), 24px glow shadow (FR15)

4. **Given** the SocialLink molecule
   **When** pressed (active state)
   **Then** it shows scale(0.95) press feedback

5. **Given** the SocialLink molecule
   **When** rendered
   **Then** link opens in new tab with `target="_blank" rel="noopener noreferrer"` (FR11)
   **And** `aria-label="Follow on {platform}"` is present (FR24)

6. **Given** the SocialLink molecule
   **When** rendered
   **Then** transition uses 200ms ease timing

## Tasks / Subtasks

- [x] Task 1: Create `src/components/molecules/SocialLink.astro` (AC: #1-#6)
  - [x] 1.1: Create component with Props interface accepting `SocialLink` type
  - [x] 1.2: Render `<a>` element with proper href, target, rel, and aria-label
  - [x] 1.3: Render correct icon atom based on `platform` prop value
  - [x] 1.4: Style 48x48px container with 14px border-radius
  - [x] 1.5: Add default gradient background and 1px border via scoped style
  - [x] 1.6: Add hover state: full gradient, scale(1.1), translateY(-2px), glow shadow
  - [x] 1.7: Add active state: scale(0.95)
  - [x] 1.8: Set transition to 200ms ease
- [x] Task 2: Validate build, accessibility, and formatting (AC: all)
  - [x] 2.1: Run `npm run build` and verify output HTML
  - [x] 2.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/molecules/SocialLink.astro`
- **Molecule rules**: Imports atoms only (icon atoms). Functional unit combining icon + link behavior.
- **Props pattern**: Interface named `Props`, accepts the full `SocialLink` type from types barrel
- **Naming**: PascalCase component file
- **Data flow**: Receives a single `SocialLink` object as prop (platform, url, label)
- **Semantic HTML**: Uses `<a>` tag — never a div with click handler

### Critical Technical Details

**SocialLink.astro structure:**

```astro
---
import type { SocialLink } from "../../types/index";
import IconLinkedin from "../atoms/IconLinkedin.astro";
import IconX from "../atoms/IconX.astro";
import IconInstagram from "../atoms/IconInstagram.astro";
import IconTiktok from "../atoms/IconTiktok.astro";

interface Props {
  link: SocialLink;
}

const { link } = Astro.props;

const iconMap: Record<string, any> = {
  linkedin: IconLinkedin,
  x: IconX,
  instagram: IconInstagram,
  tiktok: IconTiktok,
};

const IconComponent = iconMap[link.platform];
---

<a
  href={link.url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={link.label}
  class="social-link inline-flex items-center justify-center"
>
  <IconComponent />
</a>

<style>
  .social-link {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(
      to bottom right,
      rgba(99, 102, 241, 0.15),
      rgba(139, 92, 246, 0.1)
    );
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: var(--text-primary);
    transition: all 200ms ease;
  }

  .social-link:hover {
    background: linear-gradient(
      to bottom right,
      var(--accent-start),
      var(--accent-end)
    );
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 0 24px var(--glow);
    color: #ffffff;
  }

  .social-link:active {
    transform: scale(0.95);
  }
</style>
```

**Icon rendering approach:**

Astro supports dynamic component rendering. The `iconMap` maps platform strings to imported components, then renders via `<IconComponent />`. This avoids conditionals and makes it easy to add new platforms.

**Important:** Astro's dynamic component rendering works with the pattern above — importing all possible components and selecting based on a key. This is zero-cost since unused icons won't ship (all are used in this project).

**Styling details:**

- **Container**: 48x48px, 14px border-radius — exceeds WCAG 44px minimum touch target
- **Default background**: Subtle gradient from indigo to violet with low opacity
- **Border**: 1px solid with slightly higher opacity than background for definition
- **Color**: `var(--text-primary)` for icon color (via `currentColor` in SVG atoms)
- **Hover**: Full gradient fill using accent tokens, scale up + lift, glow shadow
- **Hover color**: `#ffffff` to make icon visible against gradient background
- **Active**: Scale down for press feedback (overrides hover transform)
- **Transition**: 200ms ease on all properties

**Accessibility:**

- `<a>` semantic element — focusable, activatable with Enter
- `target="_blank"` with `rel="noopener noreferrer"` for security
- `aria-label` from data layer (e.g., "Follow on LinkedIn")
- Icons have `aria-hidden="true"` (set in icon atoms)
- Focus ring handled by global `:focus-visible` rule in global.css

### Previous Story Intelligence (Story 3.2)

- Icon atoms exist: `IconLinkedin.astro`, `IconX.astro`, `IconInstagram.astro`, `IconTiktok.astro`
- All icons use `currentColor` fill — inherits from parent's `color` property
- `src/components/molecules/` directory exists (has HeroIdentity.astro)
- `SocialLink` type defined in `src/types/index.ts` with platform, url, label fields
- Platform values in data: `"linkedin"`, `"x"`, `"instagram"`, `"tiktok"`

### Project Structure Notes

- `src/components/molecules/SocialLink.astro` — new file

### What NOT To Do

- Do NOT use a `<div>` or `<button>` — this is a link, use `<a>`
- Do NOT use `@apply` — keep scoped `<style>` for complex hover/active states
- Do NOT add `motion-safe:` to hover transitions — those are user-initiated, not entrance animations
- Do NOT import data — receives props only
- Do NOT add stagger animation — that's Story 3.4 (SocialBar organism)
- Do NOT use Tailwind's `delay-*` or `transition-*` utilities for this — the hover effect is complex enough to warrant scoped CSS
- Do NOT use arbitrary Tailwind values for the 48px/14px — use scoped style instead
- Do NOT forget `rel="noopener noreferrer"` on external links

### References

- [Source: architecture.md#Atomic-Design-Boundaries] - Molecule: imports atoms, functional unit
- [Source: ux-design-specification.md#SocialIcon] - 48x48px, gradient, hover/active effects
- [Source: project-context.md#Accessibility] - External links: target, rel, aria-label
- [Source: project-context.md#Anti-Patterns] - Never use div with click handler

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — one lint fix required (see below).

### Completion Notes List

- Created SocialLink molecule with dynamic icon rendering via platform-keyed map
- Initial `Record<string, any>` type caused ESLint `no-explicit-any` error
- Fixed by using `Record<string, typeof IconLinkedin>` — all icons share same component type
- Scoped styles handle all hover/active states with 200ms ease transition
- Build, lint, and format all pass cleanly after fix

### File List

- `src/components/molecules/SocialLink.astro` (created)
