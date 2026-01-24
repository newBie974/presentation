# Story 4.2: StatusBadge Atom

Status: review

## Story

As a **visitor**,
I want to see a clear status indicator on each project,
So that I know which projects are live, in progress, or upcoming.

## Acceptance Criteria

1. **Given** the StatusBadge atom component
   **When** it renders with `status="live"`
   **Then** it shows a green dot (6px, `#22c55e`) + "Live" text in a pill container (FR6)

2. **Given** `status="building"`
   **When** it renders
   **Then** it shows an amber dot (`#f59e0b`) with `pulse` animation (2s infinite) + "Building" text (FR6, FR9)
   **And** pulse respects `motion-safe:` (disabled with reduced motion)

3. **Given** `status="coming-soon"`
   **When** it renders
   **Then** it shows a violet dot (`#8b5cf6`) at 70% opacity + "Coming Soon" text (FR6, FR9)

4. **Given** any StatusBadge variant
   **When** it renders
   **Then** `aria-label="Status: {status}"` is present

## Tasks / Subtasks

- [x] Task 1: Create `src/components/atoms/StatusBadge.astro` (AC: #1, #2, #3, #4)
  - [x] 1.1: Create component with Props interface accepting `status: Project['status']`
  - [x] 1.2: Map status to display label, dot color, and container background
  - [x] 1.3: Render pill container with 6px color dot + label text (12px, weight 500)
  - [x] 1.4: Add `motion-safe:animate-pulse-glow` to building variant dot
  - [x] 1.5: Add 70% opacity to coming-soon variant dot
  - [x] 1.6: Add `aria-label="Status: {label}"` to container
- [x] Task 2: Validate build and formatting (AC: all)
  - [x] 2.1: Run `npm run build` and verify no errors
  - [x] 2.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/atoms/StatusBadge.astro`
- **Atom rules**: No child component imports. Pure presentational. Self-contained.
- **Props pattern**: Interface named `Props`, accepts `status` using the Project type's status union
- **Naming**: PascalCase component file
- **Animation**: Uses existing `animate-pulse-glow` token from global.css (2s infinite)

### Critical Technical Details

**StatusBadge.astro structure:**

```astro
---
import type { Project } from "../../types/index";

interface Props {
  status: Project["status"];
}

const { status } = Astro.props;

const config: Record<
  Project["status"],
  { label: string; dotClass: string; bgClass: string }
> = {
  live: {
    label: "Live",
    dotClass: "bg-status-live",
    bgClass: "badge-live",
  },
  building: {
    label: "Building",
    dotClass: "bg-status-building",
    bgClass: "badge-building",
  },
  "coming-soon": {
    label: "Coming Soon",
    dotClass: "bg-status-coming",
    bgClass: "badge-coming",
  },
};

const { label, dotClass, bgClass } = config[status];
---

<span
  class:list={[
    "badge inline-flex items-center gap-xs rounded-full px-sm py-xs text-xs font-medium",
    bgClass,
  ]}
  aria-label={`Status: ${label}`}
>
  <span
    class:list={[
      "inline-block h-[6px] w-[6px] rounded-full",
      dotClass,
      status === "building" && "motion-safe:animate-pulse-glow",
      status === "coming-soon" && "opacity-70",
    ]}></span>
  {label}
</span>

<style>
  .badge-live {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }

  .badge-building {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }

  .badge-coming {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
  }
</style>
```

**Status configuration approach:**

A `config` Record maps each status value to its display properties. This makes the component data-driven — changing the status prop automatically selects the right colors and label.

**Dot sizing note:**

The spec requires a 6px dot. Using `h-[6px] w-[6px]` — this is an exception to the "no arbitrary values" rule because 6px is not in Tailwind's default spacing scale (closest are `h-1` = 4px and `h-1.5` = 6px... actually `h-1.5` IS 6px in Tailwind). Let me use `h-1.5 w-1.5` instead.

**Correction:** Tailwind's `h-1.5` = 6px and `w-1.5` = 6px. Use these instead of arbitrary values.

**Color tokens:**

The status colors are already defined in global.css @theme:

- `--color-status-live: #22c55e`
- `--color-status-building: #f59e0b`
- `--color-status-coming: #8b5cf6`

So `bg-status-live`, `bg-status-building`, `bg-status-coming` are valid Tailwind classes.

**Animation token:**

`animate-pulse-glow` is defined in global.css @theme:

```css
--animate-pulse-glow: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

This pulses opacity 1 → 0.5 → 1 on a 2s loop.

**Pill container styling:**

- `rounded-full` — pill shape
- `px-sm py-xs` — 8px horizontal, 4px vertical padding
- `text-xs` — 12px font size
- `font-medium` — weight 500
- Background color at 10% opacity (via scoped styles)
- Text color matches the status color

**Accessibility:**

- `aria-label="Status: Live"` (or Building, Coming Soon) on the container
- Ensures screen readers announce the status meaningfully
- The dot is decorative — no separate aria needed

### Previous Story Intelligence (Story 4.1)

- `Project` interface has `status: "live" | "building" | "coming-soon"` union type
- Status colors defined as Tailwind tokens: `status-live`, `status-building`, `status-coming`
- `animate-pulse-glow` token exists in global.css (2s infinite pulse)
- `src/components/atoms/` directory exists

### Project Structure Notes

- `src/components/atoms/StatusBadge.astro` — new file

### What NOT To Do

- Do NOT use arbitrary values for dot size — use `h-1.5 w-1.5` (6px)
- Do NOT forget `motion-safe:` prefix on the pulse animation
- Do NOT use JavaScript for conditional styling — use Astro's `class:list` directive
- Do NOT hardcode colors — use the Tailwind status color tokens
- Do NOT import other components — this is an atom
- Do NOT add click handlers — StatusBadge is purely informational

### References

- [Source: architecture.md#Atomic-Design-Boundaries] - Atom: no child imports, pure presentational
- [Source: ux-design-specification.md#StatusBadge] - 6px dot, 12px/500 text, pill container
- [Source: project-context.md#Animation-Rules] - motion-safe: prefix required
- [Source: global.css] - Status color tokens, animate-pulse-glow

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Created StatusBadge atom with 3 variants via config Record
- Used `h-1.5 w-1.5` for 6px dot (matches Tailwind scale, no arbitrary values)
- Building variant uses `motion-safe:animate-pulse-glow` from global.css token
- Coming-soon variant uses `opacity-70` on dot
- Scoped styles handle badge background colors at 10% opacity
- Used `Project["status"]` type for prop — ensures sync with data layer
- Build, lint, and format all pass cleanly

### File List

- `src/components/atoms/StatusBadge.astro` (created)
