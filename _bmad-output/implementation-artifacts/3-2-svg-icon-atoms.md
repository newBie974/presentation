# Story 3.2: SVG Icon Atoms

Status: review

## Story

As a **visitor**,
I want to see recognizable platform icons,
So that I instantly know which social platforms are available.

## Acceptance Criteria

1. **Given** the icon atom components
   **When** they render
   **Then** `IconLinkedin.astro`, `IconX.astro`, `IconInstagram.astro`, `IconTiktok.astro` exist as inline SVG atoms (FR12)

2. **Given** each icon atom
   **When** it renders
   **Then** the SVG is 20px default size, uses `currentColor` for fill

3. **Given** each icon atom
   **When** it renders
   **Then** it has `aria-hidden="true"` (label provided by parent)

## Tasks / Subtasks

- [x] Task 1: Create `src/components/atoms/IconLinkedin.astro` (AC: #1, #2, #3)
  - [x] 1.1: Create inline SVG component with LinkedIn path data
  - [x] 1.2: Set width/height to 20px, fill to `currentColor`, aria-hidden to true
- [x] Task 2: Create `src/components/atoms/IconX.astro` (AC: #1, #2, #3)
  - [x] 2.1: Create inline SVG component with X (Twitter) path data
  - [x] 2.2: Set width/height to 20px, fill to `currentColor`, aria-hidden to true
- [x] Task 3: Create `src/components/atoms/IconInstagram.astro` (AC: #1, #2, #3)
  - [x] 3.1: Create inline SVG component with Instagram path data
  - [x] 3.2: Set width/height to 20px, fill to `currentColor`, aria-hidden to true
- [x] Task 4: Create `src/components/atoms/IconTiktok.astro` (AC: #1, #2, #3)
  - [x] 4.1: Create inline SVG component with TikTok path data
  - [x] 4.2: Set width/height to 20px, fill to `currentColor`, aria-hidden to true
- [x] Task 5: Validate build and formatting (AC: all)
  - [x] 5.1: Run `npm run build` and verify icons compile without errors
  - [x] 5.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Component location**: `src/components/atoms/` (existing directory)
- **Atom rules**: No child component imports. Pure presentational. Self-contained.
- **Naming**: PascalCase — `IconLinkedin.astro`, `IconX.astro`, `IconInstagram.astro`, `IconTiktok.astro`
- **Icon strategy**: Inline SVG components (zero dependencies, fully stylable, ships only used icons)
- **No Props needed**: These atoms have no configurable props — size is fixed at 20px, fill is `currentColor`

### Critical Technical Details

**Icon source:** Bootstrap Icons (MIT license), viewBox `0 0 16 16`, adapted to 20px size.

**IconLinkedin.astro:**

```astro
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor"
  viewBox="0 0 16 16"
  aria-hidden="true"
>
  <path
    d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"
  ></path>
</svg>
```

**IconX.astro:**

```astro
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor"
  viewBox="0 0 16 16"
  aria-hidden="true"
>
  <path
    d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
  ></path>
</svg>
```

**IconInstagram.astro:**

```astro
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor"
  viewBox="0 0 16 16"
  aria-hidden="true"
>
  <path
    d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"
  ></path>
</svg>
```

**IconTiktok.astro:**

```astro
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor"
  viewBox="0 0 16 16"
  aria-hidden="true"
>
  <path
    d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
  ></path>
</svg>
```

**Key implementation notes:**

- All icons use `viewBox="0 0 16 16"` (Bootstrap Icons standard) but render at `width="20" height="20"` per UX spec
- `fill="currentColor"` makes the icon inherit text color from parent — enables theming
- `aria-hidden="true"` hides from screen readers — the parent SocialLink molecule provides the accessible label
- No frontmatter needed — these are pure SVG template components with no logic
- No Props interface — fixed size, fixed behavior

**Platform → Component name mapping:**

| Platform (data) | Component           | Icon Source                    |
| --------------- | ------------------- | ------------------------------ |
| linkedin        | IconLinkedin.astro  | Bootstrap Icons `bi-linkedin`  |
| x               | IconX.astro         | Bootstrap Icons `bi-twitter-x` |
| instagram       | IconInstagram.astro | Bootstrap Icons `bi-instagram` |
| tiktok          | IconTiktok.astro    | Bootstrap Icons `bi-tiktok`    |

### Previous Story Intelligence (Story 3.1)

- `src/data/socialLinks.ts` has platform field values: `"linkedin"`, `"x"`, `"instagram"`, `"tiktok"`
- `src/components/atoms/` directory already exists (has Avatar.astro)
- Prettier will format SVG attributes onto separate lines
- No ESLint issues with SVG-only Astro components

### Project Structure Notes

- `src/components/atoms/IconLinkedin.astro` — new
- `src/components/atoms/IconX.astro` — new
- `src/components/atoms/IconInstagram.astro` — new
- `src/components/atoms/IconTiktok.astro` — new

### What NOT To Do

- Do NOT use external icon libraries (Font Awesome, Heroicons, etc.) — inline SVG atoms only
- Do NOT add Props for size customization — fixed at 20px per spec
- Do NOT add `role="img"` to the SVGs — they are decorative (aria-hidden)
- Do NOT use `<img>` tags for icons — inline SVG is required for `currentColor` support
- Do NOT import these icons in the data layer — component layer handles icon selection
- Do NOT add frontmatter blocks — these components are pure templates

### References

- [Source: architecture.md#Icon-Strategy] - Inline SVG components, zero dependencies
- [Source: ux-design-specification.md#SocialIcon] - 20px icon size inside 48px container
- [Source: project-context.md#Anti-Patterns] - Never use icon fonts or external icon libraries
- [Source: Bootstrap Icons] - MIT license SVG paths (viewBox 0 0 16 16)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Created 4 inline SVG icon atoms from Bootstrap Icons (MIT license)
- All icons: 20px size, currentColor fill, aria-hidden="true", viewBox 0 0 16 16
- Pure template components — no frontmatter, no props, no logic
- Build, lint, and format all pass cleanly

### File List

- `src/components/atoms/IconLinkedin.astro` (created)
- `src/components/atoms/IconX.astro` (created)
- `src/components/atoms/IconInstagram.astro` (created)
- `src/components/atoms/IconTiktok.astro` (created)
