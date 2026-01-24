# Story 4.1: Projects Data Layer

Status: review

## Story

As a **developer** (Aymeric),
I want projects stored in a typed data file,
So that I can add products and update their status without code changes.

## Acceptance Criteria

1. **Given** the `src/types/index.ts` file
   **When** the Project interface is defined
   **Then** it includes `title: string`, `tagline: string`, `url: string`, `status: 'live' | 'building' | 'coming-soon'`, `techStack: string[]`

2. **Given** the `src/data/projects.ts` file
   **When** it is created
   **Then** it exports a `Project[]` array with at least one entry

3. **Given** the Project data entries
   **When** TypeScript compiles
   **Then** compilation fails if required fields are missing (FR17)

4. **Given** a Project entry
   **When** the `status` value is changed
   **Then** the badge updates without component changes (FR18)

## Tasks / Subtasks

- [x] Task 1: Add Project interface to `src/types/index.ts` (AC: #1)
  - [x] 1.1: Define `Project` interface with all required fields
  - [x] 1.2: Use union type `'live' | 'building' | 'coming-soon'` for status field
  - [x] 1.3: Export alongside existing interfaces
- [x] Task 2: Create `src/data/projects.ts` (AC: #2, #3, #4)
  - [x] 2.1: Import `Project` type from `../types/index`
  - [x] 2.2: Export typed `projects: Project[]` array
  - [x] 2.3: Add sample project entries covering all three status values
- [x] Task 3: Validate TypeScript strict checking (AC: #3)
  - [x] 3.1: Verify removing a required field causes TypeScript error
  - [x] 3.2: Verify invalid status value causes TypeScript error (TS2322)
  - [x] 3.3: Run `npm run build` to confirm successful compilation
  - [x] 3.4: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Type location**: `src/types/index.ts` — single barrel export
- **Data location**: `src/data/projects.ts` — typed data file
- **Naming**: `camelCase.ts` for data files, `PascalCase` for type names
- **Pattern**: Same as Profile and SocialLink — interface in types, data in data/
- **Status union type**: Enforces only valid status values at compile time
- **Data flow**: Only `pages/index.astro` will import this data (in Story 4.4)

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

export interface Project {
  title: string;
  tagline: string;
  url: string;
  status: "live" | "building" | "coming-soon";
  techStack: string[];
}
```

**src/data/projects.ts:**

```typescript
import type { Project } from "../types/index";

export const projects: Project[] = [
  {
    title: "CalorieTracker AI",
    tagline: "AI-powered nutrition tracking and meal planning",
    url: "https://calorietracker.ai",
    status: "building",
    techStack: ["React", "TypeScript", "OpenAI"],
  },
  {
    title: "Tookta",
    tagline: "Smart travel planning for Southeast Asia",
    url: "https://tookta.app",
    status: "building",
    techStack: ["Astro", "TypeScript", "Tailwind"],
  },
  {
    title: "Cooking App",
    tagline: "Recipe discovery and weekly meal prep",
    url: "https://cooking.app",
    status: "coming-soon",
    techStack: ["React Native", "Firebase"],
  },
];
```

**Project entries note:**

- These are placeholder entries based on repos visible in the user's workspace
- User will update with real project details, URLs, and accurate statuses
- At least one entry per status type demonstrates all badge variants
- `techStack` arrays show technology tags that will render in ProductCard (Story 4.3)

**Status union type benefits:**

- `'live' | 'building' | 'coming-soon'` — TypeScript enforces only these exact strings
- Typos like `"Live"` or `"built"` cause compile-time errors
- Components can safely switch on status without fallback cases
- Adding a new status requires updating the type first (intentional friction)

**TypeScript validation:**

- Missing field → TS2741 error
- Wrong status value → TS2322 error ("not assignable to type")
- Both checked at compile time via `Project[]` type annotation

### Previous Story Intelligence (Story 3.4)

- `src/types/index.ts` already exports `Profile` and `SocialLink` interfaces
- `src/data/socialLinks.ts` and `src/data/profile.ts` follow the same pattern
- Prettier formats arrays with trailing commas
- ESLint has no issues with typed data files

### Project Structure Notes

- `src/types/index.ts` — updated (add Project interface)
- `src/data/projects.ts` — new file (typed projects array)

### What NOT To Do

- Do NOT create a separate types file for Project — use the barrel `src/types/index.ts`
- Do NOT use an enum for status — union type is simpler and provides same safety
- Do NOT add optional fields — all fields are required per spec
- Do NOT add image/icon paths — ProductCard handles visual presentation
- Do NOT import data inside any component — only pages import data
- Do NOT add real URLs yet — use placeholder URLs (user will update later)

### References

- [Source: architecture.md#Data-Layer] - Data files in src/data/, types in src/types/
- [Source: architecture.md#Props-Interface-Patterns] - Type barrel export pattern
- [Source: ux-design-specification.md#StatusBadge] - live, building, coming-soon variants
- [Source: project-context.md#Code-Quality] - camelCase data files, single barrel types

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None — clean implementation with no issues.

### Completion Notes List

- Added Project interface with union type status to src/types/index.ts
- Created src/data/projects.ts with 3 entries (2 building, 1 coming-soon)
- Verified TS2322 error for invalid status values
- Verified TS2741 error for missing required fields
- Build, lint, and format all pass cleanly
- Placeholder URLs and project names based on user's workspace repos

### File List

- `src/types/index.ts` (updated — added Project interface)
- `src/data/projects.ts` (created)
