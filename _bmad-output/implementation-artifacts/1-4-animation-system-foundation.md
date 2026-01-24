# Story 1.4: Animation System Foundation

Status: review

## Story

As a **visitor**,
I want animations to be smooth and respect my motion preferences,
So that the page feels alive without causing discomfort.

## Acceptance Criteria

1. **Given** the global CSS with design tokens
   **When** animation system is configured
   **Then** `global.css` defines `@keyframes` for fade-in-up, slide-up, and pulse inside `@theme`
   **And** corresponding `--animate-*` tokens generate utility classes

2. **Given** the animation tokens
   **When** reviewed
   **Then** easing token `cubic-bezier(0.16, 1, 0.3, 1)` is available as `--ease-smooth`
   **And** animation durations are embedded: 400ms (fade-in-up), 500ms (slide-up), 200ms (scale)
   **And** stagger delay custom properties are defined (200ms, 100ms, 150ms intervals)

3. **Given** a component using animations
   **When** `motion-safe:animate-fade-in-up` is applied
   **Then** the animation plays only when user has not requested reduced motion

4. **Given** a visitor with `prefers-reduced-motion: reduce`
   **When** the page loads
   **Then** all animations are disabled (0ms duration, no transforms) (FR16)
   **And** content renders immediately in final position

5. **Given** the animation system is configured
   **When** `npm run build` is run
   **Then** the build succeeds and the CSS contains the keyframe definitions

## Tasks / Subtasks

