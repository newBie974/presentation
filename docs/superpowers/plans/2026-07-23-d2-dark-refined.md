# D2 « Sombre Raffiné » Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le système visuel D1 Swiss Brutalist par D2 Sombre Raffiné (sombre uniquement, accent périwinkle `#8ab4ff`), en conservant structure des pages, routes et contenus.

**Architecture:** Reskin par les tokens (`theme.css` réécrit d'abord, avec alias de compatibilité temporaires pour les anciens tokens `strong-*`/`inverse-*`), puis modernisation composant par composant (atoms → organisms → pages), puis sweep final qui supprime les alias et vérifie zéro occurrence D1. Chaque tâche laisse le build vert.

**Tech Stack:** Astro 6, Tailwind 4 `@theme`, TypeScript strict, Satori (OG), script Node `validate-contrast.mjs`.

**Spec source:** `docs/superpowers/specs/2026-07-23-d2-dark-refined-redesign.md`

## Global Constraints

- Tokens D2 exacts (spec §2) : bg `#0c0d10`, bg-soft `#131519`, bg-raised `#16181d`, border `#24262c`, border-soft `#1c1e23`, text `#e7e9ec`, muted `#a3a8b1`, accent `#8ab4ff`, on-accent `#0c0d10`, accent-dim `#2b3a56`, success `#7dd3a8`, building `#f5b453`, danger `#ef4444`.
- **Écart au spec (anticipé par le spec §6)** : `--color-text-faint` = `#7d8490` (pas `#697080` qui ne passe pas AA sur `#0c0d10` : 3.9:1 < 4.5). `#7d8490` donne ≥ 4.7:1 sur bg, bg-soft et bg-raised.
- Géométrie : `--border-w: 1px`, `--radius-base: 10px`, `--radius-card: 14px`, `--radius-band: 18px`.
- Interdits en fin de PR dans `src/` : `#ccff00`, `strong-bg`, `strong-fg`, `inverse-bg`, `inverse-fg`, `inverse-muted`, `data-theme`.
- Aucune couleur en dur hors `theme.css` (exception : `ogImage.ts`, rendu Satori hors DOM, garde des hex littéraux).
- Toute transparence via `color-mix(in srgb, var(--token) N%, transparent)` — jamais de `rgba()` en dur.
- Gates par tâche : `npx astro check` (0 erreur/warning), `npm run build` (0 erreur/warning), `npm run validate:contrast`.
- `prefers-reduced-motion` : les règles globales de `global.css` neutralisent déjà animations/transitions — toute nouvelle `animation` doit être une propriété animée par `animation-duration` (pas de JS).
- Conventional commits, une PR `feat/d2-dark-refined` vers `main`, squash & merge.

---

### Task 1: Tokens D2 + gate de contraste

**Files:**

- Modify: `src/styles/theme.css` (réécriture complète)
- Modify: `scripts/validate-contrast.mjs`

**Interfaces:**

- Produces: tokens CSS `--color-bg`, `--color-bg-soft`, `--color-bg-raised`, `--color-border`, `--color-border-soft`, `--color-text`, `--color-text-muted`, `--color-text-faint`, `--color-accent`, `--color-on-accent`, `--color-accent-dim`, `--color-success`, `--color-building`, `--color-danger`, `--radius-base`, `--radius-card`, `--radius-band`, `--border-w`. Alias temporaires : `--color-strong-bg`, `--color-strong-fg`, `--color-inverse-bg`, `--color-inverse-fg`, `--color-inverse-muted` (supprimés en Task 11).

- [ ] **Step 1: Créer la branche**

```bash
git checkout -b feat/d2-dark-refined
```

- [ ] **Step 2: Réécrire `src/styles/theme.css`**

Contenu complet du fichier :

```css
/* D2 Sombre Raffiné — design tokens via Tailwind 4 @theme (dark only) */

@theme {
  /* Surfaces */
  --color-bg: #0c0d10; /* fond de page */
  --color-bg-soft: #131519; /* cartes, hover de lignes */
  --color-bg-raised: #16181d; /* boutons ghost, surfaces sur cartes */

  /* Bordures */
  --color-border: #24262c; /* bordures de cartes/composants */
  --color-border-soft: #1c1e23; /* séparateurs de sections, filets */

  /* Texte */
  --color-text: #e7e9ec;
  --color-text-muted: #a3a8b1;
  --color-text-faint: #7d8490; /* métadonnées mono, labels de section (AA ≥ 4.7:1) */

  /* Accent */
  --color-accent: #8ab4ff; /* liens, CTA, hover titres, focus */
  --color-on-accent: #0c0d10; /* texte sur fond accent */
  --color-accent-dim: #2b3a56; /* bordures actives, hover de cartes */

  /* États */
  --color-success: #7dd3a8; /* badge live, disponibilité */
  --color-building: #f5b453; /* badge en cours */
  --color-danger: #ef4444;

  /* Typo (inchangé) */
  --font-sans: "Inter Tight Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;

  /* Géométrie */
  --radius-base: 10px; /* boutons, badges, petits éléments */
  --radius-card: 14px; /* cartes apps, notes */
  --radius-band: 18px; /* grandes bandes (CollabBand) */
  --border-w: 1px;

  /* Conteneurs (inchangés) */
  --container-prose: 65ch;
  --container-content: 900px;
  --container-narrow: 720px;

  /* TEMP — alias de compat D1→D2, supprimés en fin de migration (Task 11).
     TODO(2026-07-23): retirer une fois strong-*/inverse-* balayés de src/. */
  --color-strong-bg: #16181d;
  --color-strong-fg: #e7e9ec;
  --color-inverse-bg: #131519;
  --color-inverse-fg: #e7e9ec;
  --color-inverse-muted: #a3a8b1;
}
```

Le bloc `[data-theme="dark"]` disparaît entièrement.

- [ ] **Step 3: Adapter `scripts/validate-contrast.mjs` au mode unique**

Remplacer le tableau `CHECKS` (lignes 11–31) par :

```js
// Real foreground/background pairs used in the UI (single dark theme).
const CHECKS = [
  { id: "body text", fg: "color-text", bg: solid("color-bg") },
  { id: "muted on bg", fg: "color-text-muted", bg: solid("color-bg") },
  {
    id: "muted on bg-soft",
    fg: "color-text-muted",
    bg: solid("color-bg-soft"),
  },
  { id: "faint on bg", fg: "color-text-faint", bg: solid("color-bg") },
  {
    id: "faint on bg-soft",
    fg: "color-text-faint",
    bg: solid("color-bg-soft"),
  },
  {
    id: "faint on bg-raised",
    fg: "color-text-faint",
    bg: solid("color-bg-raised"),
  },
  { id: "accent link on bg", fg: "color-accent", bg: solid("color-bg") },
  { id: "primary CTA", fg: "color-on-accent", bg: solid("color-accent") },
  {
    id: "status.live pill",
    fg: "color-success",
    bg: tint("color-success", 14, "color-bg-soft"),
  },
  {
    id: "status.building pill",
    fg: "color-building",
    bg: tint("color-building", 16, "color-bg-soft"),
  },
  {
    id: "accent pill",
    fg: "color-accent",
    bg: tint("color-accent", 10, "color-bg-soft"),
  },
  { id: "danger on bg", fg: "color-danger", bg: solid("color-bg") },
];
```

Remplacer `buildModes` (lignes 52–59) par :

```js
function buildTokens(css) {
  const blocks = parseBlocks(css);
  const key = Object.keys(blocks).find((k) => k.includes("@theme"));
  return blocks[key];
}
```

Remplacer la boucle d'exécution (lignes 104–129) par :

```js
const css = await readFile(THEME_PATH, "utf8");
const tokens = buildTokens(css);
let failed = 0;

for (const check of CHECKS) {
  const { ratio, passed } = evaluate(check, tokens);
  const mark = passed ? "✓" : "✗";
  const line = `${mark} ${check.id.padEnd(24)} ${ratio.toFixed(2)}:1 (min ${AA_NORMAL})`;
  if (passed) console.log(line);
  else {
    console.error(line);
    failed++;
  }
}

if (failed > 0) {
  console.error(
    `\n${failed} contrast issue(s) below WCAG AA — fix the token in ${THEME_PATH}`,
  );
  process.exit(1);
}
console.log(`\n✓ Contrast validation passed (${CHECKS.length} token pairs)`);
```

- [ ] **Step 4: Vérifier que le gate passe**

Run: `npm run validate:contrast`
Expected: 12 lignes `✓`, exit 0. Si `faint` échoue, c'est que `#7d8490` n'a pas été repris — corriger le token.

- [ ] **Step 5: Vérifier le build (les composants D1 tournent sur les alias)**

Run: `npx astro check && npm run build`
Expected: 0 erreur, 0 warning.

- [ ] **Step 6: Commit**

```bash
git add src/styles/theme.css scripts/validate-contrast.mjs
git commit -m "feat(theme): D2 dark refined tokens + single-mode contrast gate"
```

---

### Task 2: Fondation sombre unique — layout, suppression du ThemeToggle, Shiki

**Files:**

- Modify: `src/layouts/MainLayout.astro:40` et `:72-87`
- Delete: `src/components/atoms/ThemeToggle.astro`
- Modify: `src/components/organisms/Nav.astro:3,49` (retrait import + usage ; le reskin complet arrive en Task 4)
- Modify: `src/i18n/ui.ts:12,83` (clé `a11y.toggleTheme` FR + EN)
- Modify: `src/styles/global.css`
- Modify: `astro.config.mjs:115-116` (shikiConfig)

**Interfaces:**

- Consumes: tokens D2 de Task 1.
- Produces: plus aucun `data-theme` dans le layout ; `color-scheme: dark` global.

- [ ] **Step 1: `MainLayout.astro` — retirer le thème dynamique**

Ligne 40, remplacer :

```astro
<html lang={locale === "fr" ? "fr-FR" : "en-US"} data-theme="light"></html>
```

par :

```astro
<html lang={locale === "fr" ? "fr-FR" : "en-US"}></html>
```

Supprimer entièrement le `<script is:inline>` anti-FOUC (lignes 72–87). Ajouter dans le `<head>`, après la ligne `<link rel="icon" href="/favicon.ico" />` :

```astro
<meta name="theme-color" content="#0c0d10" />
```

- [ ] **Step 2: Supprimer l'atom ThemeToggle et son usage**

```bash
rm src/components/atoms/ThemeToggle.astro
```

Dans `src/components/organisms/Nav.astro` : supprimer la ligne 3 (`import ThemeToggle …`) et la ligne 49 (`<ThemeToggle locale={locale} />`).

Dans `src/i18n/ui.ts` : supprimer les deux lignes `"a11y.toggleTheme": …` (FR ligne 12, EN ligne 83).

- [ ] **Step 3: `global.css` — base sombre**

Dans le bloc `html` (lignes 13–15), ajouter `color-scheme: dark;` :

```css
html {
  -webkit-text-size-adjust: 100%;
  color-scheme: dark;
}
```

Ajouter après le bloc `body` :

```css
::selection {
  background: var(--color-accent);
  color: var(--color-on-accent);
}
```

Dans `.skip-link` (lignes 26–38), ajouter `border-radius: var(--radius-base);`.

- [ ] **Step 4: Shiki en thème sombre unique**

Dans `astro.config.mjs`, remplacer :

```js
shikiConfig: {
  themes: { light: "github-light", dark: "github-dark" },
```

par :

```js
shikiConfig: {
  theme: "github-dark-default",
```

(garder le reste du bloc inchangé).

- [ ] **Step 5: Vérifier**

Run: `npx astro check && npm run build && grep -rn "ThemeToggle\|toggleTheme\|data-theme" src/ | grep -v "TEMP" || true`
Expected: check/build 0 erreur ; le grep ne doit plus rien renvoyer **dans MainLayout, Nav, i18n** (les occurrences `data-theme` restantes dans Chapter/now/collaborer/en-work/Highlight sont traitées en Tasks 3 et 9).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(layout): dark-only foundation — drop ThemeToggle, color-scheme dark, single Shiki theme"
```

---

### Task 3: Atoms — Highlight, SectionLabel, StatusBadge

**Files:**

- Modify: `src/components/atoms/Highlight.astro`
- Modify: `src/components/atoms/SectionLabel.astro`
- Modify: `src/components/atoms/StatusBadge.astro`

**Interfaces:**

- Produces: `Highlight` = emphase texte accent (plus de fond). `StatusBadge` = pill mono bordée translucide avec dot pulsant, props inchangées (`label`, `tone?`). `SectionLabel` = label mono faint préfixé `// `, props inchangées (`number?`).

- [ ] **Step 1: `Highlight.astro` — emphase accent sans fond**

Remplacer le bloc `<style>` entier par :

```css
.highlight {
  color: var(--color-accent);
  font-weight: 600;
}
```

(le bloc `:global([data-theme="dark"])` disparaît).

- [ ] **Step 2: `SectionLabel.astro` — label `// ` faint**

Remplacer le bloc `<style>` entier par :

```css
.section-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}
.section-label::before {
  content: "// ";
  color: var(--color-accent);
}
.num {
  opacity: 0.7;
}
```

- [ ] **Step 3: `StatusBadge.astro` — pill avec dot pulsant**

Remplacer le bloc `<style>` entier par :

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 14%, transparent);
  border: var(--border-w) solid
    color-mix(in srgb, var(--color-success) 25%, transparent);
  border-radius: 99px;
  padding: 5px 12px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  display: inline-block;
  animation: pulse 2.4s ease-in-out infinite;
}
.tone-muted {
  color: var(--color-text-muted);
  background: color-mix(in srgb, var(--color-text-muted) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-text-muted) 25%, transparent);
}
.tone-muted .dot {
  background: var(--color-text-muted);
  box-shadow: none;
  animation: none;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
```

(le `prefers-reduced-motion` global de `global.css` fige l'animation — rien à ajouter ici).

- [ ] **Step 4: Vérifier**

Run: `npx astro check && npm run build`
Expected: 0 erreur, 0 warning.

- [ ] **Step 5: Contrôle visuel rapide**

Run: `npm run dev` puis ouvrir `http://localhost:4321` — le hero doit montrer : mots accent périwinkle (plus de surligneur fluo), badge dispo en pill verte translucide au dot pulsant, label `// BUILDER · 2026` en faint.

- [ ] **Step 6: Commit**

```bash
git add src/components/atoms/
git commit -m "feat(atoms): D2 restyle — accent Highlight, // SectionLabel, pill StatusBadge"
```

---

### Task 4: Nav sticky + blur

**Files:**

- Modify: `src/components/organisms/Nav.astro`

- [ ] **Step 1: Marque avec points accent**

Remplacer le markup de la marque (lignes 29–31) par :

```astro
<a href={t.path("home")} class="brand"
  >aymeric<span class="dot-sep">.</span>dijoux<span class="dot-sep">.</span
  >dev</a
>
```

- [ ] **Step 2: Restyle complet**

Remplacer le bloc `<style>` entier par :

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 48px;
  border-bottom: var(--border-w) solid var(--color-border-soft);
  background: color-mix(in srgb, var(--color-bg) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.brand {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  text-decoration: none;
}
.dot-sep {
  color: var(--color-accent);
}
.menu {
  display: flex;
  gap: 26px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 13.5px;
  font-weight: 500;
}
.item {
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 2px 6px;
  border-radius: 6px;
  transition: color 120ms ease;
}
.item:hover {
  color: var(--color-text);
}
.item.active {
  color: var(--color-accent);
}
.end {
  display: flex;
  align-items: center;
  gap: 14px;
}
@media (max-width: 720px) {
  .nav {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 20px;
  }
  .brand {
    flex: 1 1 auto;
  }
  .end {
    flex: 0 0 auto;
    gap: 10px;
    order: 2;
  }
  .menu {
    flex: 1 1 100%;
    order: 3;
    gap: 16px;
    font-size: 12px;
    justify-content: flex-start;
  }
}
@media (max-width: 420px) {
  .menu {
    gap: 12px;
    font-size: 11px;
  }
}
```

Note : `.item.active` passe de « fond accent » à « texte accent » — `aria-current="page"` (déjà présent) reste le marqueur non-visuel.

- [ ] **Step 3: Vérifier**

Run: `npx astro check && npm run build`
Expected: 0 erreur. En dev : nav sticky au scroll, fond flouté, points de la marque en périwinkle.

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/Nav.astro
git commit -m "feat(nav): sticky blurred D2 nav, accent brand dots"
```

---

### Task 5: Hero

**Files:**

- Modify: `src/components/organisms/Hero.astro`

- [ ] **Step 1: Déplacer le StatusBadge au-dessus du h1**

Dans le markup, déplacer `<StatusBadge label={t("status.dispoLabel")} />` (ligne 40) juste **avant** le `<h1>` (après `<SectionLabel>BUILDER · 2026</SectionLabel>`), et supprimer son ancien emplacement après `.ctas`.

- [ ] **Step 2: Restyle complet**

Remplacer le bloc `<style>` entier par :

```css
.hero {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 48px;
  align-items: end;
  padding: 90px 48px 70px;
  border-bottom: var(--border-w) solid var(--color-border-soft);
}
h1 {
  font-size: clamp(36px, 6vw, 52px);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.035em;
  margin: 20px 0 20px;
}
.lead {
  font-size: 17px;
  line-height: 1.6;
  color: var(--color-text-muted);
  max-width: 480px;
  margin: 0 0 32px;
}
.ctas {
  display: flex;
  gap: 14px;
}
.btn {
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition:
    filter 120ms ease,
    background 120ms ease;
}
.primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
  box-shadow: 0 0 24px color-mix(in srgb, var(--color-accent) 25%, transparent);
}
.primary:hover {
  filter: brightness(1.08);
}
.ghost {
  background: var(--color-bg-raised);
  color: var(--color-text);
  border: var(--border-w) solid var(--color-border);
}
.ghost:hover {
  border-color: var(--color-accent-dim);
  color: var(--color-accent);
}
.portrait {
  width: 200px;
  height: 240px;
  border: var(--border-w) solid var(--color-border);
  border-radius: var(--radius-card);
  overflow: hidden;
}
.portrait :global(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media (max-width: 720px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 48px 20px 40px;
  }
  .portrait {
    width: 140px;
    height: 170px;
    order: -1;
  }
}
```

- [ ] **Step 3: Vérifier**

Run: `npx astro check && npm run build`
Expected: 0 erreur. En dev : badge pill au-dessus du titre, mot accent dans le h1 (via Highlight de Task 3), CTA périwinkle avec glow + ghost bordé, portrait arrondi.

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/Hero.astro
git commit -m "feat(hero): D2 hero — status pill on top, glowing accent CTA"
```

---

### Task 6: AppsGrid + AppCell

**Files:**

- Modify: `src/components/organisms/AppsGrid.astro`
- Modify: `src/components/molecules/AppCell.astro`

- [ ] **Step 1: `AppsGrid.astro` — filtres et compteur**

Dans le bloc `<style>`, remplacer les règles `.filters label`, `.filters input:checked + label` et `.count` par :

```css
.filters label {
  padding: 5px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background: var(--color-bg-raised);
  border: var(--border-w) solid var(--color-border);
  border-radius: 99px;
  cursor: pointer;
  transition:
    background 120ms ease,
    color 120ms ease,
    border-color 120ms ease;
}
.filters input:checked + label {
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  color: var(--color-accent);
  border-color: var(--color-accent-dim);
}
.count {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 99px;
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 14%, transparent);
  border: var(--border-w) solid
    color-mix(in srgb, var(--color-success) 25%, transparent);
}
```

Remplacer aussi `border-bottom: var(--border-w) solid var(--color-border);` de `.apps` par `border-bottom: var(--border-w) solid var(--color-border-soft);`.

- [ ] **Step 2: `AppCell.astro` — carte D2**

Dans le bloc `<style>`, remplacer les règles `.cell`, `.cell:hover`, `.logo`, `.name a:hover`, `.tech li`, `.badge`, `.badge:hover`, `.website-link`, `.website-link:hover` par :

```css
.cell {
  display: flex;
  flex-direction: column;
  padding: 22px;
  background: linear-gradient(
    180deg,
    var(--color-bg-raised),
    var(--color-bg-soft)
  );
  border: var(--border-w) solid var(--color-border);
  border-radius: var(--radius-card);
  color: var(--color-text);
  transition:
    transform 120ms ease,
    border-color 120ms ease;
}
.cell:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent-dim);
}
.logo {
  width: 52px;
  height: 52px;
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  border: var(--border-w) solid var(--color-border);
  border-radius: var(--radius-base);
  margin-bottom: 16px;
  overflow: hidden;
}
.name a:hover {
  color: var(--color-accent);
}
.tech li {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-faint);
  padding: 4px 8px;
  background: var(--color-bg);
  border: var(--border-w) solid var(--color-border);
  border-radius: 6px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  background: var(--color-bg-raised);
  color: var(--color-text);
  border: var(--border-w) solid var(--color-border);
  border-radius: var(--radius-base);
  text-decoration: none;
  transition:
    border-color 120ms ease-out,
    color 120ms ease-out;
}
.badge:hover {
  border-color: var(--color-accent-dim);
  color: var(--color-accent);
}
.website-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  border: var(--border-w) solid var(--color-accent);
  border-radius: var(--radius-base);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  text-align: center;
  transition: filter 120ms ease-out;
}
.website-link:hover {
  filter: brightness(1.08);
}
```

Supprimer la règle `.name a:hover` D1 (fond accent + padding négatif) — elle est remplacée ci-dessus. Le `.status` existant (mono + dot) reste tel quel : ses couleurs `success`/`building` sont déjà tokenisées.

- [ ] **Step 3: Vérifier**

Run: `npx astro check && npm run build`
Expected: 0 erreur. En dev : cartes arrondies en dégradé subtil, hover lift + bordure accent-dim, filtres en pills.

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/AppsGrid.astro src/components/molecules/AppCell.astro
git commit -m "feat(apps): D2 app cards — gradient surface, rounded, accent hover"
```

