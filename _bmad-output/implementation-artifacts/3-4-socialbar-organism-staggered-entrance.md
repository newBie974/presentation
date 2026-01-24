# Story 3.4: SocialBar Organism with Staggered Entrance

Status: review

## Story

As a **visitor** (Sophie),
I want social icons to appear smoothly after the hero,
So that they feel like a natural discovery, not a dump of links.

## Acceptance Criteria

1. **Given** the SocialBar organism
   **When** it receives socialLinks data as props
   **Then** it renders SocialLink molecules in a horizontal flex layout with 14px gap

2. **Given** the SocialBar organism
   **When** rendered
   **Then** section has `<nav aria-label="Social media links">` wrapper (FR24)

3. **Given** the SocialBar organism
   **When** the page loads
   **Then** entrance animation staggers icons at 100ms intervals, starting after hero (FR10)

4. **Given** the SocialBar organism
   **When** rendered
   **Then** spacing is 48px (`xl`) below HeroSection

5. **Given** a visitor using keyboard
   **When** they tab through social icons
   **Then** focus moves left-to-right through all icons (FR25)
   **And** each icon shows the focus-visible ring (3px solid, accent, 2px offset)
   **And** Enter/Space activates the link (FR25)

## Tasks / Subtasks

- [x] Task 1: Create `src/components/organisms/SocialBar.astro` (AC: #1, #2, #3, #4, #5)
  - [x] 1.1: Create component with Props interface accepting `SocialLink[]` array
  - [x] 1.2: Render `<nav aria-label="Social media links">` wrapper
  - [x] 1.3: Render SocialLink molecules in horizontal flex with gap-md (16px)
  - [x] 1.4: Apply `motion-safe:animate-fade-in-up` with staggered delays (100ms intervals)
  - [x] 1.5: Add `mt-xl` for 48px spacing above (below HeroSection)
- [x] Task 2: Update index.astro to use SocialBar organism (AC: #1, #4)
  - [x] 2.1: Import SocialBar organism and socialLinks data
  - [x] 2.2: Render SocialBar below HeroSection, passing socialLinks as prop
- [x] Task 3: Validate build, accessibility, animations, and formatting (AC: all)
  - [x] 3.1: Run `npm run build` and verify output HTML structure
  - [x] 3.2: Verify nav landmark and aria-label in built output
  - [x] 3.3: Verify stagger delays in built output
  - [x] 3.4: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/organisms/SocialBar.astro`
- **Organism rules**: Complete page section, composes molecules. Receives data as props from page.
- **Props pattern**: Interface named `Props`, receives `links: SocialLink[]`
- **Naming**: PascalCase component file
- **Data flow**: Page imports socialLinks data → passes to SocialBar → SocialBar maps over array → renders SocialLink molecules
- **Semantic HTML**: `<nav>` landmark with descriptive `aria-label`

### Critical Technical Details

**SocialBar.astro structure:**

```astro
---
import type { SocialLink } from "../../types/index";
import SocialLinkComponent from "../molecules/SocialLink.astro";

interface Props {
  links: SocialLink[];
}

const { links } = Astro.props;
---

<nav aria-label="Social media links" class="mt-xl">
  <div class="flex items-center justify-center gap-md">
    {
      links.map((link, index) => (
        <div
          class="motion-safe:animate-fade-in-up"
          style={`animation-delay: calc(${index} * var(--stagger-social))`}
        >
          <SocialLinkComponent link={link} />
        </div>
      ))
    }
  </div>
</nav>
```

**Stagger animation approach:**

- Each SocialLink is wrapped in a div with `motion-safe:animate-fade-in-up`
- `animation-delay` is calculated dynamically: `index * --stagger-social` (100ms per icon)
- Icon 0: 0ms, Icon 1: 100ms, Icon 2: 200ms, Icon 3: 300ms
- Total entrance: 300ms delay + 400ms animation = 700ms for last icon
- Uses existing `animate-fade-in-up` token from global.css (400ms, cubic-bezier easing, both fill)

**Spacing:**

- `mt-xl` = 48px margin-top (Tailwind token from @theme) — creates space below HeroSection
- `gap-md` = 16px... but spec says 14px gap.

**Gap sizing note:** The UX spec requires 14px gap between icons. Our Tailwind spacing scale doesn't include 14px (we have `gap-sm` = 8px and `gap-md` = 16px). Options:

1. Use `gap-md` (16px) — close enough, follows design system
2. Use inline style `gap: 14px` — exact match but breaks "no arbitrary values" rule

**Resolution:** Use `gap-md` (16px). The 2px difference is imperceptible, and the project-context.md explicitly states "NEVER use arbitrary Tailwind values". The design system scale takes priority over pixel-perfect spec values.

**Keyboard navigation:**

- `<a>` elements inside SocialLink molecules are naturally focusable in DOM order
- Horizontal flex layout means tab order matches visual left-to-right order
- Focus ring handled by global `:focus-visible` rule in global.css (3px solid, accent, 2px offset)
- Enter activates links natively (no JS needed)
- No additional keyboard handling required — semantic HTML provides everything

**Updated index.astro:**

```astro
---
import MainLayout from "../layouts/MainLayout.astro";
import HeroSection from "../components/organisms/HeroSection.astro";
import SocialBar from "../components/organisms/SocialBar.astro";
import avatarImage from "../assets/avatar.png";
import { profile } from "../data/profile";
import { socialLinks } from "../data/socialLinks";
---

<MainLayout title="Aymeric - Builder & Creator">
  <HeroSection
    src={avatarImage}
    alt="Aymeric's profile photo"
    name={profile.name}
    tagline={profile.tagline}
  />
  <SocialBar links={socialLinks} />
</MainLayout>
```

**Reduced motion:** Already handled globally — animations complete instantly. `motion-safe:` prefix prevents animation from applying when user prefers reduced motion.

**Component naming conflict:** The molecule is named `SocialLink.astro` and the type is `SocialLink`. To avoid ambiguity in the organism, import the molecule with an alias: `import SocialLinkComponent from "../molecules/SocialLink.astro"`.

### Previous Story Intelligence (Story 3.3)

- `src/components/molecules/SocialLink.astro` created with hover/active effects
- SocialLink molecule accepts `link: SocialLink` prop
- Uses `Record<string, typeof IconLinkedin>` for icon map (ESLint no-explicit-any fix)
- `src/components/organisms/` directory exists (has HeroSection.astro)
- `--stagger-social: 100ms` defined in global.css `:root`
- `animate-fade-in-up` token works with `animation-delay` inline styles

### Project Structure Notes

- `src/components/organisms/SocialBar.astro` — new file
- `src/pages/index.astro` — updated to include SocialBar

### What NOT To Do

- Do NOT import data inside SocialBar — receives links as props from page
- Do NOT use JavaScript for stagger — CSS `animation-delay` with index calculation
- Do NOT use arbitrary gap value like `gap-[14px]` — use `gap-md` (16px) from design system
- Do NOT forget the `<nav>` landmark with `aria-label`
- Do NOT add `role="list"` — flex containers with links don't need list semantics
- Do NOT forget `motion-safe:` prefix on animation classes
- Do NOT name the molecule import `SocialLink` — conflicts with the type name, use `SocialLinkComponent`

### References

- [Source: architecture.md#Atomic-Design-Boundaries] - Organism: complete page section
- [Source: ux-design-specification.md#SocialBar] - Horizontal flex, 14px gap, staggered entrance
- [Source: ux-design-specification.md#Motion-Design] - 100ms stagger interval
- [Source: project-context.md#Accessibility] - nav landmark, focus-visible, keyboard navigation
- [Source: project-context.md#Anti-Patterns] - Never use arbitrary Tailwind values
- [Source: global.css] - --stagger-social: 100ms, animate-fade-in-up token

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Created SocialBar organism with nav landmark and staggered entrance animation
- Used `gap-md` (16px) instead of arbitrary 14px — follows design system scale
- Stagger: `calc(index * var(--stagger-social))` gives 0ms, 100ms, 200ms, 300ms delays
- Molecule import aliased to `SocialLinkComponent` to avoid type name conflict
- index.astro updated to render SocialBar below HeroSection
- Build, lint, and format all pass cleanly

### File List

- `src/components/organisms/SocialBar.astro` (created)
- `src/pages/index.astro` (updated — added SocialBar import and usage)
