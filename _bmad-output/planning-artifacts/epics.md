---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-01-23'
totalEpics: 5
totalStories: 21
frsCovered: 30
inputDocuments: ['prd.md', 'architecture.md', 'ux-design-specification.md']
---

# presentation-github - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for presentation-github, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Display professional profile name prominently at the top of the page
FR2: Display a concise professional tagline below the name
FR3: Display a high-quality profile avatar/photo
FR4: Position profile section as the primary visual element (hero section)
FR5: Display product/project cards with title and brief tagline
FR6: Show status badges on each product (Live, Building, Coming Soon)
FR7: Make product cards clickable, linking to the product URL
FR8: Display tech stack tags on product cards
FR9: Visually distinguish products by their current status
FR10: Display social media platform links (LinkedIn, X, Instagram, TikTok)
FR11: Social links open in new tabs with proper security attributes
FR12: Use recognizable platform-specific icons for social links
FR13: Implement dark mode as default (system-preference based)
FR14: Create entrance animations for page elements on initial load
FR15: Provide hover/tap feedback on all interactive elements
FR16: Support reduced-motion preferences with graceful degradation
FR17: Allow adding new products via TypeScript data file entry
FR18: Allow updating product status without code changes to components
FR19: Allow adding/removing social links via TypeScript data file
FR20: Allow updating profile information via TypeScript data file
FR21: Generate proper Open Graph meta tags for social sharing
FR22: Generate Twitter Card meta tags
FR23: Implement proper SEO meta tags for search engine indexing
FR24: Ensure full screen reader compatibility with ARIA labels
FR25: Implement complete keyboard navigation support
FR26: Meet WCAG 2.1 AAA contrast ratio requirements (7:1)
FR27: Provide visible focus indicators on all interactive elements
FR28: Deploy automatically on push to main branch
FR29: Build and deploy via GitHub Actions workflow
FR30: Host on GitHub Pages with HTTPS

### NonFunctional Requirements

NFR1: First Contentful Paint (FCP) under 1 second
NFR2: Total bundle size under 50KB (excluding images)
NFR3: Lighthouse Performance score of 100
NFR4: All animations at 60fps minimum
NFR5: Time to Interactive (TTI) under 1.5 seconds
NFR6: Cumulative Layout Shift (CLS) of 0
NFR7: WCAG 2.1 AAA compliance (7:1 contrast ratio)
NFR8: Full keyboard-only navigation support
NFR9: prefers-reduced-motion support for all animations
NFR10: Descriptive alt text on all images
NFR11: Logical focus order matching visual layout
NFR12: Lighthouse Accessibility score of 100

### Additional Requirements

**From Architecture:**
- Starter template: `npm create astro@latest -- --template minimal --typescript strict` + `npx astro add tailwind`
- ESLint + Prettier + Husky + lint-staged code quality tooling
- Inline SVG atom components for icons (no icon libraries)
- System font stack only (no font file downloads)
- Astro `<Image />` component for all image optimization
- Atomic Design component boundaries (atoms → molecules → organisms)
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not deprecated @astrojs/tailwind)
- PascalCase component files, camelCase data files, barrel types file
- No `@apply`, no arbitrary Tailwind values, `motion-safe:` on all animations
- Unidirectional data flow: data files → page → organisms → molecules → atoms

**From UX Design:**
- Design Direction 6: Immersive Dark + Bold Gradient
- Color tokens: `#0a0a0f` base surface, `#14141f` elevated, `#6366f1`→`#8b5cf6` accent gradient
- Status badge colors: green (Live), amber (Building, pulse), violet (Coming Soon)
- Typography: system font, name 32px/800 gradient text, tagline 15px/400
- Avatar: 96px circle, gradient border, 40px glow shadow ring
- Social icons: 48x48px, rounded square (14px radius), gradient hover + glow
- Product cards: 20px radius, gradient surface, subtle border, hover lift
- Staggered entrance: avatar→name→tagline (200ms), icons (100ms), cards (150ms on scroll)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for all transitions
- Layout: single column, max-width 480px, centered
- Spacing: 48px hero→social, 80px social→products, 24px between cards
- Intersection Observer trigger for product card entrance
- Skip link for keyboard navigation
- 48px minimum touch targets (exceeds WCAG 44px)
- Light theme: white surfaces, deeper indigo accent for contrast

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Display name |
| FR2 | Epic 2 | Display tagline |
| FR3 | Epic 2 | Display avatar |
| FR4 | Epic 2 | Hero positioning |
| FR5 | Epic 4 | Product cards |
| FR6 | Epic 4 | Status badges |
| FR7 | Epic 4 | Clickable cards |
| FR8 | Epic 4 | Tech stack tags |
| FR9 | Epic 4 | Visual status distinction |
| FR10 | Epic 3 | Social links |
| FR11 | Epic 3 | New tab + security |
| FR12 | Epic 3 | Platform icons |
| FR13 | Epic 1 | Dark mode |
| FR14 | Epic 2 | Entrance animations (continues in E3, E4) |
| FR15 | Epic 3 | Hover feedback (continues in E4) |
| FR16 | Epic 1 | Reduced motion |
| FR17 | Epic 4 | Add products via data |
| FR18 | Epic 4 | Update status via data |
| FR19 | Epic 3 | Add/remove social via data |
| FR20 | Epic 2 | Update profile via data |
| FR21 | Epic 5 | OG meta tags |
| FR22 | Epic 5 | Twitter Cards |
| FR23 | Epic 5 | SEO meta tags |
| FR24 | Epic 3 | Screen reader (cross-cutting) |
| FR25 | Epic 3 | Keyboard nav (cross-cutting) |
| FR26 | Epic 1 | AAA contrast |
| FR27 | Epic 1 | Focus indicators |
| FR28 | Epic 1 | Push-to-deploy |
| FR29 | Epic 1 | GitHub Actions |
| FR30 | Epic 1 | GitHub Pages |

