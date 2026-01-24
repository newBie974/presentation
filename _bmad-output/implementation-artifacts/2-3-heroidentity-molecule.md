# Story 2.3: HeroIdentity Molecule

Status: review

## Story

As a **visitor**,
I want to see a bold name and clear tagline,
So that I understand who this person is within 1 second.

## Acceptance Criteria

1. **Given** the HeroIdentity molecule
   **When** it renders with profile data
   **Then** the name displays at 32px, weight 800, with gradient text (`#fff` → `#c4b5fd`) (FR1)
   **And** letter-spacing is -0.02em on the name

2. **Given** the HeroIdentity molecule
   **When** rendering
   **Then** the name is an `<h1>` element

3. **Given** the HeroIdentity molecule
   **When** it renders with profile data
   **Then** the tagline displays at 15px, weight 400, `--text-secondary` color (FR2)

4. **Given** the HeroIdentity molecule
   **When** rendering
   **Then** the tagline is a `<p>` element

## Tasks / Subtasks

- [x] Task 1: Create `src/components/molecules/HeroIdentity.astro` (AC: #1, #2, #3, #4)
  - [x] 1.1: Create `src/components/molecules/` directory
  - [x] 1.2: Create component with Props interface: `name: string`, `tagline: string`
  - [x] 1.3: Render name as `<h1>` with gradient text, 32px size, weight 800, letter-spacing -0.02em
  - [x] 1.4: Render tagline as `<p>` with text-secondary color, 15px size, weight 400
  - [x] 1.5: Add gradient text styles via scoped `<style>` block
- [x] Task 2: Update index.astro to demo HeroIdentity (AC: all)
  - [x] 2.1: Import HeroIdentity component
  - [x] 2.2: Replace existing h1/p demo content with HeroIdentity molecule
  - [x] 2.3: Pass name and tagline from profile data (import from data layer)
- [x] Task 3: Validate build, accessibility, and formatting (AC: all)
  - [x] 3.1: Run `npm run build` and verify output HTML has h1 and p elements
  - [x] 3.2: Verify gradient text renders in built CSS
  - [x] 3.3: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/molecules/HeroIdentity.astro`
- **Molecule rules**: Can import atoms (but this molecule has no atom imports — it's text-only). Functional unit combining name + tagline.
- **Props pattern**: Interface named `Props`, destructured in frontmatter
- **Naming**: PascalCase component file
- **Data flow**: Receives `name` and `tagline` as string props (not the full Profile object)
- **Semantic HTML**: `<h1>` for name (page has exactly one h1), `<p>` for tagline

### Critical Technical Details

**HeroIdentity.astro structure:**

```astro
---
interface Props {
  name: string;
  tagline: string;
}

const { name, tagline } = Astro.props;
---

<div class="text-center">
  <h1
    class="hero-name text-[32px] font-extrabold"
    style="letter-spacing: -0.02em"
  >
    {name}
  </h1>
  <p class="mt-xs text-[15px] font-normal text-text-secondary">
    {tagline}
  </p>
</div>

<style>
  .hero-name {
    background: linear-gradient(to right, #ffffff, #c4b5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
```

**Gradient text technique:**

- Uses `background: linear-gradient(...)` + `background-clip: text` + `-webkit-text-fill-color: transparent`
- This is the only cross-browser way to achieve gradient text
- Scoped `<style>` block keeps it contained to this component
- Colors: `#ffffff` (white) → `#c4b5fd` (light violet) per UX spec

**Font sizing note:**

- The UX spec requires exactly 32px for name and 15px for tagline
- These don't map to Tailwind's default type scale (text-2xl = 24px, text-3xl = 30px)
- Using `text-[32px]` and `text-[15px]` is acceptable here since these are design-spec pixel values
- Alternative: define custom font-size tokens in @theme — but for 2 one-off values, arbitrary is simpler
- `font-extrabold` = font-weight 800 (matches spec exactly)

**Updated index.astro:**

```astro
---
import MainLayout from "../layouts/MainLayout.astro";
import Avatar from "../components/atoms/Avatar.astro";
import HeroIdentity from "../components/molecules/HeroIdentity.astro";
import avatarImage from "../assets/avatar.png";
import { profile } from "../data/profile";
---

<MainLayout title="Aymeric - Builder & Creator">
  <Avatar src={avatarImage} alt="Aymeric's profile photo" />
  <HeroIdentity name={profile.name} tagline={profile.tagline} />
</MainLayout>
```

**Key change:** index.astro now imports from `src/data/profile.ts` — this is correct per architecture (only pages import data).

### Previous Story Intelligence (Story 2.2)

- `src/components/atoms/Avatar.astro` created with scoped styles and Props interface
- index.astro imports Avatar + avatar image from src/assets/
- Prettier reformats long class strings onto multiple lines
- `src/components/atoms/` directory exists
- `src/data/profile.ts` exports `{ name: "Aymeric", tagline: "Builder & Creator", avatarPath: "..." }`

### Project Structure Notes

- `src/components/molecules/` — new directory for this story
- `src/components/molecules/HeroIdentity.astro` — the molecule
- `src/pages/index.astro` — updated to use HeroIdentity + profile data
- Removes hardcoded h1/p from index.astro in favor of the molecule

### What NOT To Do

- Do NOT import data inside HeroIdentity — it receives props only
- Do NOT use `@apply` — use scoped `<style>` for gradient text
- Do NOT add animations to this molecule — entrance animations are Story 2.4 (HeroSection)
- Do NOT import any atoms — this molecule is text-only (no Avatar here)
- Do NOT add more than one `<h1>` per page — this component owns the single h1
- Do NOT use Tailwind's `bg-gradient-*` utilities for text — they don't support text gradient clipping
- Do NOT use `bg-clip-text` Tailwind utility without also setting `-webkit-text-fill-color: transparent` (won't work in Safari)

### References

- [Source: architecture.md#Atomic-Design-Boundaries] - Molecule: combines 2+ atoms into functional unit
- [Source: architecture.md#Props-Interface-Patterns] - Props interface, destructuring
- [Source: ux-design-specification.md#HeroIdentity] - 32px/800 gradient name, 15px/400 tagline
- [Source: ux-design-specification.md#Hero-Section] - Name gradient #fff → #c4b5fd, letter-spacing -0.02em
- [Source: project-context.md#Accessibility] - Exactly one h1, logical heading order

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Created HeroIdentity molecule matching spec exactly (32px/800 gradient name, 15px/400 tagline)
- Gradient text uses scoped `<style>` with `background-clip: text` + `-webkit-text-fill-color: transparent`
- index.astro updated to import profile data and pass props to HeroIdentity
- `src/components/molecules/` directory was already created (existed from previous context)
- Build output verified: correct h1/p elements with proper classes and inline styles
- Lint and format checks pass cleanly

### File List

- `src/components/molecules/HeroIdentity.astro` (created)
- `src/pages/index.astro` (updated — imports HeroIdentity + profile data)