---

### Task 7: Notes — NoteRow + NotesSection

**Files:**

- Modify: `src/components/molecules/NoteRow.astro`
- Modify: `src/components/organisms/NotesSection.astro`

- [ ] **Step 1: `NoteRow.astro` — ligne fine, hover accent**

Remplacer les règles `.note-row`, `.note-row:hover h3`, `.date`, `.meta` du bloc `<style>` par :

```css
.note-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 24px;
  padding: 18px 8px;
  border-top: var(--border-w) solid var(--color-border-soft);
  border-radius: 8px;
  color: var(--color-text);
  text-decoration: none;
  transition: background 150ms ease;
}
.note-row:hover {
  background: var(--color-bg-soft);
}
.note-row:hover h3 {
  color: var(--color-accent);
}
.date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-faint);
  padding-top: 4px;
}
.meta {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-faint);
  display: flex;
  gap: 6px;
}
```

- [ ] **Step 2: `NotesSection.astro` — filets doux**

Dans le bloc `<style>` : remplacer `border-bottom: var(--border-w) solid var(--color-border);` de `.notes` par `var(--color-border-soft)`, et dans `.list :global(.note-row:last-child)` remplacer `var(--color-border)` par `var(--color-border-soft)`. Remplacer `.all` et `.all:hover` par :