## Epic List

### Epic 1: Project Foundation & Live Deployment
Page is live at newBie974.github.io — dark-themed, accessible, auto-deploys on push. Sets up Astro + Tailwind + TypeScript, dark mode color system, design tokens, MainLayout, GitHub Actions pipeline, accessibility foundation.
**FRs covered:** FR13, FR16, FR26, FR27, FR28, FR29, FR30

### Epic 2: Personal Identity & Brand
Visitors see Aymeric's identity within 1 second — avatar with glow, gradient name, tagline, staggered entrance animation. Creates profile data layer, Avatar atom, HeroIdentity molecule, HeroSection organism.
**FRs covered:** FR1, FR2, FR3, FR4, FR14, FR20

### Epic 3: Social Connection
Sophie discovers social icons and taps to follow — hover glow, keyboard navigable, screen-reader compatible. Creates SVG icon atoms, SocialLink molecule, SocialBar organism with staggered entrance and full a11y.
**FRs covered:** FR10, FR11, FR12, FR15, FR19, FR24, FR25

### Epic 4: Product Showcase
Visitors scroll to discover projects with live status badges — cards animate in, "Building" pulses, creating FOMO. Creates StatusBadge atom, ProductCard molecule, ProductList organism with scroll-triggered entrance.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR17, FR18

### Epic 5: SEO & Social Sharing
Page looks professional when shared on social media — proper OG image, Twitter Card, and search engine visibility. Adds OG meta tags, Twitter Cards, JSON-LD structured data.
**FRs covered:** FR21, FR22, FR23

## Epic 1: Project Foundation & Live Deployment

Page is live at newBie974.github.io — dark-themed, accessible, auto-deploys on push. Sets up Astro + Tailwind + TypeScript, dark mode color system, design tokens, MainLayout, GitHub Actions pipeline, accessibility foundation.

### Story 1.1: Project Initialization

As a **developer**,
I want the Astro project initialized with TypeScript and Tailwind CSS v4,
So that I have a working development environment matching the architecture.

**Acceptance Criteria:**

**Given** a fresh repository
**When** the initialization commands are run
**Then** Astro v5.x is installed with `strict` TypeScript preset
**And** Tailwind CSS v4 is configured via `@tailwindcss/vite` plugin
**And** `src/styles/global.css` imports Tailwind with `@import "tailwindcss"`
**And** `astro.config.mjs` has `output: 'static'` and correct `site` URL
**And** `npm run dev` serves at localhost:4321 without errors
**And** `npm run build` produces static files in `dist/`

### Story 1.2: Code Quality Tooling

As a **developer**,
I want ESLint, Prettier, and pre-commit hooks configured,
So that every commit maintains consistent code quality.

**Acceptance Criteria:**

**Given** the initialized project from Story 1.1
**When** code quality tools are installed
**Then** ESLint is configured for Astro + TypeScript
**And** Prettier formats `.astro`, `.ts`, `.css` files
**And** Husky installs git hooks on `npm install`
**And** lint-staged runs ESLint + Prettier on staged files before commit
**And** a commit with formatting errors is blocked by the pre-commit hook

### Story 1.3: Design Tokens & Dark Mode

As a **visitor**,
I want the page to display in a premium dark theme by default,
So that the experience feels modern and sophisticated.

**Acceptance Criteria:**

