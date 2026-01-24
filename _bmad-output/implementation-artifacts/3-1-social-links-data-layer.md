# Story 3.1: Social Links Data Layer

Status: review

## Story

As a **developer** (Aymeric),
I want social links stored in a typed data file,
So that I can add or remove platforms without touching components.

## Acceptance Criteria

1. **Given** the `src/types/index.ts` file
   **When** the SocialLink interface is defined
   **Then** it includes `platform: string`, `url: string`, `label: string`

2. **Given** the `src/data/socialLinks.ts` file
   **When** it is created
   **Then** it exports a `SocialLink[]` array with LinkedIn, X, Instagram, TikTok entries

3. **Given** the SocialLink data entries
   **When** TypeScript compiles
   **Then** compilation fails if any required field is missing (FR19)

## Tasks / Subtasks

- [x] Task 1: Add SocialLink interface to `src/types/index.ts` (AC: #1)
  - [x] 1.1: Define `SocialLink` interface with `platform: string`, `url: string`, `label: string`
  - [x] 1.2: Export alongside existing `Profile` interface
- [x] Task 2: Create `src/data/socialLinks.ts` (AC: #2, #3)
  - [x] 2.1: Import `SocialLink` type from `../types/index`
  - [x] 2.2: Export typed `socialLinks: SocialLink[]` array
  - [x] 2.3: Add entries for LinkedIn, X, Instagram, TikTok with proper URLs and labels
- [x] Task 3: Validate TypeScript strict checking (AC: #3)
  - [x] 3.1: Verify removing a required field causes TypeScript error
  - [x] 3.2: Run `npm run build` to confirm successful compilation
  - [x] 3.3: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Type location**: `src/types/index.ts` — single barrel export for all interfaces
- **Data location**: `src/data/socialLinks.ts` — typed data file
- **Naming**: `camelCase.ts` for data files, `PascalCase` for type names
- **Pattern**: Same as Profile — interface in types, data in data/
- **Data flow**: Only `pages/index.astro` will import this data (in future stories)

### Critical Technical Details

**Updated src/types/index.ts:**

```typescript
export interface Profile {
  name: string;
  tagline: string;
  avatarPath: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}
```

**src/data/socialLinks.ts:**

```typescript
import type { SocialLink } from "../types/index";

export const socialLinks: SocialLink[] = [
  {
    platform: "linkedin",
    url: "https://linkedin.com/in/aymeric",
    label: "Follow on LinkedIn",
  },
  {
    platform: "x",
    url: "https://x.com/aymeric",
    label: "Follow on X",
  },
  {
    platform: "instagram",
    url: "https://instagram.com/aymeric",
    label: "Follow on Instagram",
  },
  {
    platform: "tiktok",
    url: "https://tiktok.com/@aymeric",
    label: "Follow on TikTok",
  },
];
```

**Platform naming convention:**

- `platform` field uses lowercase identifiers matching future icon component names (`IconLinkedin`, `IconX`, `IconInstagram`, `IconTiktok`)
- `label` field provides the accessible text for `aria-label` (used by SocialLink molecule in Story 3.3)
- `url` fields are placeholder URLs — user will update with real profile links

**TypeScript validation:**

- The `SocialLink[]` type annotation ensures all array entries must satisfy the interface
- Removing any field (platform, url, or label) will cause TS2741 error at compile time
- `import type` ensures zero runtime import cost

### Previous Story Intelligence (Story 2.4)

- `src/types/index.ts` already exports `Profile` interface
- `src/data/profile.ts` follows the exact same pattern (import type, export const with type annotation)
- Prettier formats object arrays with trailing commas
- ESLint has no issues with the current data layer setup

### Project Structure Notes

- `src/types/index.ts` — updated (add SocialLink interface)
- `src/data/socialLinks.ts` — new file (typed social links array)

### What NOT To Do

- Do NOT create a separate types file for SocialLink — use the barrel `src/types/index.ts`
- Do NOT add icon paths or component references to the data — that's the component layer's job
- Do NOT import data inside any component — only pages import data
- Do NOT add optional fields — all three fields (platform, url, label) are required
- Do NOT use an enum for platform — a plain string is simpler and matches the icon component naming
- Do NOT add real social media URLs yet — use placeholder URLs (user will update later)

### References

- [Source: architecture.md#Data-Layer] - Data files in src/data/, types in src/types/
- [Source: architecture.md#Props-Interface-Patterns] - Type barrel export pattern
- [Source: ux-design-specification.md#SocialBar] - LinkedIn, X, Instagram, TikTok platforms
- [Source: project-context.md#Code-Quality] - camelCase data files, single barrel types

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Added SocialLink interface to src/types/index.ts barrel export
- Created src/data/socialLinks.ts with 4 typed entries (LinkedIn, X, Instagram, TikTok)
- Verified TS2741 error when required field is omitted
- Build, lint, and format all pass cleanly
- Placeholder URLs used — user will update with real profile links

### File List

- `src/types/index.ts` (updated — added SocialLink interface)
- `src/data/socialLinks.ts` (created)
