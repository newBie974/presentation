---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation-skipped', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-complete']
inputDocuments: ['brainstorming-session-2026-01-23.md']
workflowType: 'prd'
lastStep: 2
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
---

# Product Requirements Document - presentation-github

**Author:** Aymeric
**Date:** 2026-01-23

## Executive Summary

A professional personal landing page replacing Linktree, positioned as a **SaaS + Builder + AI brand headquarters**. Deployed on GitHub Pages (`newBie974.github.io`), this single-page static site serves as the central hub for Aymeric's professional identity — guiding visitors through a clear journey: **Social → Products → Contact**.

The page targets professional contacts from social media, potential collaborators discovering the work, and an audience following the build-in-public journey. It starts minimal with high visual quality, scaling naturally as more products ship.

### What Makes This Special

- **Not a link list — a launch pad.** Product Hunt-style cards with status badges replace flat Linktree buttons. The page guides visitors with intentional visual hierarchy.
- **The code IS the portfolio.** Public repo showcasing Astro + TypeScript + Atomic Design with perfect Lighthouse scores. Developers inspecting the source see exemplary craftsmanship.
- **Visual quality as identity.** Premium animations, micro-interactions, and visual effects that make users want to explore further — not just functional, but memorable.
- **Social-first design.** Polished Open Graph previews ensure the page looks as good when shared as when visited.
- **Grows with the builder.** Origin story phase — the page evolves naturally as more SaaS products launch.

## Project Classification

**Technical Type:** web_app (static site, SSG)
**Domain:** general (personal branding)
**Complexity:** Low
**Project Context:** Greenfield - new project

**Tech Stack:** Astro + TypeScript + Tailwind CSS
**Architecture:** Atomic Design
**Deployment:** GitHub Actions → GitHub Pages (free, public repo)

## Success Criteria

### User Success

- Visitors follow the intended journey: **Social → Products → Contact**
- Users click through to at least one social profile or product link
- The page feels premium — animations and visual effects make users want to explore
- Developers inspecting the repo see exemplary, clean code

### Business Success

- **Personal brand growth:** Recognized as "the AI SaaS builder" through increased social following
- **SaaS funnel:** The page drives referral traffic to product(s)
- **Visibility:** Social followers grow after adding the page link to bios

### Technical Success

- Perfect Lighthouse scores (100/100 performance, accessibility, SEO, best practices)
- Fully responsive (mobile, tablet, desktop)
- Clean TypeScript + Atomic Design codebase worthy of public showcase
- Fast build and deploy via GitHub Actions

### Measurable Outcomes

- Social media follower growth after launch
- Click-through rate on social and product links
- Referral traffic from page to SaaS product
- GitHub repo stars/forks as credibility signal

## Product Scope

### MVP - Minimum Viable Product

- Hero section with name, tagline ("I build AI-powered SaaS"), avatar
- Product card(s) with status badges (Live / Building / Coming Soon)
- Social links section (LinkedIn, Twitter, Instagram, TikTok)
- Responsive design (mobile + desktop)
- Dark mode (system-preference)
- Basic animations and transitions
- Deployed on GitHub Pages
- Open Graph meta tags for social previews

### Growth Features (Post-MVP)

- Polished micro-interactions and surprise visual effects
- Multiple link categories as content grows
- Perfect Lighthouse score optimization
- Contact section / CTA

### Vision (Future)

- Analytics integration (track clicks/visits)
- Dynamic "latest update" section (build in public changelog)
- QR code for conferences/meetups
- Multiple SaaS products showcased
- Custom domain

## User Journeys

### Journey 1: Sophie — The Instagram Scroller

Sophie is a junior developer who just watched one of Aymeric's TikTok videos about building a SaaS with AI. She's intrigued and taps the link in his bio. She lands on a clean, dark-themed page with subtle animations that immediately feel premium. She sees "I build AI-powered SaaS" and thinks "okay, this guy is legit."

She notices a product card with a "Building" badge — it's his SaaS project. She clicks through to learn more. Then she scrolls down and hits the social links — she follows him on Twitter and LinkedIn to keep up with the journey. The whole visit took 20 seconds, but she left with three new follows and a bookmark.

### Journey 2: Thomas — The GitHub Explorer