```css
.all {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
  text-decoration: none;
}
.all:hover {
  text-decoration: underline;
}
```

- [ ] **Step 3: Vérifier**

Run: `npx astro check && npm run build`
Expected: 0 erreur. En dev : lignes de notes avec hover fond doux + titre périwinkle, métadonnées mono faint.

- [ ] **Step 4: Commit**

```bash
git add src/components/molecules/NoteRow.astro src/components/organisms/NotesSection.astro
git commit -m "feat(notes): D2 note rows — soft dividers, accent hover"
```

---

### Task 8: CollabBand + Footer

**Files:**

- Modify: `src/components/organisms/CollabBand.astro`
- Modify: `src/components/organisms/Footer.astro`

- [ ] **Step 1: `CollabBand.astro` — carte à halo**

Remplacer le bloc `<style>` entier par :

```css
.band {
  margin: 70px 48px;
  padding: 44px 40px;
  text-align: center;
  border: var(--border-w) solid var(--color-accent-dim);
  border-radius: var(--radius-band);
  background:
    radial-gradient(
      ellipse at top left,
      color-mix(in srgb, var(--color-accent) 8%, transparent),
      transparent 55%
    ),
    var(--color-bg-soft);
}
h2 {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 14px;
  color: var(--color-text);
}
p {
  font-size: 15px;
  color: var(--color-text-muted);
  max-width: 460px;
  margin: 0 auto 24px;
  line-height: 1.6;
}
.cta {
  display: inline-block;
  padding: 12px 22px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 700;
  font-size: 13px;
  border-radius: var(--radius-base);
  box-shadow: 0 0 24px color-mix(in srgb, var(--color-accent) 25%, transparent);
  text-decoration: none;
  transition: filter 120ms ease;
}
.cta:hover {
  filter: brightness(1.08);
}
@media (max-width: 720px) {
  .band {
    margin: 40px 20px;
  }
}
```

