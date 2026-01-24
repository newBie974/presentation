# Story 4.4: ProductList Organism with Scroll-Triggered Entrance

Status: done

## Story

As a **visitor**,
I want product cards to slide in as I scroll down,
So that discovering projects feels rewarding and intentional.

## Acceptance Criteria

1. **Given** the ProductList organism
   **When** it receives projects data as props
   **Then** it renders ProductCard molecules in a vertical stack with 24px gap

2. **Given** the ProductList organism
   **When** rendered
   **Then** section has `<section aria-label="Projects">` wrapper

3. **Given** the ProductList organism
   **When** rendered
   **Then** spacing is 80px (`2xl`) below SocialBar

4. **Given** the product cards are below the viewport
   **When** the visitor scrolls down (intersection threshold: 0.2)
   **Then** cards animate in with fade-in-up (translateY 20px → 0) + fade at 150ms stagger (FR14)
   **And** once revealed, cards stay visible (no re-hiding on scroll up)

5. **Given** a visitor with `prefers-reduced-motion: reduce`
   **When** cards enter the viewport
   **Then** they render immediately without animation

## Tasks / Subtasks

- [x] Task 1: Create `src/components/organisms/ProductList.astro` (AC: #1, #2, #3, #4, #5)
  - [x] 1.1: Create component with Props interface accepting `Project[]` array
  - [x] 1.2: Render `<section aria-label="Projects">` wrapper with `mt-2xl`
  - [x] 1.3: Render ProductCard molecules in vertical stack with `gap-lg` (24px)
  - [x] 1.4: Cards start hidden (opacity: 0, translateY: 20px)
  - [x] 1.5: Add inline `<script>` with Intersection Observer logic
  - [x] 1.6: Observer reveals cards with staggered 150ms delays on intersection
  - [x] 1.7: Once revealed, `unobserve` the card (stays visible permanently)
  - [x] 1.8: Check `prefers-reduced-motion` — if reduce, show all cards immediately
- [x] Task 2: Update index.astro to use ProductList organism (AC: #1, #3)
  - [x] 2.1: Import ProductList organism and projects data
  - [x] 2.2: Render ProductList below SocialBar, passing projects as prop
- [x] Task 3: Validate build, scroll behavior, and formatting (AC: all)
  - [x] 3.1: Run `npm run build` and verify output HTML structure
  - [x] 3.2: Verify inline script in built output
  - [x] 3.3: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/organisms/ProductList.astro`
- **Organism rules**: Complete page section, composes molecules. Receives data as props from page.
- **Props pattern**: Interface named `Props`, receives `projects: Project[]`
- **Client JS justification**: Intersection Observer is the ONLY valid reason to ship JS in this project. It's a `<script>` tag (not a framework island), so it's minimal and doesn't require `client:*` directives.
- **Data flow**: Page imports projects data → passes to ProductList → ProductList maps over array → renders ProductCard molecules

### Critical Technical Details

**ProductList.astro structure:**

```astro
---
import type { Project } from "../../types/index";
import ProductCard from "../molecules/ProductCard.astro";

interface Props {
  projects: Project[];
}

const { projects } = Astro.props;
---

<section aria-label="Projects" class="mt-2xl">
  <div class="flex flex-col gap-lg">
    {
      projects.map((project, index) => (
        <div class="product-card-wrapper" data-index={index}>
          <ProductCard project={project} />
        </div>
      ))
    }
  </div>
</section>

<style>
  .product-card-wrapper {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 400ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .product-card-wrapper.revealed {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<script>
  const stagger = 150;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const cards = document.querySelectorAll(".product-card-wrapper");

  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add("revealed"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const index = Number(card.dataset.index);
            setTimeout(() => {
              card.classList.add("revealed");
            }, index * stagger);
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer.observe(card));
  }
</script>
```

**Scroll-triggered animation approach:**

Unlike the hero/social animations (CSS-only with `animation-delay`), scroll-triggered animations REQUIRE JavaScript because CSS cannot detect scroll position. This is the one justified exception to the "zero client JS" rule.

**Implementation details:**

1. Cards start with `opacity: 0` and `translateY(20px)` via scoped CSS
2. Inline `<script>` creates an IntersectionObserver with threshold 0.2 (20% visible)
3. When a card enters the viewport, it gets `.revealed` class after a staggered delay
4. `.revealed` class transitions to `opacity: 1` and `translateY(0)` with 400ms cubic-bezier
5. `observer.unobserve(card)` ensures cards stay visible once revealed
6. Stagger: 150ms × index (card 0: 0ms, card 1: 150ms, card 2: 300ms)

**Why inline `<script>` and not `client:*`:**

- Astro's `<script>` tags are automatically bundled and optimized
- They run once when the DOM is ready (deferred by default in Astro)
- No framework overhead — just vanilla JS
- No `client:load` directive needed — this isn't a component island

**Reduced motion handling:**

- Checks `window.matchMedia("(prefers-reduced-motion: reduce)")` in the script
- If true, immediately adds `.revealed` to all cards — they appear without animation
- The CSS transition still applies but at 0.01ms duration (from the global override in global.css)
- Double protection: script check + global CSS override

**Spacing:**

- `mt-2xl` = 80px margin-top — creates space below SocialBar
- `gap-lg` = 24px between cards

**Updated index.astro:**

```astro
---
import MainLayout from "../layouts/MainLayout.astro";
import HeroSection from "../components/organisms/HeroSection.astro";
import SocialBar from "../components/organisms/SocialBar.astro";
import ProductList from "../components/organisms/ProductList.astro";
import avatarImage from "../assets/avatar.png";
import { profile } from "../data/profile";
import { socialLinks } from "../data/socialLinks";
import { projects } from "../data/projects";
---

<MainLayout title="Aymeric - Builder & Creator">
  <HeroSection
    src={avatarImage}
    alt="Aymeric's profile photo"
    name={profile.name}
    tagline={profile.tagline}
  />
  <SocialBar links={socialLinks} />
  <ProductList projects={projects} />
</MainLayout>
```

### Previous Story Intelligence (Story 4.2/4.3)

- `ProductCard.astro` created with `project: Project` prop
- `StatusBadge.astro` created with status variants
- `src/components/organisms/` directory exists (has HeroSection.astro, SocialBar.astro)
- `--stagger-card: 150ms` defined in global.css `:root` (can reference or use literal 150)
- Tailwind tokens: `mt-2xl` = 80px, `gap-lg` = 24px

### Project Structure Notes

- `src/components/organisms/ProductList.astro` — new file
- `src/pages/index.astro` — updated to include ProductList

### What NOT To Do

- Do NOT use `client:load` or any Astro island directive — use inline `<script>` tag
- Do NOT use CSS-only animation for scroll trigger — impossible without JS
- Do NOT re-hide cards on scroll up — once revealed, stay visible (`unobserve`)
- Do NOT use `@keyframes` for this — use CSS transitions triggered by class addition
- Do NOT forget reduced motion check in the script
- Do NOT use `animate-fade-in-up` token — this uses transition-based reveal, not animation
- Do NOT import data — receives projects as props from page
- Do NOT use `IntersectionObserver` polyfill — supported in all modern browsers
- Do NOT use `requestAnimationFrame` — setTimeout with stagger is simpler and sufficient

### References

- [Source: architecture.md#Atomic-Design-Boundaries] - Organism: complete page section
- [Source: architecture.md#Animation-Approach] - JS only for scroll-triggered animations
- [Source: ux-design-specification.md#ProductList] - Vertical stack, 24px gap, scroll entrance
- [Source: ux-design-specification.md#Motion-Design] - 150ms stagger, 0.2 threshold
- [Source: project-context.md#Performance] - Zero JS unless explicitly required
- [Source: project-context.md#Accessibility] - prefers-reduced-motion handling

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Created ProductList organism with section aria-label="Projects" wrapper
- mt-2xl (80px) spacing below SocialBar, gap-lg (24px) between cards
- Cards start hidden (opacity: 0, translateY: 20px) via scoped CSS
- Inline script with IntersectionObserver (threshold: 0.2) for scroll-triggered reveal
- Staggered 150ms delays per card index on intersection
- Cards stay visible permanently via observer.unobserve()
- prefers-reduced-motion check: immediately reveals all cards without animation
- Updated index.astro to import and render ProductList with projects data
- Build, lint, and format all pass cleanly

### File List

- `src/components/organisms/ProductList.astro` (created)
- `src/pages/index.astro` (updated)