Thomas is a senior frontend developer looking for Astro project examples. He stumbles onto the `newBie974.github.io` repo through a GitHub search. He opens the code and sees clean TypeScript, Atomic Design structure, Tailwind — everything well-organized. He clicks the live demo link, sees the polished page, and thinks "this is how you build a personal page properly." He stars the repo and shares it in his team's Slack.

### Journey 3: Aymeric — The Builder

Aymeric just launched a new SaaS product. He opens `src/data/projects.ts`, adds a new entry with the product name, tagline, URL, and status "live". He commits, pushes to main, and GitHub Actions deploys automatically. His landing page now showcases the new product — no design work, no config, just a typed data entry.

### Journey Requirements Summary

| Capability | Revealed By |
|-----------|-------------|
| Visual hierarchy (Social → Products → Contact) | Sophie's journey |
| Product cards with status badges | Sophie + Aymeric |
| Premium animations / first impression | Sophie's journey |
| Social links section (prominent, inviting) | Sophie's journey |
| Clean, inspectable codebase | Thomas's journey |
| Easy content updates via typed data files | Aymeric's journey |
| Auto-deploy on push | Aymeric's journey |
| Dark mode / premium aesthetic | Sophie's journey |
| Open Graph previews (social sharing) | Sophie's entry point |

## Web App Specific Requirements

### Project-Type Overview

Single-page static site built with Astro (MPA architecture generating static HTML). No server-side logic, no real-time features, no authentication. Pure presentation layer optimized for performance and visual quality.

### Browser Support Matrix

| Browser | Versions | Priority |
|---------|----------|----------|
| Chrome | Latest 2 | Primary |
| Firefox | Latest 2 | Primary |
| Safari | Latest 2 | Primary (iOS critical) |
| Edge | Latest 2 | Secondary |

No legacy browser support required. Modern CSS features (grid, custom properties, animations) are safe to use.

### Responsive Design

| Breakpoint | Target | Priority |
|-----------|--------|----------|
| Mobile | 320px - 767px | Critical (social media traffic) |
| Tablet | 768px - 1023px | Important |
| Desktop | 1024px+ | Important |

Mobile-first approach — majority of traffic comes from social media link-in-bio clicks (mobile users).

### Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Lighthouse Performance | 100/100 | Code-as-portfolio standard |
| Lighthouse Accessibility | 100/100 | WCAG AAA compliance |
| Lighthouse Best Practices | 100/100 | Exemplary code |
| Lighthouse SEO | 100/100 | Social discoverability |
| First Contentful Paint | < 1s | Instant impression |
| Total Bundle Size | < 50KB | Static site, minimal JS |

### SEO & Social Strategy

- Open Graph meta tags (title, description, image) for rich social previews
- Twitter Card meta tags for Twitter-specific previews
- Semantic HTML5 structure
- Structured data (JSON-LD) for person/profile schema
- Canonical URL
- Sitemap.xml (even for single page — best practice)

### Accessibility Level: WCAG 2.1 AAA

- Enhanced contrast ratios (7:1 for normal text, 4.5:1 for large text)
- All animations respect `prefers-reduced-motion`
- Full keyboard navigation
- Screen reader optimized (ARIA labels, semantic structure)
- Focus indicators visible and clear
- No content relying solely on color to convey meaning

### Implementation Considerations

- **Zero JavaScript by default** — Astro's islands architecture means no JS unless explicitly needed
- **CSS-only animations** where possible — reduces bundle, improves performance
- **Image optimization** — Astro's built-in image optimization for avatar/logos
- **Font strategy** — System fonts or single variable font to minimize load
- **Preconnect hints** — For external link destinations (LinkedIn, GitHub, etc.)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
**Core Problem:** "I need one professional link to put in my social bios that represents my builder identity."
**Resource Requirements:** Solo developer (Aymeric), Astro + Tailwind knowledge

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Sophie's journey (social → explore → follow)
- Aymeric's journey (update data → auto-deploy)

**Must-Have Capabilities:**
- Hero section: name, tagline, avatar
- Product card(s) with status badges
- Social links section (LinkedIn, Twitter, Instagram, TikTok)
- Responsive design (mobile-first)
- Dark mode (system-preference)
- Basic CSS animations/transitions
- Open Graph meta tags
- GitHub Pages deployment via GitHub Actions
- WCAG AAA compliance
- Typed data files for easy content updates