**Given** a visitor opens the page
**When** their system preference is dark mode (or no preference)
**Then** the page renders with `#0a0a0f` background and `#f5f5f7` text
**And** all color tokens from UX spec are defined in `tailwind.config.mjs`
**And** contrast ratios meet WCAG AAA (7:1 for normal text) (FR26)
**And** `dark:` variant classes work correctly throughout

**Given** a visitor has light mode system preference
**When** they open the page
**Then** the page renders with white background and dark text
**And** light theme tokens provide equivalent AAA contrast (FR26)

### Story 1.4: Animation System Foundation

As a **visitor**,
I want animations to be smooth and respect my motion preferences,
So that the page feels alive without causing discomfort.

**Acceptance Criteria:**

**Given** the Tailwind config and global CSS
**When** animation system is configured
**Then** `global.css` defines `@keyframes` for fade-in-up, slide-up, and pulse
**And** easing token `cubic-bezier(0.16, 1, 0.3, 1)` is available as a custom property
**And** animation duration tokens (400ms fade, 500ms translate, 200ms scale) are defined
**And** `motion-safe:` variant is required for all animation utility classes

**Given** a visitor with `prefers-reduced-motion: reduce`
**When** the page loads
**Then** all animations are disabled (0ms duration, no transforms) (FR16)
**And** content renders immediately in final position

### Story 1.5: MainLayout & Accessibility Foundation

As a **visitor using assistive technology**,
I want the page to have proper semantic structure and keyboard support,
So that I can navigate and understand the content.

**Acceptance Criteria:**

**Given** the MainLayout component
**When** it renders
**Then** HTML has `lang="en"` attribute
**And** page contains `<header>`, `<main>`, `<footer>` landmarks
**And** a skip link is present (hidden until focused, jumps to main content)
**And** focus-visible ring style (3px solid, accent color, 2px offset) is globally defined (FR27)
**And** system font stack is applied (`system-ui, -apple-system, sans-serif`)
**And** `index.astro` renders inside MainLayout with an empty `<main>` section

### Story 1.6: GitHub Actions Deployment

As a **developer**,
I want the site to deploy automatically when I push to main,
So that content updates go live without manual steps.

**Acceptance Criteria:**

**Given** a push to the `main` branch
**When** GitHub Actions triggers
**Then** the workflow builds the Astro project (FR29)
**And** deploys the `dist/` folder to GitHub Pages (FR30)
**And** the site is accessible at `https://newbie974.github.io` with HTTPS (FR30)
**And** subsequent pushes update the live site automatically (FR28)

## Epic 2: Personal Identity & Brand

Visitors see Aymeric's identity within 1 second — avatar with glow, gradient name, tagline, staggered entrance animation. Creates profile data layer, Avatar atom, HeroIdentity molecule, HeroSection organism.

### Story 2.1: Profile Data Layer & Types

As a **developer (Aymeric)**,
I want profile information stored in a typed data file,
So that I can update my identity without touching components.

**Acceptance Criteria:**

**Given** the `src/types/index.ts` file
**When** the Profile interface is defined
**Then** it includes `name: string`, `tagline: string`, `avatarPath: string`
**And** `src/data/profile.ts` exports a typed `Profile` object with Aymeric's data
**And** TypeScript compilation fails if required fields are missing (FR20)

### Story 2.2: Avatar Atom with Glow Effect

As a **visitor**,
I want to see a professional profile photo with a premium glow,
So that I immediately recognize this as a personal brand page.

**Acceptance Criteria:**

**Given** the Avatar atom component
**When** it renders with a profile image
**Then** the image displays at 96px circle with 2px gradient border (`accent-start` → `accent-end`)
**And** a 40px ambient glow shadow surrounds the avatar (FR3)
**And** Astro `<Image />` is used with proper `alt` text and explicit dimensions (CLS=0)
**And** the image is optimized to WebP/AVIF at build time
**And** `aria-label="Aymeric's profile photo"` is present

### Story 2.3: HeroIdentity Molecule (Name & Tagline)

As a **visitor**,
I want to see a bold name and clear tagline,
So that I understand who this person is within 1 second.

**Acceptance Criteria:**

**Given** the HeroIdentity molecule
**When** it renders with profile data
**Then** the name displays at 32px, weight 800, with gradient text (`#fff` → `#c4b5fd`) (FR1)
**And** letter-spacing is -0.02em on the name
**And** the tagline displays at 15px, weight 400, `--text-secondary` color (FR2)
**And** the name is an `<h1>` element
**And** the tagline is a `<p>` element

### Story 2.4: HeroSection Organism with Entrance Animation

