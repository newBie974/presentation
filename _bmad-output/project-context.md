---
project_name: 'presentation-github'
user_name: 'Aymeric'
date: '2026-01-23'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'code_quality', 'anti_patterns']
status: 'complete'
rule_count: 38
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Astro** v5.x (stable) — static output mode, zero client JS by default
- **TypeScript** — strict tsconfig preset
- **Tailwind CSS** v4 — via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)
- **Node.js** — current LTS
- **GitHub Pages** — static hosting
- **GitHub Actions** — CI/CD

## Critical Implementation Rules

### Astro-Specific Rules

- Components use `.astro` extension with frontmatter (`---`) block for logic
- Props interface MUST be named `Props` — Astro convention
- Always destructure: `const { prop } = Astro.props;` — never access `Astro.props.x` in template
- Zero client-side JavaScript unless explicitly justified — no `client:*` directives without reason
- Use `<Image />` from `astro:assets` for all images — never raw `<img>` tags
- Static output only (`output: 'static'` in astro.config) — no SSR, no server endpoints

### Tailwind CSS v4 Rules

- Import via `@import "tailwindcss"` in `src/styles/global.css`
- NEVER use `@apply` — keep all utilities visible inline in templates
- NEVER use arbitrary values like `p-[13px]` — use Tailwind scale only
- Dark mode via `dark:` variant (class strategy, system-preference detection)
- Responsive: mobile-first, use `md:` (768px) and `lg:` (1024px) only
- All animations MUST use `motion-safe:` prefix — never apply animation without it
- Design tokens defined in `tailwind.config.mjs` — never hardcode colors/spacing

### Atomic Design Rules

- **Atoms** (`src/components/atoms/`): No child component imports. Pure presentational.
- **Molecules** (`src/components/molecules/`): Import atoms only. Functional units.
- **Organisms** (`src/components/organisms/`): Import atoms and molecules. Receive data as props.
- **Page** (`src/pages/index.astro`): ONLY file that imports data AND organisms. Composition root.
- Components NEVER import from `src/data/` — data flows down via props only
- Data flow is strictly unidirectional: `data → page → organism → molecule → atom`

### Accessibility (WCAG 2.1 AAA)

- Contrast ratio: 7:1 minimum for normal text, 4.5:1 for large text
- All interactive elements: semantic HTML only (`<a>`, `<button>`) — NEVER `<div>` with click handlers
- All icons: MUST have `aria-label` or adjacent `sr-only` text
- All external links: `target="_blank" rel="noopener noreferrer"` + descriptive `aria-label`
- Focus indicators: `focus-visible:` ring on every interactive element
- Page structure: exactly one `<h1>`, logical heading order, semantic landmarks
- All images: meaningful `alt` text via Astro `<Image />` component

### Performance Budget

- Total bundle: < 50KB (excluding images)
- Zero JavaScript shipped unless explicitly required (Astro islands)
- System fonts only — no font file downloads
- CSS-only animations — no JS animation libraries
- CLS = 0 — always set explicit `width`/`height` on images
- 60fps minimum for all animations — use `transform`/`opacity` only

### Code Quality & Style

- ESLint + Prettier enforced via pre-commit hooks (Husky + lint-staged)
- Component files: PascalCase (`ProductCard.astro`, `IconLinkedin.astro`)
- Data files: camelCase (`projects.ts`, `socialLinks.ts`)
- Types: single barrel export from `src/types/index.ts`
- No comments unless logic is non-obvious — code should be self-documenting

### Critical Anti-Patterns

- NEVER add `client:load` or any client directive without explicit justification
- NEVER import data inside components — only `pages/index.astro` imports data
- NEVER use icon fonts or external icon libraries — inline SVG atoms only
- NEVER add Google Fonts or any external font CDN — system fonts only
- NEVER use `@apply` in CSS — utilities stay in templates
- NEVER create components outside the atoms/molecules/organisms hierarchy
- NEVER use arbitrary Tailwind values (`[Xpx]`) — stick to the design system scale
- NEVER apply animations without `motion-safe:` wrapper

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge during implementation

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review periodically for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-01-23