### Post-MVP Features

**Phase 2 (Growth):**
- Polished micro-interactions and visual effects
- Multiple link categories
- Contact section / CTA
- Lighthouse 100/100 optimization pass
- Structured data (JSON-LD)
- Sitemap.xml

**Phase 3 (Expansion):**
- Analytics integration
- "Latest update" changelog section
- QR code generation for meetups
- Multiple SaaS products showcased
- Custom domain setup
- Thomas's journey (repo as code showcase — README, contribution guide)

### Risk Mitigation Strategy

**Technical Risks:** Low — Astro + Tailwind is well-documented, static site has no backend complexity. Mitigation: follow Astro's official GitHub Pages guide.

**Market Risks:** Low — the page is a personal tool, not a product seeking product-market fit. Success = personal utility.

**Resource Risks:** Solo developer. Mitigation: MVP is intentionally small (single page, typed data, no backend). Achievable in a focused sprint.

## Functional Requirements

### Profile Presentation

- FR1: Visitors can see the site owner's name prominently displayed
- FR2: Visitors can read a tagline that communicates the builder identity (SaaS + Builder + AI)
- FR3: Visitors can see a profile avatar/photo
- FR4: Visitors can understand the site owner's professional positioning within 1 second of landing

### Product Showcase

- FR5: Visitors can view product cards displaying project name, tagline, and link
- FR6: Visitors can see a status badge on each product card (Live / Building / Coming Soon)
- FR7: Visitors can click a product card to navigate to the project's URL
- FR8: Visitors can see the tech stack associated with each product
- FR9: Visitors can distinguish between different product statuses visually

### Social Connectivity

- FR10: Visitors can see social media links (LinkedIn, Twitter, Instagram, TikTok)
- FR11: Visitors can click social links to navigate to the corresponding profiles
- FR12: Visitors can identify each social platform via recognizable icons

### Visual Experience

- FR13: Visitors can experience the page in dark mode based on system preference
- FR14: Visitors can see entrance animations when the page loads
- FR15: Visitors can see hover/interaction feedback on clickable elements
- FR16: Visitors with reduced-motion preferences can experience simplified animations

### Content Management

- FR17: Site owner can add a new product by editing a TypeScript data file
- FR18: Site owner can update product status by changing a field value
- FR19: Site owner can add or remove social links by editing a data file
- FR20: Site owner can update profile information (name, tagline, avatar) via data files

### Social Sharing

- FR21: Social platforms can display a rich preview (title, description, image) when the page URL is shared
- FR22: Twitter can display a Twitter Card preview when the page URL is shared
- FR23: Search engines can index the page with proper meta information

### Accessibility

- FR24: Screen reader users can navigate all content with semantic structure
- FR25: Keyboard users can navigate and activate all interactive elements
- FR26: Users with visual impairments can perceive all content with enhanced contrast (AAA)
- FR27: Users can see visible focus indicators on interactive elements

### Deployment & Maintenance

- FR28: Site owner can deploy updates by pushing to the main branch
- FR29: GitHub Actions can automatically build and deploy the site on push
- FR30: The site can be served via GitHub Pages at `newBie974.github.io`

## Non-Functional Requirements

### Performance

- NFR1: First Contentful Paint must be under 1 second on 4G connection
- NFR2: Total page bundle size must not exceed 50KB (excluding images)
- NFR3: Lighthouse Performance score must be 100/100
- NFR4: All CSS animations must run at 60fps (no jank)
- NFR5: Time to Interactive must be under 1.5 seconds
- NFR6: No layout shift during page load (CLS = 0)

### Accessibility

- NFR7: WCAG 2.1 AAA compliance (contrast ratio 7:1 normal text, 4.5:1 large text)
- NFR8: All interactive elements navigable via keyboard alone
- NFR9: All animations respect `prefers-reduced-motion` media query
- NFR10: All images/icons have appropriate alt text or ARIA labels
- NFR11: Focus order follows logical reading sequence
- NFR12: Lighthouse Accessibility score must be 100/100