(les hex `#0a0a0a`/`#f6f6f4` et le bloc `[data-theme="dark"]` disparaissent).

- [ ] **Step 2: `Footer.astro` — hover accent**

Dans le bloc `<style>` : dans `.footer`, ajouter `border-top: var(--border-w) solid var(--color-border-soft);` et remplacer `color: var(--color-text-muted);` par `color: var(--color-text-faint);`. Remplacer `.links a:hover` par :

```css
.links a:hover {
  color: var(--color-accent);
}
```

- [ ] **Step 3: Vérifier**

Run: `npx astro check && npm run build`
Expected: 0 erreur. En dev : bande collaborer = carte arrondie à halo périwinkle, footer avec liens hover accent.

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/CollabBand.astro src/components/organisms/Footer.astro
git commit -m "feat(bands): D2 CollabBand halo card + footer accent hovers"
```

---

### Task 9: Sweep des tokens D1 restants (long tail)

**Files:**

- Modify: `src/components/molecules/NoteHighlight.astro:87-88`
- Modify: `src/components/molecules/Pagination.astro:63-64`
- Modify: `src/components/prose/Callout.astro:31-32`
- Modify: `src/components/organisms/TagIndex.astro:85-92`
- Modify: `src/components/organisms/NotesArchive.astro:123-125`
- Modify: `src/components/organisms/AppDetail.astro:195-197`
- Modify: `src/components/molecules/Chapter.astro:109-…` (bloc dark)
- Modify: `src/components/molecules/CalEmbed.astro:14`
- Modify: `src/pages/now.astro:249-…`, `src/pages/en/now.astro:244-…` (blocs dark)
- Modify: `src/pages/collaborer.astro:209-241`, `src/pages/en/work.astro:209-241`

Trois substitutions mécaniques (mêmes numéros de ligne qu'au moment de l'écriture du plan — re-`grep` avant d'éditer) :

**Motif 1 — pill « strong » (NoteHighlight, Pagination, Callout, TagIndex, NotesArchive).** Remplacer chaque paire :

```css
background: var(--color-strong-bg);
color: var(--color-strong-fg);
```

par :

```css
background: color-mix(in srgb, var(--color-accent) 10%, transparent);
color: var(--color-accent);
border-radius: var(--radius-base);
```

Cas particuliers : `TagIndex.astro:92` (`color: var(--color-strong-fg);` seul) → `color: var(--color-accent);`. `NotesArchive.astro:125` (`border-color: var(--color-strong-bg);`) → `border-color: var(--color-accent-dim);`.

**Motif 2 — blocs « inverse » (AppDetail:195-197, collaborer:209+, en/work:209+).** Remplacer :

```css
background: var(--color-inverse-bg);
color: var(--color-inverse-fg);
```

par :

```css
background: var(--color-bg-soft);
color: var(--color-text);
border-radius: var(--radius-band);
```

et toute occurrence isolée de `var(--color-inverse-fg)` → `var(--color-text)`, `var(--color-inverse-muted)` → `var(--color-text-muted)`, `border: var(--border-w) solid var(--color-inverse-bg)` → `border: var(--border-w) solid var(--color-border)`.

**Motif 3 — blocs `[data-theme="dark"]` (Chapter:109, now:249, en/now:244, collaborer:214, en/work:214).** Supprimer chaque bloc `:global([data-theme="dark"]) … { … }` en entier (le site est toujours sombre : la règle de base doit déjà utiliser des tokens ; si la règle de base utilisait une valeur claire en dur, la remplacer par le token équivalent du bloc dark supprimé).

**CalEmbed.astro:14** : `brandColor = "#ccff00"` → `brandColor = "#8ab4ff"`.

- [ ] **Step 1: Appliquer les 3 motifs + CalEmbed** (fichier par fichier, en re-vérifiant chaque contexte)

- [ ] **Step 2: Vérifier qu'il ne reste rien**

Run: `grep -rn "strong-bg\|strong-fg\|inverse-bg\|inverse-fg\|inverse-muted\|data-theme\|ccff00" src/ | grep -v "styles/theme.css"`
Expected: aucune sortie (les alias TEMP de `theme.css` sont le seul reliquat, traité en Task 11).

- [ ] **Step 3: Vérifier le build**

Run: `npx astro check && npm run build`
Expected: 0 erreur, 0 warning.

- [ ] **Step 4: Contrôle visuel des pages balayées**

En dev, vérifier `/notes`, `/notes/tags/ia`, `/collaborer`, `/now`, `/apps/<slug>`, `/en/work` : aucune zone claire résiduelle, aucune pill illisible.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(styles): sweep D1 strong/inverse/data-theme tokens to D2 patterns"
```

