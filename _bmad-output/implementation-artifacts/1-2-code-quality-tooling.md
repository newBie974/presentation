# Story 1.2: Code Quality Tooling

Status: review

## Story

As a **developer**,
I want ESLint, Prettier, and pre-commit hooks configured,
So that every commit maintains consistent code quality.

## Acceptance Criteria

1. **Given** the initialized project from Story 1.1
   **When** code quality tools are installed
   **Then** ESLint is configured for Astro + TypeScript

2. **Given** ESLint is configured
   **When** linting is run on `.astro` and `.ts` files
   **Then** TypeScript-aware rules are enforced
   **And** Astro-specific rules are applied

3. **Given** Prettier is configured
   **When** formatting is run
   **Then** it formats `.astro`, `.ts`, `.css` files consistently
   **And** Tailwind CSS classes are sorted automatically

4. **Given** Husky is configured
   **When** `npm install` is run
   **Then** git hooks are installed automatically

5. **Given** lint-staged is configured
   **When** a commit is attempted with staged files
   **Then** ESLint + Prettier run on staged files before commit
   **And** a commit with formatting errors is blocked by the pre-commit hook

## Tasks / Subtasks

- [x] Task 1: Install ESLint with Astro + TypeScript plugins (AC: #1, #2)
  - [x] 1.1: Install dependencies: `npm install --save-dev eslint @eslint/js globals eslint-plugin-astro typescript-eslint`
  - [x] 1.2: Create `eslint.config.mjs` with flat config (ESLint v9 format)
  - [x] 1.3: Verify linting works: `npx eslint "src/**/*.{js,ts,astro}"`
- [x] Task 2: Install and configure Prettier (AC: #3)
  - [x] 2.1: Install dependencies: `npm install --save-dev prettier prettier-plugin-astro prettier-plugin-tailwindcss`
  - [x] 2.2: Create `.prettierrc` with astro parser override and tailwindcss plugin
  - [x] 2.3: Verify formatting works: `npx prettier --check "src/**/*.{astro,ts,css}"`
- [x] Task 3: Install and configure Husky + lint-staged (AC: #4, #5)
  - [x] 3.1: Install dependencies: `npm install --save-dev husky lint-staged`
  - [x] 3.2: Run `npx husky init` to create `.husky/` directory and `prepare` script
  - [x] 3.3: Edit `.husky/pre-commit` to run `npx lint-staged`
  - [x] 3.4: Create `lint-staged.config.mjs` with ESLint + Prettier commands
- [x] Task 4: Add convenience scripts to package.json (AC: foundational)
  - [x] 4.1: Add `"lint"` script: `eslint "src/**/*.{js,ts,astro}"`
  - [x] 4.2: Add `"lint:fix"` script: `eslint --fix "src/**/*.{js,ts,astro}"`
  - [x] 4.3: Add `"format"` script: `prettier --write "src/**/*.{astro,ts,css,md}"`
  - [x] 4.4: Add `"format:check"` script: `prettier --check "src/**/*.{astro,ts,css,md}"`
- [x] Task 5: Verify pre-commit hook blocks bad commits (AC: #5)
  - [x] 5.1: Create a temporary file with intentional formatting issues
  - [x] 5.2: Stage and attempt to commit — verify hook blocks the commit
  - [x] 5.3: Run lint:fix + format, re-commit — verify commit succeeds
  - [x] 5.4: Clean up temporary test file

## Dev Notes

### Architecture Requirements

- **ESLint v9 flat config** (`eslint.config.mjs`) — NOT legacy `.eslintrc.cjs` format
- **Prettier** with `prettier-plugin-astro` (parser) + `prettier-plugin-tailwindcss` (class sorting)
- **Husky v9** with `npx husky init` — NOT legacy `husky install`
- **lint-staged** via `lint-staged.config.mjs` (ESM format)
- Architecture doc mentions `.eslintrc.cjs` — OVERRIDE to `eslint.config.mjs` (ESLint v9 is current standard)

### Critical Technical Details

**ESLint v9 Flat Config (eslint.config.mjs):**

```javascript
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/", "**/*.d.ts", ".astro/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
);
```

**Prettier Config (.prettierrc):**

```json
{
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/styles/global.css",
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

**Husky v9 Setup:**

- `npx husky init` creates `.husky/` directory + adds `prepare` script to package.json
- The `prepare` script now runs just `husky` (not `husky install`)
- Hook files in `.husky/` are plain shell scripts

**lint-staged Config (lint-staged.config.mjs):**

```javascript
export default {
  "*.{astro,js,ts}": ["eslint --fix"],
  "*.{astro,js,ts,json,css,md}": ["prettier --write"],
};
```

**Package Versions (January 2026):**

- eslint: ^9.x
- @eslint/js: ^9.x
- globals: ^17.x
- eslint-plugin-astro: ^1.5.x
- typescript-eslint: ^8.x
- prettier: ^3.8.x
- prettier-plugin-astro: ^0.14.x
- prettier-plugin-tailwindcss: ^0.7.x
- husky: ^9.x
- lint-staged: latest

### Previous Story Intelligence (Story 1.1)

- Project uses `"type": "module"` in package.json — all config files should be `.mjs` or ESM
- Astro v5.16.15 with strict TypeScript
- Tailwind CSS v4.1.18 via `@tailwindcss/vite`
- `src/styles/global.css` exists with `@import "tailwindcss"`
- Directories exist: `src/components/{atoms,molecules,organisms}/`, `src/data/`, `src/types/`, `src/layouts/`
- `src/types/index.ts` contains `export {};`
- `.vscode/` directory exists (can add ESLint/Prettier settings)

### Project Structure Notes

- `eslint.config.mjs` in project root (replaces `.eslintrc.cjs` from architecture doc)
- `.prettierrc` in project root (JSON format, simple and compatible)
- `.husky/pre-commit` created by `npx husky init`
- `lint-staged.config.mjs` in project root

### What NOT To Do

- Do NOT use `.eslintrc.cjs` or `.eslintrc.json` — use ESLint v9 flat config
- Do NOT install `@typescript-eslint/parser` or `@typescript-eslint/eslint-plugin` separately — use unified `typescript-eslint` package
- Do NOT use `husky install` — that's Husky v8 syntax
- Do NOT use `husky add` — directly edit hook files in `.husky/`
- Do NOT add `eslint-plugin-jsx-a11y` yet — no JSX in this project (Astro components)
- Do NOT configure ESLint rules that conflict with Prettier (flat config handles this)
- Do NOT forget `tailwindStylesheet` option in Prettier config (required for Tailwind v4)

### References

- [Source: architecture.md#Infrastructure-Deployment] - Code Quality: ESLint + Prettier + Husky + lint-staged
- [Source: architecture.md#Project-Structure-Boundaries] - Config file locations
- [Source: project-context.md#Code-Quality-Style] - ESLint + Prettier enforced via pre-commit hooks
- [Source: eslint-plugin-astro docs](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) - ESLint flat config for Astro
- [Source: prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) - Prettier Astro plugin
- [Source: Husky docs](https://typicode.github.io/husky/get-started.html) - Husky v9 init approach
- [Source: typescript-eslint](https://typescript-eslint.io/packages/typescript-eslint/) - Unified TS-ESLint package

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Prettier reformatted `src/pages/index.astro` on initial run (minor whitespace changes from Story 1.1)
- Pre-commit hook correctly blocked commit with `@typescript-eslint/no-unused-vars` error on test file
- lint-staged reports "no staged files matching configured tasks" for `.mjs` files (config files at root) — expected behavior since lint-staged patterns target source file extensions

### Completion Notes List

- ESLint v9.39.2 configured with flat config (`eslint.config.mjs`)
- eslint-plugin-astro v1.5.0 for `.astro` file linting
- typescript-eslint v8.53.1 for TypeScript-aware rules
- Prettier v3.8.1 with prettier-plugin-astro v0.14.1 and prettier-plugin-tailwindcss v0.7.2
- Husky v9.1.7 initialized with `prepare` script in package.json
- lint-staged v16.2.7 configured to run ESLint + Prettier on staged files
- Pre-commit hook verified: blocks commits with linting errors
- Build regression check passed — `npm run build` still produces valid output
- All 5 acceptance criteria satisfied

### File List

- `eslint.config.mjs` (created: ESLint v9 flat config for Astro + TypeScript)
- `.prettierrc` (created: Prettier config with Astro + Tailwind plugins)
- `.husky/pre-commit` (created by husky init, modified: runs lint-staged)
- `lint-staged.config.mjs` (created: ESLint + Prettier on staged files)
- `package.json` (modified: added devDependencies, scripts, prepare hook)
- `package-lock.json` (modified: lockfile updated with new dependencies)
- `src/pages/index.astro` (modified: Prettier formatting applied)
