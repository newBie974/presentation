---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-01-23'
inputDocuments: ['prd.md', 'ux-design-specification.md', 'brainstorming-session-2026-01-23.md']
workflowType: 'architecture'
project_name: 'presentation-github'
user_name: 'Aymeric'
date: '2026-01-23'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
30 FRs covering 8 capability areas. Architecturally significant groupings:
- **Data-driven rendering** (FR5-9, FR17-20): Products and links rendered from typed data files — requires clean data→component mapping
- **Visual experience** (FR13-16): Dark mode, animations, hover states, reduced-motion — requires a consistent animation/theming system
- **SEO/Social** (FR21-23): OG tags, Twitter Cards, structured data — requires proper head management at build time
- **Accessibility** (FR24-27): Full keyboard nav, ARIA, AAA contrast, focus indicators — baked into every component

**Non-Functional Requirements:**
12 NFRs focused on two pillars:
- **Performance** (NFR1-6): FCP < 1s, bundle < 50KB, Lighthouse 100, 60fps, TTI < 1.5s, CLS = 0
- **Accessibility** (NFR7-12): WCAG 2.1 AAA, keyboard-only nav, reduced-motion, Lighthouse 100

**Scale & Complexity:**

- Primary domain: Static web (SSG)
- Complexity level: Low
- Estimated architectural components: ~12-15 (atoms + molecules + organisms + layout + page)

### Technical Constraints & Dependencies

- **Astro SSG** — zero client JS by default, islands only if explicitly needed
- **GitHub Pages hosting** — static files only, no server functions, no redirects config
- **Public repository** — code is part of the portfolio, must be exemplary
- **50KB budget** — limits font choices, icon approach, and any JS inclusion
- **CSS-only animations** preferred — no Framer Motion, GSAP, or similar
- **System fonts or single variable font** — no multi-font loading

### Cross-Cutting Concerns Identified

- **Animation system**: Must work across all interactive components while respecting `prefers-reduced-motion` — needs a unified approach (CSS custom properties + utility classes)
- **Dark mode theming**: System-preference based, affecting all components — needs design tokens strategy
- **Accessibility (AAA)**: Every component must meet 7:1 contrast, keyboard nav, ARIA — needs component-level enforcement
- **Performance budget**: Every decision filtered through 50KB/CLS=0/60fps constraints — needs build-time validation approach
- **Responsive design**: Mobile-first with 3 breakpoints (320px, 768px, 1024px) — Tailwind breakpoints alignment

## Starter Template Evaluation

### Primary Technology Domain

Static web (SSG) — single-page personal landing page with zero backend requirements.

### Starter Options Considered

| Option | Verdict |
|--------|---------|
| Official Astro Minimal | **Selected** — clean slate matching code-as-portfolio philosophy |
| Third-party starters (Astroplate, AstroWind, Hello Astro) | Rejected — impose blog/multi-page structures, conflict with Atomic Design |
| Astro Basics template | Rejected — includes demo content and file-based routing patterns unnecessary for single page |

### Selected Starter: Astro Minimal + Tailwind v4

**Rationale for Selection:**
- Clean foundation allows custom Atomic Design structure
- The repository itself is the portfolio — custom setup demonstrates craftsmanship
- Minimal dependencies align with 50KB performance budget
- Tailwind v4's Vite plugin is the current recommended approach (deprecated `@astrojs/tailwind` integration skipped)

**Initialization Command:**

