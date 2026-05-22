# aymeric.dijoux.dev

The personal site of **Aymeric Dijoux** — indie builder, software engineer, and consumer apps founder.

Live at **[aymeric.dijoux.dev](https://aymeric.dijoux.dev)**.

> Indie builder first, freelance second. A hub for the apps I build (VoiceJournal, Caroubolt, Tookta), my path so far, my notes on the craft, and a door for the right kind of work together.

---

## Stack

| Layer             | Choice                                                                            |
| ----------------- | --------------------------------------------------------------------------------- |
| Framework         | **Astro 6** (static output, zero JS by default)                                   |
| Styling           | **Tailwind 4** with `@theme` + CSS variables                                      |
| Content           | **Astro Content Collections** + MDX, Zod-validated frontmatter                    |
| Code highlighting | **Shiki** (`github-light` / `github-dark`)                                        |
| Icons             | **astro-icon** + iconify (`lucide`, `simple-icons`)                               |
| Fonts             | Self-hosted via `@fontsource-variable` — Inter Tight + JetBrains Mono             |
| i18n              | Native Astro i18n, default locale `fr` with no prefix, EN under `/en/`            |
| SEO / GEO         | Sitemap + `<JsonLd>` entity graph + `llms.txt` + AI-crawler-friendly `robots.txt` |
| Tests / CI        | Lighthouse CI · `@axe-core/playwright` · custom JSON-LD validator                 |
| Deploy            | GitHub Pages via GitHub Actions on `aymeric.dijoux.dev`                           |

No JS framework on top of Astro. No React, no Vue, no Svelte. Hydration cost = 0 by default.

---

## Visual system — D1 "Swiss Brutalist"

- 100% sans-serif Inter Tight Variable, no body serif
- Accent: **fluo highlighter `#ccff00`** on a word in titles
- 2px black borders everywhere, zero border-radius
- Mono pills (JetBrains Mono) for tags, dates, technical metadata
- Strong block pattern (label on `#0a0a0a` with fluo text) that inverts in dark mode
- All design tokens live in `src/styles/theme.css` — including dark mode overrides under `[data-theme="dark"]`

The full design rationale lives in `docs/superpowers/specs/2026-05-21-portfolio-design.md`.

---

## Project structure

```
src/
├─ assets/                     avatars, app logos, portrait
├─ components/
│  ├─ atoms/                   Avatar, StatusBadge, ThemeToggle, Icon, Highlight, JsonLd, SectionLabel
│  ├─ molecules/               SocialLink, AppCell, NoteRow, Chapter, FAQItem, ProcessStep, ServiceCard, StackGroup, LangToggle
│  ├─ organisms/               Nav, Hero, AppsGrid, SocialBar, Footer, CollabBand, AboutExcerpt, NotesSection
│  └─ prose/                   Callout, FileBlock (MDX components)
├─ content/
│  ├─ config.ts                Zod schema for the notes collection
│  └─ notes/
│     ├─ fr/                   FR articles (.mdx)
│     └─ en/                   EN articles (.mdx)
├─ data/                       profile, projects, socialLinks, services, faq, chapters, stack
├─ i18n/                       ui strings (FR/EN), useTranslations, localizePath, alternateLocale
├─ layouts/                    MainLayout, NoteLayout
├─ lib/                        constants, dates, readingTime, notes, jsonLd, geo
├─ pages/
│  ├─ index.astro              Home FR
│  ├─ a-propos.astro           About FR
│  ├─ collaborer.astro         Work-together FR
│  ├─ notes/                   index, [slug], tags/[tag]
│  ├─ robots.txt.ts            AI-crawler allow list + sitemap link
│  ├─ llms.txt.ts              GEO summary for LLM consumption
│  ├─ llms-full.txt.ts         Exhaustive GEO content dump
│  ├─ ai.txt.ts                AI usage policy
│  ├─ rss.xml.ts               RSS FR
│  └─ en/                      EN mirror — same routes with translated slugs (about, writing, work) + en/rss.xml.ts
├─ styles/                     global.css, theme.css, prose.css
└─ types/                      shared TypeScript interfaces
```

---

## GEO (Generative Engine Optimization)

This site is designed to be surfaced and cited by AI search engines (ChatGPT, Claude, Perplexity, Google AI Overviews).

- **`/llms.txt`** at the root, structured for LLM ingestion (per [llmstxt.org](https://llmstxt.org))
- **`/llms-full.txt`** with the full exhaustive content
- **`/robots.txt`** explicitly allows `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `CCBot` and others
- **`/ai.txt`** declares AI usage policy
- **JSON-LD entity graph** on every public page: `Person` (canonical with `@id`), `WebSite`, `SoftwareApplication` for each app, `BlogPosting` for each note, `FAQPage` on the work-together page, `BreadcrumbList` on navigable pages
- **`hreflang`** declarations on every bilingual page
- **A CI validator** (`scripts/validate-jsonld.mjs`) checks that no public page ships without `Person` JSON-LD

---

## Commands

```bash
npm install                    # install deps
npm run dev                    # http://localhost:4321
npm run build                  # output → ./dist (static)
npm run preview                # serve ./dist locally
npm run astro check            # TypeScript + Astro diagnostics
npm run lint                   # ESLint
npm run lint:fix               # ESLint --fix
npm run format                 # Prettier write
npm run format:check           # Prettier check
npm run validate:jsonld        # custom GEO validator (run after build)
```

---

## Quality gates

Every push to `main` runs in CI:

- `astro check` (TS + Astro diagnostics) — must pass
- `eslint` + `prettier --check` — must pass
- `astro build` — must pass
- `validate-jsonld.mjs` — must find a Person JSON-LD on every public page
- `@axe-core/playwright` — must report zero a11y violations on `/`, `/a-propos`, `/notes`, `/collaborer` and their EN mirrors
- `@lhci/cli` — must hit Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO = 100

If any of those fail, the site does **not** deploy.

---

## Engineering contract

The repo uses a `CLAUDE.md` at the root that documents the coding conventions enforced across the codebase: file-size limits, TypeScript strictness, naming, no hardcoded colors or UI strings, A11y rules, performance budgets, conventional commits.

That file is loaded by Claude Code on every session and serves as the engineering contract for any contributor — human or agent.

---

## License

Code: MIT. Content (articles, design): all rights reserved.

If you're forking this for your own portfolio, the code is yours to take. The Mind Score concept, the D1 design system identity, and the written articles stay with me.

---

## Links

- Live: **[aymeric.dijoux.dev](https://aymeric.dijoux.dev)**
- Apps: [VoiceJournal](https://aivoicejournal.app) · [Caroubolt](https://caroubolt.com) · [Tookta](https://tookta.fr)
- LinkedIn: [linkedin.com/in/aymeric-dijoux](https://www.linkedin.com/in/aymeric-dijoux/)
- GitHub: [github.com/newBie974](https://github.com/newBie974)