---

### Task 10: OG images Satori

**Files:**

- Modify: `src/lib/ogImage.ts:36,43` (+ toute autre couleur D1 dans le fichier)

- [ ] **Step 1: Palette D2 dans le template Satori**

Ligne 36, remplacer les valeurs de style :

- `background:#f6f6f4` → `background:#0c0d10`
- `border:8px solid #0a0a0a` → `border:8px solid #24262c`
- `color:#0a0a0a` → `color:#e7e9ec`

Ligne 43 (badge) : `background:#ccff00;color:#0a0a0a` → `background:#8ab4ff;color:#0c0d10`.

Balayer le reste du fichier : toute autre occurrence de `#0a0a0a`/`#f6f6f4`/gris D1 passe aux équivalents D2 (`#e7e9ec` texte, `#a3a8b1` texte secondaire, `#24262c` filets). Les hex littéraux sont acceptés ici (rendu Satori hors DOM — pas d'accès aux CSS vars).

- [ ] **Step 2: Régénérer et inspecter**

Run: `npm run build`
Expected: 0 erreur. Ouvrir `dist/og/default.png` (et un `dist/og/notes/…png`) : fond `#0c0d10`, texte clair, badge périwinkle.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ogImage.ts
git commit -m "feat(og): D2 dark palette for Satori OG images"
```

---

### Task 11: Retrait des alias, docs, gates finaux

**Files:**

- Modify: `src/styles/theme.css` (suppression du bloc TEMP)
- Modify: `CLAUDE.md` (règles couleur D1 → D2)

- [ ] **Step 1: Supprimer les alias TEMP de `theme.css`**

Supprimer le bloc commenté `TEMP — alias de compat D1→D2` (les 5 tokens `strong-*`/`inverse-*`).

- [ ] **Step 2: Gate zéro-occurrence D1**

Run: `grep -rn "ccff00\|strong-bg\|strong-fg\|inverse-bg\|inverse-fg\|inverse-muted\|data-theme" src/`
Expected: aucune sortie. Sinon, corriger l'occurrence avant de continuer.

- [ ] **Step 3: Mettre à jour `CLAUDE.md`**

Dans la section « 6. Pas de couleurs ni de tailles en dur » : remplacer la « Règle critique GEO/A11y » sur `#ccff00` par :

```markdown
**Règle critique GEO/A11y** : le site est sombre uniquement (D2). `--color-accent` (#8ab4ff) sert en texte sur fonds sombres ET en background de CTA avec texte `--color-on-accent`. Tout nouveau couple fg/bg doit être ajouté aux `CHECKS` de `scripts/validate-contrast.mjs`.
```

Dans « Pièges à éviter » : supprimer le paragraphe « Le surligneur fluo (#ccff00)… ». Dans la table des tests (niveau 5), remplacer « en clair + sombre » par « sur le thème sombre unique ». Référencer le spec D2 : dans l'en-tête, après la ligne « Spec de design source », ajouter « Système visuel : `docs/superpowers/specs/2026-07-23-d2-dark-refined-redesign.md` (D2 remplace D1). »

- [ ] **Step 4: Gates finaux**

Run: `npx astro check && npm run build && npm run validate:contrast && npx prettier --check . && npx eslint .`
Expected: tout passe, 0 erreur, 0 warning.

- [ ] **Step 5: Vérification a11y locale (si Playwright installé)**

Run: `npm run test:a11y` (ou la commande axe du repo — vérifier dans `package.json`)
Expected: 0 violation. Si le script n'existe pas en local, noter dans la PR que la CI fera foi.

- [ ] **Step 6: Commit + PR**

```bash
git add -A
git commit -m "chore(theme): drop D1 compat aliases, update color rules in CLAUDE.md"
git push -u origin feat/d2-dark-refined
gh pr create --title "feat(design): D2 dark refined — full visual redesign" --body "$(cat <<'EOF'
## Résumé
- Remplace le système visuel D1 Swiss Brutalist par D2 Sombre Raffiné (spec docs/superpowers/specs/2026-07-23-d2-dark-refined-redesign.md)
- Sombre uniquement : suppression du ThemeToggle et du mode clair
- Accent périwinkle #8ab4ff, radius 10/14/18, bordures 1px
- validate-contrast.mjs adapté au thème unique, OG images régénérées

## Test plan
- [ ] CI verte (build, lint, lighthouse, axe, jsonld, contrast)
- [ ] Revue visuelle des routes critiques FR/EN

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Notes d'exécution

- Les composants non listés (TrustBand, OfferTiers, OfferSupport, LabGrid, SocialBar, AboutExcerpt, NoteEnd, TagIndex hors pills, prose.css) n'utilisent que des tokens conservés : ils basculent automatiquement avec `theme.css`. Si un rendu résiduel « clair » apparaît en contrôle visuel, c'est une couleur en dur à traiter comme le Motif 3 de la Task 9.
- Les numéros de ligne datent de l'écriture du plan — toujours re-`grep` le motif avant d'éditer.
- Budget JS : la suppression du ThemeToggle retire du JS ; n'en ajouter nulle part.