- [x] Task 1: Define custom easing token in `@theme` (AC: #2)
  - [x] 1.1: Add `--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)` to the existing `@theme` block
- [x] Task 2: Define `@keyframes` and `--animate-*` tokens inside `@theme` (AC: #1, #2)
  - [x] 2.1: Add `--animate-fade-in-up` with `fade-in-up` keyframes (opacity 0→1, translateY 20px→0, 400ms)
  - [x] 2.2: Add `--animate-slide-up` with `slide-up` keyframes (translateY 20px→0, 500ms)
  - [x] 2.3: Add `--animate-pulse-glow` with `pulse-glow` keyframes (opacity 1→0.5→1, 2s infinite)
  - [x] 2.4: All animations use `cubic-bezier(0.16, 1, 0.3, 1)` easing (except pulse which uses ease-in-out)
  - [x] 2.5: `animation-fill-mode: both` included in --animate-\* shorthand (no separate @utility needed)
- [x] Task 3: Define stagger delay custom properties (AC: #2)
  - [x] 3.1: Add `--stagger-hero` (200ms), `--stagger-social` (100ms), `--stagger-card` (150ms) to `:root`
  - [x] 3.2: These are CSS custom properties for inline `animation-delay` styles in components
- [x] Task 4: Add global `prefers-reduced-motion: reduce` override (AC: #4)
  - [x] 4.1: Add `@media (prefers-reduced-motion: reduce)` rule that disables all animations globally
  - [x] 4.2: Set `animation-duration: 0.01ms`, `animation-iteration-count: 1`, `transition-duration: 0.01ms`
- [x] Task 5: Validate build and demonstrate usage (AC: #3, #5)
  - [x] 5.1: Update `index.astro` to use `motion-safe:animate-fade-in-up` on the heading
  - [x] 5.2: Run `npm run build` and verify keyframes appear in built CSS
  - [x] 5.3: Run `npm run lint` and `npm run format:check` to verify code quality

## Dev Notes

### Architecture Requirements

- **Animations defined in `@theme`** — `@keyframes` inside `@theme` are tree-shakable and generate utility classes
- **`motion-safe:` prefix required** on all animation utility classes (per project-context.md)
- **No JavaScript animation libraries** — CSS-only per architecture constraints
- **60fps requirement** — use `transform` and `opacity` only (GPU-accelerated)
- **`prefers-reduced-motion`** — global override disables all motion (FR16, NFR9)

### Critical Technical Details

**Animation tokens in Tailwind v4 (`@theme`):**

```css
@theme {
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);

  --animate-fade-in-up: fade-in-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both;

  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  --animate-slide-up: slide-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both;

  @keyframes slide-up {
    0% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0);
    }
  }

  --animate-pulse-glow: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}
```

**Generated utilities:**

- `animate-fade-in-up` — 400ms fade+translate entrance
- `animate-slide-up` — 500ms translate-only entrance
- `animate-pulse-glow` — 2s infinite pulse (for "Building" badge)
- `ease-smooth` — custom easing for transitions

**Usage pattern in components:**

```html
<!-- Entrance animation (respects reduced motion) -->
<div class="motion-safe:animate-fade-in-up">Content</div>

<!-- With stagger delay (inline style) -->
<div
  class="motion-safe:animate-fade-in-up"
  style="animation-delay: var(--stagger-hero)"
>
  Delayed content
</div>

<!-- Transition with custom easing -->
<a
  class="motion-safe:transition motion-safe:ease-smooth motion-safe:hover:scale-105"
  >Link</a
>
```

**Stagger delay approach:**

- Defined as CSS custom properties in `:root` (not Tailwind utilities)
- Applied via inline `style` attribute on elements: `style="animation-delay: calc(var(--stagger-hero) * N)"`
- This avoids creating many utility classes for each delay value

**Reduced motion override:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**UX Spec Animation Timings:**

- Hero stagger: 200ms intervals (avatar → name → tagline)
- Social icons: 100ms intervals (starts after hero completes ~800ms)
- Product cards: 150ms intervals (scroll-triggered)
- Total entrance: < 1000ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, gentle settle

### Previous Story Intelligence (Story 1.3)

- `src/styles/global.css` has `@theme inline` (semantic colors) and `@theme` (static tokens)
- Tokens are organized: `@theme inline` first, `:root` light, `@media dark`, `@theme` static
- New animation tokens should go in the existing `@theme` static block (or a new `@theme` block below)
- ESLint + Prettier will auto-format on commit
- Build verified working in Story 1.3

### Project Structure Notes

- All animation definitions go in `src/styles/global.css`
- No separate animation CSS file needed
- Keyframes are inside `@theme` for tree-shaking
- Stagger custom properties go in `:root` (alongside existing color variables)

### What NOT To Do

- Do NOT use JavaScript animation libraries (GSAP, Framer Motion)
- Do NOT use `animation-delay` Tailwind utilities (they don't exist in v4) — use inline styles with CSS variables
- Do NOT animate properties other than `transform` and `opacity` (breaks 60fps)
- Do NOT forget `both` fill-mode on entrance animations (prevents flash)
- Do NOT put `@keyframes` outside `@theme` unless you explicitly need non-tree-shakable animations
- Do NOT use `motion-reduce:hidden` to hide content — always show content, just disable motion
- Do NOT add transitions without `motion-safe:` prefix

### References

- [Source: ux-design-specification.md#Animation-Entrance-Patterns] - Stagger timings, easing, durations
- [Source: ux-design-specification.md#Reduced-Motion-Override] - Disable all animations for a11y
- [Source: architecture.md#Animation-Approach] - Tailwind utilities + custom @keyframes hybrid
- [Source: project-context.md#Tailwind-CSS-v4-Rules] - motion-safe: on all animations
- [Source: project-context.md#Performance-Budget] - 60fps, transform/opacity only
- [Source: Tailwind CSS v4 animation](https://tailwindcss.com/docs/animation) - @theme + --animate-\* pattern
- [Source: Tailwind CSS motion variants](https://tailwindcss.com/docs/hover-focus-and-other-states) - motion-safe/reduce

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- `animation-fill-mode: both` embedded directly in `--animate-*` shorthand values rather than needing a separate `@utility` — cleaner approach
- Prettier auto-sorted Tailwind classes (motion-safe: classes moved to end of class list)

### Completion Notes List

- Custom easing `--ease-smooth` defined as `cubic-bezier(0.16, 1, 0.3, 1)` — generates `ease-smooth` utility
- 3 animations defined with @keyframes inside @theme: fade-in-up (400ms), slide-up (500ms), pulse-glow (2s infinite)
- All entrance animations use `both` fill-mode (elements stay in final position)
- Stagger delays defined as CSS custom properties: --stagger-hero (200ms), --stagger-social (100ms), --stagger-card (150ms)
- Global `prefers-reduced-motion: reduce` override disables all animation/transition durations
- Verified: all keyframes, easing token, stagger delays, and reduced-motion override present in built CSS
- Build, lint, and format checks all pass

### File List

- `src/styles/global.css` (modified: added --ease-smooth, 3 animations with @keyframes, stagger delays, reduced-motion override)
- `src/pages/index.astro` (modified: added motion-safe:animate-fade-in-up demo with stagger delay)
