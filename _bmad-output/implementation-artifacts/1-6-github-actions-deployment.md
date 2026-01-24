# Story 1.6: GitHub Actions Deployment

Status: review

## Story

As a **developer**,
I want the site to deploy automatically when I push to main,
So that content updates go live without manual steps.

## Acceptance Criteria

1. **Given** a push to the `main` branch
   **When** GitHub Actions triggers
   **Then** the workflow builds the Astro project (FR29)

2. **Given** the build completes successfully
   **When** the deploy step runs
   **Then** the `dist/` folder is deployed to GitHub Pages (FR30)

3. **Given** the site is deployed
   **When** a user visits the URL
   **Then** the site is accessible at `https://newbie974.github.io` with HTTPS (FR30)

4. **Given** a subsequent push to `main`
   **When** GitHub Actions triggers again
   **Then** the live site updates automatically (FR28)

5. **Given** the workflow file
   **When** inspected
   **Then** it uses the official `withastro/action@v5` for build
   **And** `actions/deploy-pages@v4` for deployment
   **And** requires only `contents: read`, `pages: write`, `id-token: write` permissions

## Tasks / Subtasks

- [x] Task 1: Create GitHub Actions workflow file (AC: #1, #2, #5)
  - [x] 1.1: Create `.github/workflows/deploy.yml`
  - [x] 1.2: Set trigger on push to `main` branch + `workflow_dispatch` for manual runs
  - [x] 1.3: Set permissions: `contents: read`, `pages: write`, `id-token: write`
  - [x] 1.4: Add `build` job using `actions/checkout@v5` + `withastro/action@v5`
  - [x] 1.5: Add `deploy` job using `actions/deploy-pages@v4` with `github-pages` environment
- [x] Task 2: Ensure package-lock.json exists (AC: #1)
  - [x] 2.1: Verify `package-lock.json` is committed (required for npm-based builds)
  - [x] 2.2: If missing, run `npm install` to generate it and commit
- [x] Task 3: Validate astro.config.mjs deployment settings (AC: #3)
  - [x] 3.1: Confirm `output: 'static'` is set (already done)
  - [x] 3.2: Confirm `site: 'https://newbie974.github.io'` is set (already done)
  - [x] 3.3: Confirm NO `base` property is set (user/org site deploys to root, not subpath)
- [x] Task 4: Validate build succeeds locally (AC: #1)
  - [x] 4.1: Run `npm run build` and verify `dist/` is generated
  - [x] 4.2: Run `npm run lint` and `npm run format:check`
- [x] Task 5: Document GitHub repo settings needed (AC: #3, #4)
  - [x] 5.1: Note in completion: user must go to repo Settings → Pages → Source → select "GitHub Actions"

## Dev Notes

### Architecture Requirements

- **Workflow file**: `.github/workflows/deploy.yml` (per architecture directory structure)
- **Official Astro action**: `withastro/action@v5` — handles install, build, and upload in one step
- **Deploy action**: `actions/deploy-pages@v4` — deploys the uploaded artifact to GitHub Pages
- **Trigger**: Push to `main` only (no other branches)
- **No `base` config**: This is a user/org site (`newbie974.github.io`), NOT a project site (`/repo-name`)
- **Lockfile required**: GitHub Actions needs `package-lock.json` to install dependencies deterministically

### Critical Technical Details

**Complete `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v5
      - name: Install, build, and upload your site
        uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**How `withastro/action@v5` works:**

- Detects package manager from lockfile (npm in our case via `package-lock.json`)
- Runs `npm ci` (clean install from lockfile)
- Runs `npm run build` (produces `dist/`)
- Uploads `dist/` as a GitHub Pages artifact
- No additional configuration needed for our setup

**`astro.config.mjs` (already correct, no changes needed):**

```javascript
export default defineConfig({
  output: "static",
  site: "https://newbie974.github.io",
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Why no `base` property:**

- User/org sites (`<username>.github.io`) deploy to the root `/`
- Project sites (`<username>.github.io/<repo>`) need `base: '/<repo>'`
- Our repo IS the user site, so root path is correct

### Previous Story Intelligence (Story 1.5)

- Build passes successfully (`npm run build` produces valid HTML in `dist/`)
- Lint and format checks pass
- MainLayout correctly renders with all semantic landmarks
- `dist/` directory is generated with static HTML, CSS, and assets
- Pre-commit hooks (Husky + lint-staged) enforce code quality on commits

### Project Structure Notes

- `.github/workflows/deploy.yml` — single workflow file for CI/CD
- No changes to existing source files needed — this story only adds the workflow
- `package-lock.json` must exist and be committed (verify this)
- `dist/` should already be in `.gitignore` (it's a build output)

### What NOT To Do

- Do NOT add `base` property to astro.config — this is a user/org site, not a project site
- Do NOT use the deprecated `@astrojs/tailwind` integration — we use `@tailwindcss/vite`
- Do NOT add custom `build-cmd` to the action — default `npm run build` is correct
- Do NOT set `node-version` unless needed — action defaults to Node 22 which is fine
- Do NOT add caching configuration — `withastro/action@v5` handles caching internally
- Do NOT modify any source files — this story only creates the workflow file
- Do NOT forget to tell the user about the GitHub repo settings (Pages → Source → GitHub Actions)

### Manual Step Required (Post-Commit)

After pushing the workflow to GitHub, the user must:

1. Go to repository Settings → Pages
2. Under "Build and deployment" → Source, select **"GitHub Actions"**
3. The next push to `main` will trigger the first deployment

### References

- [Source: architecture.md#Infrastructure-Deployment] - GitHub Pages hosting, GitHub Actions CI/CD
- [Source: architecture.md#Build-Boundaries] - dist/ → GitHub Actions → GitHub Pages
- [Source: architecture.md#Project-Structure] - .github/workflows/deploy.yml location
- [Source: project-context.md#Technology-Stack] - GitHub Pages, GitHub Actions
- [Source: Astro Docs - Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Source: withastro/action@v5](https://github.com/withastro/action)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- No source file changes needed — this story only adds the CI/CD workflow file
- `package-lock.json` already tracked in git (generated during Story 1.1)
- `dist/` already in `.gitignore`

### Completion Notes List

- Created `.github/workflows/deploy.yml` with official Astro deployment pattern
- Uses `withastro/action@v5` (auto-detects npm from lockfile, installs, builds, uploads)
- Uses `actions/deploy-pages@v4` for GitHub Pages deployment
- Triggers on push to `main` + manual `workflow_dispatch`
- Permissions: `contents: read`, `pages: write`, `id-token: write`
- `astro.config.mjs` already correctly configured: `output: 'static'`, `site: 'https://newbie974.github.io'`, no `base`
- Build, lint, and format checks all pass locally
- **MANUAL STEP REQUIRED:** After pushing to GitHub, go to repo Settings → Pages → Source → select "GitHub Actions"

### File List

- `.github/workflows/deploy.yml` (created: GitHub Actions workflow for build + deploy to Pages)