```bash
npm create astro@latest presentation-github -- --template minimal --typescript strict
cd presentation-github
npx astro add tailwind
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript with `strict` tsconfig preset
- Astro v5.x (stable) — compile-time TS, zero runtime JS by default

**Styling Solution:**
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- CSS imported via `@import "tailwindcss"` in global stylesheet
- Utility-first with design tokens in `tailwind.config`

**Build Tooling:**
- Vite (bundled with Astro) for dev server and production builds
- Static output mode (`output: 'static'`) for GitHub Pages

**Testing Framework:**
- Not included by starter — deferred to post-MVP

**Code Organization:**
- `src/pages/index.astro` — single page entry
- `src/layouts/` — layout wrapper
- `src/styles/global.css` — Tailwind entry point
- Custom Atomic Design structure to be added: `src/components/{atoms,molecules,organisms}/`
- Custom data layer: `src/data/` and `src/types/`

**Development Experience:**
- Hot reload via Vite dev server (`localhost:4321`)
- TypeScript autocompletion and type checking
- Tailwind IntelliSense support

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Icon strategy, font strategy, animation approach, image optimization — all affect component design from day one

**Important Decisions (Shape Architecture):**
- Code quality tooling — affects developer workflow and repo presentation

**Deferred Decisions (Post-MVP):**
- Testing strategy — can be added later without architectural impact

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Icon Strategy | Inline SVG components (Astro atoms) | Zero dependencies, fully stylable, ships only used icons, fits Atomic Design |
| Font Strategy | System font stack (`system-ui, -apple-system, sans-serif`) | 0KB cost, preserves full 50KB budget for visual effects |
| Animation Approach | Tailwind utilities + custom `@keyframes` hybrid | Utilities for hover/focus, keyframes for entrances, `motion-safe:`/`motion-reduce:` for a11y |
| Image Optimization | Astro `<Image />` component | Built-in WebP/AVIF generation, responsive srcset, CLS prevention, zero config |

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | GitHub Pages (static files) | Free, HTTPS, public repo requirement |
| CI/CD | GitHub Actions (build + deploy on push to main) | Official Astro GitHub Pages action, zero cost |
| Code Quality | ESLint + Prettier + Husky + lint-staged | Professional workflow visible in public repo, auto-clean commits |

### Deferred Decisions

| Decision | Reason for Deferral |
|----------|-------------------|
| Testing (unit/e2e) | Can be added post-MVP without architectural changes |
| Analytics | Post-MVP feature per PRD phasing |
| Custom domain | Post-MVP infrastructure enhancement |

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (starter + Tailwind)
2. Code quality tooling setup (ESLint, Prettier, Husky)
3. Design tokens + animation system (Tailwind config, keyframes, reduced-motion)
4. Atomic components (SVG icons, then molecules, then organisms)
5. Data layer + page composition
6. SEO/OG meta tags
7. GitHub Actions deployment

**Cross-Component Dependencies:**
- Animation system must be defined before building interactive components
- Design tokens (colors, spacing) must be in Tailwind config before any component styling
- SVG icon atoms are dependencies for molecules (LinkCard, SocialIcon)
- Data types must be defined before data files and components that consume them

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

5 areas where AI agents could make different choices, now standardized.

### Naming Patterns

**Component Files:**
- Components: `PascalCase.astro` (e.g., `LinkCard.astro`, `IconLinkedin.astro`)
- Data files: `camelCase.ts` (e.g., `projects.ts`, `socialLinks.ts`)
- Types: single barrel file `src/types/index.ts`

### Atomic Design Boundaries

| Level | Definition | Examples |
|-------|-----------|----------|
| Atoms | Single-purpose, no children components, purely presentational | `IconLinkedin.astro`, `Badge.astro`, `Avatar.astro` |
| Molecules | Combine 2+ atoms into a functional unit | `LinkCard.astro`, `SocialIcon.astro` |
| Organisms | Complete page sections, consume data | `HeroSection.astro`, `ProductList.astro`, `SocialBar.astro` |

**Rule:** If it imports another component, it's at least a molecule. If it receives data arrays and renders multiple items, it's an organism.

### Props & Interface Patterns

- Props interface always named `Props` (Astro convention), defined in frontmatter
- Destructure props in frontmatter: `const { title, status } = Astro.props;`
- Data types (`Project`, `SocialLink`) live in `src/types/index.ts`
- Components never import data directly — organisms receive data as props from the page

### Tailwind & Styling Patterns

- Tailwind utilities applied inline on elements
- Custom classes only for `@keyframes` animations in `global.css`
- Dark mode via `dark:` variant (system-preference in Tailwind config)
- Responsive: mobile-first with `md:` and `lg:` breakpoints
- Reduced motion: wrap animations with `motion-safe:`
- No `@apply` — keep utilities visible in templates
- Use Tailwind scale values, never arbitrary `[Xpx]` values

### Accessibility Enforcement

- Interactive elements: semantic HTML only (`<a>`, `<button>`)
- Icons: always `aria-label` or `sr-only` text
- Images: always `alt` text via Astro `<Image />`
- Focus: visible `focus-visible:` ring on all interactive elements
- Contrast: 7:1 ratio minimum (Tailwind 900/100 pairs)
- External links: `target="_blank" rel="noopener noreferrer"` + descriptive `aria-label`
- Structure: one `<h1>`, logical heading order, semantic landmarks (`<main>`, `<nav>`, `<section>`)

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow PascalCase for components, camelCase for data files
- Respect Atomic Design boundaries (atom → molecule → organism hierarchy)
- Never use `@apply`, arbitrary values, or non-semantic interactive elements
- Always include accessibility attributes on interactive/visual elements
- Use `motion-safe:` on all animation classes

## Project Structure & Boundaries

### Complete Project Directory Structure

```
presentation-github/
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions: build + deploy to Pages
├── .husky/
│   └── pre-commit                    # Runs lint-staged on commit
├── public/
│   ├── favicon.svg                   # Site favicon
│   └── og-image.png                  # Open Graph preview image (1200x630)
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Avatar.astro          # Profile photo (uses Astro Image)
│   │   │   ├── Badge.astro           # Status badge (Live/Building/Coming Soon)
│   │   │   ├── IconLinkedin.astro    # Inline SVG
│   │   │   ├── IconTwitter.astro     # Inline SVG
│   │   │   ├── IconInstagram.astro   # Inline SVG
│   │   │   ├── IconTiktok.astro      # Inline SVG
│   │   │   └── IconExternal.astro    # External link arrow SVG
│   │   ├── molecules/
│   │   │   ├── ProductCard.astro     # Icon + title + tagline + badge + tech stack
│   │   │   └── SocialLink.astro      # Icon + platform name + link
│   │   └── organisms/
│   │       ├── HeroSection.astro     # Avatar + name + tagline
│   │       ├── ProductList.astro     # Maps over projects → ProductCard
│   │       └── SocialBar.astro       # Maps over socialLinks → SocialLink
│   ├── data/
│   │   ├── projects.ts               # Project[] array (typed data)
│   │   ├── socialLinks.ts            # SocialLink[] array (typed data)
│   │   └── profile.ts                # Profile info (name, tagline, avatar path)
│   ├── layouts/
│   │   └── MainLayout.astro          # HTML shell, head meta, OG tags, global styles
│   ├── pages/
│   │   └── index.astro               # Single page: imports organisms + data, composes page
│   ├── styles/
│   │   └── global.css                # @import "tailwindcss" + @keyframes animations
│   └── types/
│       └── index.ts                   # Project, SocialLink, Profile interfaces
├── astro.config.mjs                   # Astro config (static output, site URL)
├── tailwind.config.mjs                # Design tokens, dark mode, breakpoints
├── tsconfig.json                      # Strict TypeScript config
├── .eslintrc.cjs                      # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── .gitignore                         # Node modules, dist, .env
├── package.json                       # Dependencies + scripts
└── lint-staged.config.mjs             # Lint-staged configuration
```

### Requirements to Structure Mapping

| FR Category | Primary Location | Components |
|------------|-----------------|------------|
| Profile Presentation (FR1-4) | `organisms/HeroSection.astro` | Avatar + name + tagline |
| Product Showcase (FR5-9) | `organisms/ProductList.astro` + `molecules/ProductCard.astro` | Cards with badges |
| Social Connectivity (FR10-12) | `organisms/SocialBar.astro` + `molecules/SocialLink.astro` | Icon links |
| Visual Experience (FR13-16) | `styles/global.css` + `tailwind.config.mjs` | Animations, dark mode |
| Content Management (FR17-20) | `data/*.ts` + `types/index.ts` | Typed data files |
| Social Sharing (FR21-23) | `layouts/MainLayout.astro` | OG/Twitter meta, JSON-LD |
| Accessibility (FR24-27) | Cross-cutting (all components) | Semantic HTML, ARIA, focus |
| Deployment (FR28-30) | `.github/workflows/deploy.yml` | Build + deploy pipeline |

### Architectural Boundaries

**Component Boundaries:**
- `pages/index.astro` is the only file that imports data AND organisms — it's the composition root
- Organisms receive typed props — they never import from `src/data/`
- Molecules receive primitive/typed props — they never know about organisms
- Atoms are self-contained — no imports from other components

**Data Flow:**
```
src/data/*.ts → src/pages/index.astro → organisms (props) → molecules (props) → atoms (props)
```

**Build Boundaries:**
- `src/` → Astro builds to `dist/` (static HTML/CSS/JS)
- `dist/` → GitHub Actions deploys to GitHub Pages
- `public/` → Copied directly to `dist/` (no processing)

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:** All technology choices are compatible — Astro v5.x natively supports TypeScript strict, Tailwind v4 via Vite plugin, static output for GitHub Pages, and CSS-based animations. No version conflicts detected.

**Pattern Consistency:** Naming conventions (PascalCase components, camelCase data), Atomic Design boundaries, Props patterns, and Tailwind-only styling all align with Astro ecosystem conventions.

**Structure Alignment:** Directory structure directly supports Atomic Design hierarchy. Data flow is unidirectional (data → page → organisms → molecules → atoms). Build boundaries are clean (src → dist → GitHub Pages).

### Requirements Coverage Validation

**Functional Requirements:** All 30 FRs across 8 categories are mapped to specific architectural components with clear ownership.

**Non-Functional Requirements:** All 12 NFRs are addressed — performance via Astro SSG + 50KB budget + CSS animations, accessibility via AAA enforcement patterns across all components.

### Implementation Readiness Validation

**Decision Completeness:** All critical and important decisions are documented with rationale, versions verified.

**Structure Completeness:** Every file and directory is named with purpose annotations.

**Pattern Completeness:** All potential AI agent conflict points are addressed with enforceable rules.

### Architecture Completeness Checklist

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Zero-JS-by-default architecture eliminates performance risks
- Clear unidirectional data flow prevents component coupling
- Strict Atomic Design boundaries prevent scope creep
- Accessibility patterns baked into every component level

**First Implementation Priority:**
```bash
npm create astro@latest presentation-github -- --template minimal --typescript strict
```

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED
**Total Steps Completed:** 8
**Date Completed:** 2026-01-23
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**Implementation Ready Foundation**
- 10 architectural decisions made (icons, fonts, animations, images, hosting, CI/CD, code quality, component naming, styling, accessibility)
- 5 implementation pattern categories defined
- 15 architectural components specified
- 42 requirements (30 FR + 12 NFR) fully supported

**AI Agent Implementation Guide**
- Technology stack with verified versions (Astro v5.x, Tailwind v4, TypeScript strict)
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Atomic Design hierarchy with enforceable rules

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing presentation-github. Follow all decisions, patterns, and structures exactly as documented.

**Development Sequence:**
1. Initialize project: `npm create astro@latest -- --template minimal --typescript strict`
2. Add Tailwind: `npx astro add tailwind`
3. Set up code quality tooling (ESLint, Prettier, Husky, lint-staged)
4. Create Atomic Design directory structure
5. Define TypeScript interfaces in `src/types/index.ts`
6. Build atoms (SVG icons, Badge, Avatar)
7. Build molecules (ProductCard, SocialLink)
8. Build organisms (HeroSection, ProductList, SocialBar)
9. Create data files and compose page
10. Configure MainLayout with SEO/OG meta
11. Set up GitHub Actions deployment

---

**Architecture Status:** READY FOR IMPLEMENTATION

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
