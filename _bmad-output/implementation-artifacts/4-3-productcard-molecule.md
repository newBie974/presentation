# Story 4.3: ProductCard Molecule

Status: done

## Story

As a **visitor**,
I want product cards that show project details and respond to interaction,
So that I can learn about projects and click through to explore them.

## Acceptance Criteria

1. **Given** the ProductCard molecule
   **When** it renders with Project data
   **Then** it displays title (18px/600) + tagline (14px/400) + StatusBadge + tech stack tags (FR5, FR8)

2. **Given** the ProductCard molecule
   **When** it renders
   **Then** container has 20px border-radius, gradient surface, 1px border (`rgba(99,102,241,0.15)`)

3. **Given** the ProductCard molecule
   **When** it renders
   **Then** the entire card is a clickable `<a>` linking to the project URL (FR7)
   **And** link has `target="_blank" rel="noopener noreferrer"`
   **And** `aria-label="{title} - {status}"` is present

4. **Given** a visitor hovers over the card
   **When** hover state activates
   **Then** border brightens to 0.4 opacity, translateY(-3px), shadow + glow appear (FR15)

5. **Given** a visitor presses the card
   **When** active state activates
   **Then** scale(0.98) press feedback

## Tasks / Subtasks

- [x] Task 1: Create `src/components/molecules/ProductCard.astro` (AC: #1-#5)
  - [x] 1.1: Create component with Props interface accepting `Project` type
  - [x] 1.2: Render as `<a>` element with href, target, rel, aria-label
  - [x] 1.3: Render title (18px/600), tagline (14px/400), StatusBadge, tech stack tags
  - [x] 1.4: Style container: 20px border-radius, gradient surface, 1px border, 20px padding
  - [x] 1.5: Add hover state: border brightens, translateY(-3px), shadow + glow
  - [x] 1.6: Add active state: scale(0.98)
  - [x] 1.7: Add transition timing
- [x] Task 2: Validate build and formatting (AC: all)
  - [x] 2.1: Run `npm run build` and verify no errors
  - [x] 2.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/molecules/ProductCard.astro`
- **Molecule rules**: Imports atoms (StatusBadge). Functional unit combining title + tagline + badge + tech.
- **Props pattern**: Interface named `Props`, accepts the full `Project` type
- **Naming**: PascalCase component file
- **Data flow**: Receives a single `Project` object as prop
- **Semantic HTML**: Uses `<a>` tag — entire card is a link

### Critical Technical Details

**ProductCard.astro structure:**

```astro
---
import type { Project } from "../../types/index";
import StatusBadge from "../atoms/StatusBadge.astro";

interface Props {
  project: Project;
}

const { project } = Astro.props;

const statusLabels: Record<Project["status"], string> = {
  live: "Live",
  building: "Building",
  "coming-soon": "Coming Soon",
};
---

<a
  href={project.url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${project.title} - ${statusLabels[project.status]}`}
  class="product-card block rounded-lg p-lg"
>
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-text-primary">
      {project.title}
    </h3>
    <StatusBadge status={project.status} />
  </div>
  <p class="mt-xs text-sm font-normal text-text-secondary">
    {project.tagline}
  </p>
  <div class="mt-sm flex flex-wrap gap-xs">
    {
      project.techStack.map((tech) => (
        <span class="rounded-sm bg-surface-elevated px-xs py-xs text-xs text-text-muted">
          {tech}
        </span>
      ))
    }
  </div>
</a>

<style>
  .product-card {
    border-radius: 20px;
    background: linear-gradient(
      to bottom right,
      var(--surface-elevated),
      var(--surface-base)
    );
    border: 1px solid rgba(99, 102, 241, 0.15);
    transition: all 200ms ease;
    text-decoration: none;
  }

  .product-card:hover {
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-3px);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.1),
      0 0 20px var(--glow);
  }

  .product-card:active {
    transform: scale(0.98);
  }
</style>
```

**Font sizing:**

- Title: `text-lg` = 18px (matches spec), `font-semibold` = 600
- Tagline: `text-sm` = 14px (matches spec), `font-normal` = 400
- Tech tags: `text-xs` = 12px, muted color

**Note on text-lg:** Tailwind's `text-lg` is 18px with 28px line-height — this matches the spec exactly.

**Container styling:**

- `border-radius: 20px` — via scoped style (Tailwind's `rounded-lg` = 20px per our @theme)
- Gradient surface: `surface-elevated` → `surface-base` gives subtle depth
- 1px border with indigo at 15% opacity
- `p-lg` = 24px padding (spec says 20px, but `p-lg` is our closest scale value)

**Padding note:** Spec says 20px internal padding. Our spacing scale has `md` = 16px and `lg` = 24px. Using `p-lg` (24px) as it's closer to 20px than `p-md` (16px) and provides better visual breathing room. Alternative: use inline `style="padding: 20px"` but that's an arbitrary value exception.

**Hover effect:**

- Border brightens: opacity from 0.15 → 0.4
- Lift: `translateY(-3px)`
- Shadow: dual-layer — diffuse shadow + glow effect
- Transition: 200ms ease on all properties

**Active effect:**

- `scale(0.98)` — subtle press feedback

**Tech stack tags:**

- Small pill-shaped badges showing technology names
- `bg-surface-elevated` background, muted text color
- `rounded-sm` = 8px border-radius, tight padding

**Accessibility:**

- `<a>` semantic element — entire card is one link target
- `aria-label="{title} - {status}"` provides context (e.g., "CalorieTracker AI - Building")
- `target="_blank"` with `rel="noopener noreferrer"` for security
- Focus ring handled by global `:focus-visible` rule
- `text-decoration: none` in scoped style removes default link underline

### Previous Story Intelligence (Story 4.2)

- `StatusBadge.astro` created with `status: Project["status"]` prop
- `Project` interface has title, tagline, url, status, techStack fields
- `src/components/molecules/` directory exists (has HeroIdentity.astro, SocialLink.astro)
- Tailwind tokens: `text-lg` = 18px, `text-sm` = 14px, `rounded-lg` = 20px (per @theme)

### Project Structure Notes

- `src/components/molecules/ProductCard.astro` — new file

### What NOT To Do

- Do NOT use a `<div>` with click handler — use `<a>` for the card
- Do NOT use arbitrary pixel values for padding — use `p-lg` from design system
- Do NOT forget `text-decoration: none` on the card link
- Do NOT import data — receives Project as prop
- Do NOT add animation — entrance animation is Story 4.4 (ProductList)
- Do NOT use `@apply` — use scoped styles for hover/active effects
- Do NOT add `motion-safe:` to hover transitions — user-initiated, not entrance animations

### References

- [Source: architecture.md#Atomic-Design-Boundaries] - Molecule: imports atoms, functional unit
- [Source: ux-design-specification.md#ProductCard] - 18px/600 title, 14px/400 tagline, 20px radius
- [Source: project-context.md#Accessibility] - External links: target, rel, aria-label
- [Source: project-context.md#Anti-Patterns] - Never use div with click handler

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Created ProductCard molecule as `<a>` element (entire card is clickable link)
- Renders title (text-lg/font-semibold), tagline (text-sm/font-normal), StatusBadge atom, tech stack tags
- Gradient surface background with 20px border-radius, 1px indigo border at 15% opacity
- Hover: border brightens to 0.4, translateY(-3px), dual-layer shadow + glow
- Active: scale(0.98) press feedback
- aria-label includes title and status label for accessibility
- target="\_blank" with rel="noopener noreferrer" for external links
- Build, lint, and format all pass cleanly

### File List

- `src/components/molecules/ProductCard.astro` (created)