As a **visitor**,
I want the hero section to animate in gracefully on page load,
So that the first impression feels crafted and premium.

**Acceptance Criteria:**

**Given** the HeroSection organism
**When** the page loads
**Then** it renders Avatar + HeroIdentity in a centered column layout
**And** background has a subtle gradient fade (`rgba(99,102,241,0.05)` → transparent) (FR4)
**And** entrance animation staggers: avatar (0ms) → name (200ms) → tagline (400ms) (FR14)
**And** animation uses fade-in-up with `cubic-bezier(0.16, 1, 0.3, 1)` easing
**And** total entrance sequence completes within 600ms

**Given** a visitor with `prefers-reduced-motion: reduce`
**When** the page loads
**Then** all hero elements render immediately without animation
**And** content is fully visible in final position

## Epic 3: Social Connection

Sophie discovers social icons and taps to follow — hover glow, keyboard navigable, screen-reader compatible. Creates SVG icon atoms, SocialLink molecule, SocialBar organism with staggered entrance and full a11y.

### Story 3.1: Social Links Data Layer

As a **developer (Aymeric)**,
I want social links stored in a typed data file,
So that I can add or remove platforms without touching components.

**Acceptance Criteria:**

**Given** the `src/types/index.ts` file
**When** the SocialLink interface is defined
**Then** it includes `platform: string`, `url: string`, `label: string`
**And** `src/data/socialLinks.ts` exports a `SocialLink[]` array with LinkedIn, X, Instagram, TikTok
**And** TypeScript compilation fails if required fields are missing (FR19)

### Story 3.2: SVG Icon Atoms

As a **visitor**,
I want to see recognizable platform icons,
So that I instantly know which social platforms are available.

**Acceptance Criteria:**

**Given** the icon atom components
**When** they render
**Then** `IconLinkedin.astro`, `IconTwitter.astro`, `IconInstagram.astro`, `IconTiktok.astro` exist as inline SVG atoms (FR12)
**And** each SVG is 20px default size, uses `currentColor` for fill
**And** each icon has `aria-hidden="true"` (label provided by parent)

### Story 3.3: SocialLink Molecule with Hover Feedback

As a **visitor (Sophie)**,
I want social icons to glow and lift when I hover,
So that tapping feels inviting and satisfying.

**Acceptance Criteria:**

**Given** the SocialLink molecule
**When** it renders with a SocialLink data entry
**Then** it displays a 48x48px container with 14px border-radius
**And** default state has gradient background (`rgba(99,102,241,0.15)` → `rgba(139,92,246,0.1)`) with 1px border
**And** hover: full gradient fill, scale(1.1), translateY(-2px), 24px glow shadow (FR15)
**And** active: scale(0.95) press feedback
**And** link opens in new tab with `target="_blank" rel="noopener noreferrer"` (FR11)
**And** `aria-label="Follow on {platform}"` is present (FR24)
**And** transition uses 200ms ease timing

### Story 3.4: SocialBar Organism with Staggered Entrance

As a **visitor (Sophie)**,
I want social icons to appear smoothly after the hero,
So that they feel like a natural discovery, not a dump of links.

**Acceptance Criteria:**

**Given** the SocialBar organism
**When** it receives socialLinks data as props
**Then** it renders SocialLink molecules in a horizontal flex layout with 14px gap
**And** section has `<nav aria-label="Social media links">` wrapper (FR24)
**And** entrance animation staggers icons at 100ms intervals, starting after hero (FR10)
**And** spacing is 48px below HeroSection

**Given** a visitor using keyboard
**When** they tab through social icons
**Then** focus moves left-to-right through all icons (FR25)
**And** each icon shows the focus-visible ring (3px solid, accent, 2px offset)
**And** Enter/Space activates the link (FR25)

## Epic 4: Product Showcase

Visitors scroll to discover projects with live status badges — cards animate in, "Building" pulses, creating FOMO. Creates StatusBadge atom, ProductCard molecule, ProductList organism with scroll-triggered entrance.

### Story 4.1: Projects Data Layer

As a **developer (Aymeric)**,
I want projects stored in a typed data file,
So that I can add products and update their status without code changes.

**Acceptance Criteria:**

**Given** the `src/types/index.ts` file
**When** the Project interface is defined
**Then** it includes `title: string`, `tagline: string`, `url: string`, `status: 'live' | 'building' | 'coming-soon'`, `techStack: string[]`
**And** `src/data/projects.ts` exports a `Project[]` array with at least one entry
**And** TypeScript compilation fails if required fields are missing (FR17)
**And** changing `status` value updates the badge without component changes (FR18)

### Story 4.2: StatusBadge Atom

