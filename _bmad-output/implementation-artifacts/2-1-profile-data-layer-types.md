# Story 2.1: Profile Data Layer & Types

Status: review

## Story

As a **developer (Aymeric)**,
I want profile information stored in a typed data file,
So that I can update my identity without touching components.

## Acceptance Criteria

1. **Given** the `src/types/index.ts` file
   **When** the Profile interface is defined
   **Then** it includes `name: string`, `tagline: string`, `avatarPath: string`

2. **Given** the data layer
   **When** `src/data/profile.ts` is created
   **Then** it exports a typed `Profile` object with Aymeric's data

3. **Given** the Profile interface in types
   **When** TypeScript compilation runs
   **Then** TypeScript compilation fails if required fields are missing (FR20)

## Tasks / Subtasks

- [x] Task 1: Define Profile interface in `src/types/index.ts` (AC: #1)
  - [x] 1.1: Replace empty `export {}` with the `Profile` interface
  - [x] 1.2: Interface has three required fields: `name: string`, `tagline: string`, `avatarPath: string`
  - [x] 1.3: Export the interface as a named export
- [x] Task 2: Create `src/data/profile.ts` with typed data (AC: #2)
  - [x] 2.1: Create `src/data/profile.ts`
  - [x] 2.2: Import `Profile` type from `../types/index`
  - [x] 2.3: Export a `profile` constant typed as `Profile` with Aymeric's data
  - [x] 2.4: Set `name: "Aymeric"`, `tagline: "Builder & Creator"`, `avatarPath: "/presentation/avatar.webp"`
- [x] Task 3: Validate TypeScript strict checking (AC: #3)
  - [x] 3.1: Run `npx astro check` or `npx tsc --noEmit` to verify type safety
  - [x] 3.2: Temporarily remove a field to confirm compilation fails, then restore
- [x] Task 4: Validate build and lint (AC: all)
  - [x] 4.1: Run `npm run build` and verify success
  - [x] 4.2: Run `npm run lint` and `npm run format:check`

## Dev Notes

### Architecture Requirements

- **Types barrel**: `src/types/index.ts` is the single barrel export for all interfaces (Project, SocialLink, Profile)
- **Data files**: `src/data/profile.ts` — camelCase filename, exports typed object
- **Data flow**: `src/data/*.ts` → `src/pages/index.astro` → organisms (props) → molecules (props) → atoms (props)
- **No component imports**: Data files are only imported by `pages/index.astro` (composition root)
- **Strict TypeScript**: Project uses `strict` preset — all fields are required unless explicitly optional

### Critical Technical Details

**`src/types/index.ts`:**

```typescript
export interface Profile {
  name: string;
  tagline: string;
  avatarPath: string;
}
```

**`src/data/profile.ts`:**

```typescript
import type { Profile } from "../types/index";

export const profile: Profile = {
  name: "Aymeric",
  tagline: "Builder & Creator",
  avatarPath: "/presentation/avatar.webp",
};
```

**Key decisions:**

- `avatarPath` uses the base path prefix (`/presentation/`) because the site deploys to a subpath
- Avatar image will be added to `public/` in Story 2.2 — for now the path is just a string reference
- Using `import type` for the Profile import (TypeScript best practice — erased at compile time)
- The `profile` constant is exported (not default export) — consistent with future `projects` and `socialLinks` exports

**Future interfaces (added in later stories):**

- `SocialLink` — Story 3.1
- `Project` — Story 4.1

### Previous Story Intelligence (Story 1.6)

- Build passes successfully with `output: 'static'` and `base: '/presentation'`
- `src/types/index.ts` exists with only `export {};` — needs to be replaced
- `src/data/` directory exists but is empty
- ESLint + Prettier enforce code style on commit
- Pre-commit hooks run lint-staged

### Project Structure Notes

- `src/types/index.ts` — single barrel file for ALL type definitions
- `src/data/profile.ts` — profile data (name, tagline, avatarPath)
- No component changes in this story — data layer only
- Asset path must include `/presentation/` base prefix for GitHub Pages deployment

### What NOT To Do

- Do NOT create separate type files — everything goes in `src/types/index.ts`
- Do NOT use default exports — use named exports for tree-shaking
- Do NOT import data in components — only `pages/index.astro` imports data
- Do NOT add the actual avatar image yet — that's Story 2.2
- Do NOT add Project or SocialLink interfaces yet — those are Stories 3.1 and 4.1
- Do NOT use `any` or type assertions — strict typing only
- Do NOT put the image in `src/assets/` — avatar goes in `public/` for direct serving (Story 2.2)

### References

- [Source: architecture.md#Props-Interface-Patterns] - Types barrel, named Props convention
- [Source: architecture.md#Naming-Patterns] - camelCase data files, PascalCase components
- [Source: architecture.md#Data-Flow] - Unidirectional data flow pattern
- [Source: architecture.md#Project-Structure] - src/types/index.ts, src/data/profile.ts locations
- [Source: project-context.md#Atomic-Design-Rules] - Data flows down via props only
- [Source: epics.md#Epic-2-Story-2.1] - Profile interface requirements (FR20)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- `npx tsc --noEmit --strict` on data layer files passes clean
- Verified missing field causes TS2741 error ("Property 'avatarPath' is missing")
- `astro.config.mjs` has unrelated Vite plugin type mismatch (pre-existing, not our issue)

### Completion Notes List

- Profile interface defined with 3 required string fields: name, tagline, avatarPath
- `src/data/profile.ts` exports typed `profile` constant with Aymeric's data
- Uses `import type` for Profile import (erased at compile time)
- `avatarPath` includes `/presentation/` base prefix for GitHub Pages subpath
- TypeScript strict checking confirmed: missing fields cause compilation failure
- Build, lint, and format checks all pass

### File List

- `src/types/index.ts` (modified: replaced empty export with Profile interface)
- `src/data/profile.ts` (created: typed profile data object)
