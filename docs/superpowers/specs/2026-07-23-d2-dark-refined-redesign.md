# D2 « Sombre Raffiné » — redesign visuel du portfolio

Date : 2026-07-23
Statut : validé (brainstorming avec maquettes navigateur)
Remplace la direction visuelle D1 Swiss Brutalist du spec `2026-05-21-portfolio-design.md`. Ce spec ne remplace **que** la section visuelle — l'IA, les pages, le contenu, le SEO/GEO et les budgets qualité du spec d'origine restent en vigueur.

---

## 1. Contexte et objectif

Le D1 Swiss Brutalist (fluo #ccff00, bordures noires 2px, zéro arrondi) vieillit mal : il fait « tendance 2024 », template, et froid pour un positionnement freelance. Décision validée :

- **Nouvelle direction** : sombre raffiné — quasi-noir aux nuances subtiles, un seul accent désaturé, détails mono. Esthétique dev haut de gamme sans la dureté brutalist.
- **Sombre uniquement** : suppression du mode clair et du ThemeToggle. Une seule ambiance maîtrisée.
- **Accent** : bleu périwinkle `#8ab4ff`.
- **Typo** : continuité — Inter Tight (titres + corps), JetBrains Mono (métadonnées).
- **Scope** : reskin complet + modernisation des composants. Structure des pages et contenus **conservés** (mêmes sections, mêmes routes, même IA).

## 2. Tokens — réécriture de `src/styles/theme.css`

```css
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
  --color-text-faint: #697080; /* métadonnées mono, labels de section */

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

  /* Géométrie — fini le brutalist */
  --radius-base: 10px; /* boutons, badges, petits éléments */
  --radius-card: 14px; /* cartes apps, notes */
  --radius-band: 18px; /* grandes bandes (CollabBand) */
  --border-w: 1px; /* fini le 2px signature D1 */

  /* Conteneurs (inchangés) */
  --container-prose: 65ch;
  --container-content: 900px;
  --container-narrow: 720px;
}
```

Supprimés : le bloc `[data-theme="dark"]`, les tokens `strong-bg/strong-fg`, `inverse-*` (le site entier est sombre, plus besoin de bande inversée), et le fluo `#ccff00` partout.

Sémantique des anciens tokens :

- `strong-*` (pills ink/fluo) → remplacé par badges mono bordés (voir §4).
- `inverse-*` (CollabBand toujours sombre) → la CollabBand devient une carte à halo (voir §4), tokens inutiles.

## 3. Typographie et langage graphique

- **Titres** : Inter Tight 700, tracking `-0.035em`, plus gros qu'en D1 (h1 home ~52px desktop, clamp responsive).
- **Corps** : Inter Tight 400, `--color-text-muted` pour les paragraphes descriptifs.
- **Mono partout où c'est de la métadonnée** : dates, temps de lecture, tech stack, labels de section, prix, badges, logo nav.
- **Labels de section** : mono, uppercase, letter-spacing 0.1em, `--color-text-faint`, préfixe `// ` (ex. `// APPS`, `// NOTES RÉCENTES`). Le composant `SectionLabel.astro` porte ce style.
- **Accent périwinkle** : liens, mot-clé du h1 hero, hover des titres de notes, CTA primaire, focus rings. Jamais en grande surface de fond (uniquement bouton primaire et petites touches).

## 4. Composants — modernisation (validée sur maquette home)

Structure des organisms conservée ; leur peau change :

| Composant                  | Changement                                                                                                                                                                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Nav`                      | Sticky, fond `rgba(12,13,16,0.8)` + `backdrop-filter: blur(12px)`, filet bas `--color-border-soft`. Logo en mono avec points en accent (`aymeric.dijoux.dev`). Lien Collaborer en accent. Suppression du ThemeToggle.                                                                                    |
| `Hero`                     | Badge de disponibilité : pill mono verte avec dot pulsant (glow `--color-success`). H1 avec mot-clé en accent. CTA primaire accent avec glow léger (`box-shadow: 0 0 24px rgba(138,180,255,.25)`) + CTA ghost bordé.                                                                                     |
| `AppsGrid` / `AppCell`     | Cartes : `linear-gradient(180deg, bg-raised, bg-soft)`, bordure 1px `--color-border`, radius 14px, hover → bordure `--color-accent-dim` + `translateY(-2px)`. Pastille logo sur fond teinté translucide. Badge statut mono (`LIVE` vert / `EN COURS` ambre) bordé translucide. Tech stack en mono faint. |
| `NotesSection` / `NoteRow` | Lignes fines séparées par `--color-border-soft`, hover → fond `bg-soft` + titre en accent. Métadonnées mono à droite (`2026-07 · 6 min`).                                                                                                                                                                |
| `CollabBand`               | Carte radius 18px, bordure `--color-accent-dim`, fond `radial-gradient(ellipse at top left, rgba(138,180,255,.08), transparent 55%)` sur `bg-soft`. Prix d'appel en mono accent.                                                                                                                         |
| Boutons (pattern global)   | Primaire : fond accent, texte `on-accent`, radius 10px, glow léger. Ghost : bordure `--color-border`, fond `bg-raised`.                                                                                                                                                                                  |
| `Highlight` (atom)         | Le surligneur fluo n'existe plus. Devient une emphase texte : couleur `--color-accent`, graisse 600, sans fond.                                                                                                                                                                                          |
| `StatusBadge`              | Reprend le pattern badge mono bordé translucide.                                                                                                                                                                                                                                                         |
| `Footer`                   | Filet haut `border-soft`, texte faint, socials en mono avec hover accent.                                                                                                                                                                                                                                |

Les autres organisms (`TagIndex`, `NotesArchive`, `OfferTiers`, `OfferSupport`, `TrustBand`, `LabGrid`, `AppDetail`, `NoteEnd`, `AboutExcerpt`, `SocialBar`) et la prose MDX (`prose.css`, Shiki) adoptent les mêmes tokens/patterns — cartes bordées arrondies, mono pour les métadonnées, accent pour l'interactif. Thème Shiki : passer à un thème sombre (ex. `github-dark-default` ou équivalent) accordé au fond `#0c0d10`.

## 5. Suppressions

- `ThemeToggle.astro` + son script client + la clé i18n associée → moins de JS livré.
- Bloc `[data-theme="dark"]` dans `theme.css` et l'attribut `data-theme` dans `MainLayout`.
- Script anti-FOUC du thème dans le `<head>` s'il existe.
- Toute utilisation de `#ccff00` et des tokens `strong-*` / `inverse-*`.
- `<meta name="theme-color">` et `color-scheme` à mettre à jour (sombre fixe : `color-scheme: dark`).

## 6. Accessibilité, motion, qualité

- **Contraste** : tous les couples validés AA ≥ 4.5:1 sur leurs fonds réels. `scripts/validate-contrast.mjs` à adapter : un seul thème (supprimer la passe « light »), nouveaux couples (accent sur bg, muted/faint sur bg et bg-soft, on-accent sur accent, badges translucides sur leur fond composé). `--color-text-faint` réservé aux métadonnées ≥ AA ; si un couple faint échoue, éclaircir le token, pas d'exception.
- **Focus rings** : `box-shadow: 0 0 0 2px var(--color-accent)` conservé (très visible sur sombre).
- **Motion** : dot pulsant du badge, hovers translateY, transitions — tous neutralisés sous `prefers-reduced-motion: reduce` (règle globale existante conservée).
- **Budgets inchangés** : Lighthouse Perf ≥ 95, A11y = 100, SEO = 100 ; JS home < 30 KB gzip (en baisse avec la suppression du toggle) ; CSS < 25 KB gzip.
- **OG images (Satori)** : régénérer les templates OG aux couleurs D2 (fond `#0c0d10`, accent périwinkle) pour cohérence réseaux sociaux.

## 7. Migration

Une seule PR `feat/d2-dark-refined` (le site est petit, un état intermédiaire mi-clair mi-sombre serait pire) :

1. Réécrire `theme.css` (tokens D2) + adapter `validate-contrast.mjs`.
2. `global.css` / `prose.css` : base sombre, sélection de texte, Shiki sombre.
3. `MainLayout` : suppression thème/toggle, `color-scheme: dark`, `theme-color`.
4. Composants : atoms → molecules → organisms → pages, dans l'ordre du tableau §4.
5. OG images Satori.
6. Vérifs : `astro check`, `npm run build`, `validate:contrast`, axe, Lighthouse.

Critère de fin : plus aucune occurrence de `#ccff00`, `strong-`, `inverse-`, `data-theme` dans `src/`.

## 8. Hors scope

- Changement de structure de pages, de contenu ou d'IA.
- Nouvelle fonte (Inter Tight et JetBrains Mono restent).
- Mode clair (supprimé, pas remplacé).
- Refonte des OG au-delà du changement de couleurs.