As a **visitor**,
I want to see a clear status indicator on each project,
So that I know which projects are live, in progress, or upcoming.

**Acceptance Criteria:**

**Given** the StatusBadge atom component
**When** it renders with `status="live"`
**Then** it shows a green dot (6px, `#22c55e`) + "Live" text in a pill container (FR6)

**Given** `status="building"`
**When** it renders
**Then** it shows an amber dot (`#f59e0b`) with `pulse` animation (2s infinite) + "Building" text (FR6, FR9)
**And** pulse respects `motion-safe:` (disabled with reduced motion)

**Given** `status="coming-soon"`
**When** it renders
**Then** it shows a violet dot (`#8b5cf6`) at 70% opacity + "Coming Soon" text (FR6, FR9)
**And** `aria-label="Status: {status}"` is present

### Story 4.3: ProductCard Molecule

As a **visitor**,
I want product cards that show project details and respond to interaction,
So that I can learn about projects and click through to explore them.

**Acceptance Criteria:**

**Given** the ProductCard molecule
**When** it renders with Project data
**Then** it displays title (18px/600) + tagline (14px/400) + StatusBadge + tech stack tags (FR5, FR8)
**And** container has 20px border-radius, gradient surface, 1px border (`rgba(99,102,241,0.15)`)
**And** the entire card is a clickable `<a>` linking to the project URL (FR7)
**And** link has `target="_blank" rel="noopener noreferrer"`
**And** `aria-label="{title} - {status}"` is present

**Given** a visitor hovers over the card
**When** hover state activates
**Then** border brightens to 0.4 opacity, translateY(-3px), shadow + glow appear (FR15)
**And** active state: scale(0.98) press feedback
**And** focus state: 3px outline ring

### Story 4.4: ProductList Organism with Scroll-Triggered Entrance

As a **visitor**,
I want product cards to slide in as I scroll down,
So that discovering projects feels rewarding and intentional.

**Acceptance Criteria:**

**Given** the ProductList organism
**When** it receives projects data as props
**Then** it renders ProductCard molecules in a vertical stack with 24px gap
**And** section has `<section aria-label="Projects">` wrapper
**And** spacing is 80px below SocialBar

**Given** the product cards are below the viewport
**When** the visitor scrolls down (intersection threshold: 0.2)
**Then** cards animate in with slide-up (translateY 20px → 0) + fade-in at 150ms stagger (FR14)
**And** once revealed, cards stay visible (no re-hiding on scroll up)

**Given** a visitor with `prefers-reduced-motion: reduce`
**When** cards enter the viewport
**Then** they render immediately without animation

## Epic 5: SEO & Social Sharing

Page looks professional when shared on social media — proper OG image, Twitter Card, and search engine visibility. Adds OG meta tags, Twitter Cards, JSON-LD structured data.

### Story 5.1: Open Graph Meta Tags

As a **visitor sharing the page on social media**,
I want a rich preview to appear with image, title, and description,
So that the shared link looks professional and inviting.

**Acceptance Criteria:**

**Given** the MainLayout component head section
**When** OG meta tags are added
**Then** `og:title` is set to Aymeric's name + tagline
**And** `og:description` provides a concise professional summary
**And** `og:image` points to `/og-image.png` (1200x630px) in `public/`
**And** `og:url` is set to the canonical site URL
**And** `og:type` is set to `website` (FR21)
**And** `og:site_name` is set to the project name

### Story 5.2: Twitter Card Meta Tags

As a **visitor sharing the page on X (Twitter)**,
I want a large image card to appear in the tweet,
So that the link stands out in the feed.

**Acceptance Criteria:**

**Given** the MainLayout component head section
**When** Twitter Card meta tags are added
**Then** `twitter:card` is set to `summary_large_image`
**And** `twitter:title` matches the OG title
**And** `twitter:description` matches the OG description
**And** `twitter:image` points to the same OG image (FR22)
**And** `twitter:creator` is set to Aymeric's X handle

### Story 5.3: SEO & Structured Data

As a **search engine crawler**,
I want proper meta tags and structured data,
So that the page is correctly indexed and discoverable.

**Acceptance Criteria:**

**Given** the MainLayout component head section
**When** SEO meta tags are added
**Then** `<title>` is set to a descriptive page title
**And** `<meta name="description">` provides a concise summary
**And** `<link rel="canonical">` points to the site URL
**And** JSON-LD structured data with `@type: "Person"` is included (name, url, sameAs social links) (FR23)
**And** `<meta name="robots" content="index, follow">` is present
**And** favicon is linked via `<link rel="icon" href="/favicon.svg">`
