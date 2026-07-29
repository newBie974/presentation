# Agentic AI Engineer Transformation Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write and publish a bilingual (FR/EN) article explaining the 5 architectural patterns that transform a prompt engineer into an agentic AI engineer, grounded in personal experience.

**Architecture:**

- Write the French version first (intro + context + 5 patterns + medium-roadmap link + conclusion).
- Translate to English while preserving tone and personal voice.
- Create two MDX files (`src/content/notes/fr/...mdx` and `src/content/notes/en/...mdx`) with matching `translationKey`.
- Validate typings, links, and contrast before commit.

**Tech Stack:**

- MDX (Astro Content Collections)
- TypeScript (astro check)
- Git (conventional commits)
- Tailwind (theme tokens only, no hardcoded colors)

---

## Global Constraints

- **Word count (FR):** 2500–3000 words
- **Wordcount (EN):** Similar, allow ±10% for natural translation
- **Tone:** Personal, first-person, reflective ("I realized...", "The moment when...")
- **Code samples:** Zero. No code blocks, no syntax highlighting.
- **Project names:** Never name Decider or specific clients. Keep vague ("when building...", "in one project...").
- **Tags:** Must include `ia`, `claude`, `process`, `build`
- **Translation key:** `2026-07-agentic-transformation` (identical in both files)
- **Links:** Internal only (no external URLs except implied Medium reference, not linked)
- **Contrast:** All copy must pass WCAG AA on dark theme (theme.css tokens only)
- **No hardcoded colors:** All styling via `theme.css` tokens (already verified in design spec)

---

## File Structure

**Files to create:**

1. `src/content/notes/fr/2026-07-agentic-transformation.mdx` — French article (primary language)
2. `src/content/notes/en/2026-07-agentic-transformation.mdx` — English translation (mirror)

**Files to validate:**

- `src/styles/theme.css` — Ensure all tokens used are available (read-only, already set up)
- `src/i18n/ui.ts` — No new UI strings needed (article is self-contained)

**No files to modify beyond the two article files.**

---

## Task Breakdown

### Task 1: Write French Article – Frontmatter & Intro

**Files:**

- Create: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (start)

**Interfaces:**

- Produces: Complete MDX file frontmatter + intro section (~250 words)

**Frontmatter spec:**

```yaml
---
title: "De prompt engineer à agentic AI engineer — les 5 patterns qui m'ont transformé"
date: 2026-07-29
locale: fr
translationKey: "2026-07-agentic-transformation"
tags: ["ia", "claude", "process", "build"]
excerpt: "On dit qu'il faut apprendre 14 étapes pour devenir un agentic AI engineer. Spoiler: les vraies transformations tiennent en 5 patterns architecturaux. Voici comment j'ai compris qu'il ne s'agissait plus de parler au modèle, mais de construire un système qui décide."
draft: false
---
```

- [ ] **Step 1: Create the file with frontmatter**

Create `src/content/notes/fr/2026-07-agentic-transformation.mdx` with the YAML frontmatter above (copy exactly).

- [ ] **Step 2: Write the intro section (~250 words)**

Opening line (non-negotiable):

> "Un prompt engineer parle au modèle. Un agentic AI engineer construit un système que le modèle orchestre."

Structure:

1. Restate the opening (1 sentence)
2. Personal context: "I realized this difference is real, not just semantic" (2-3 sentences)
3. Bridge: "People talk about the '14-step roadmap' to become an agentic AI engineer. But the real transformation fits into 5 architectural patterns." (2-3 sentences)
4. Teaser: "These 5 patterns are what separate theory from shipping real systems." (1-2 sentences)

Tone: Conversational, first-person, no jargon. Use "J'ai réalisé que...", "Ce moment où...".

- [ ] **Step 3: Commit intro section**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): wip agentic-transformation article — intro + frontmatter"
```

---

### Task 2: Write Section 1 – Why 14 Steps Aren't Enough

**Files:**

- Modify: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed intro section
- Produces: Section 1 (~300 words)

- [ ] **Step 1: Write Section 1 (~300 words)**

Structure:

1. Hook: "Il y a une roadmap célèbre qui énumère 14 étapes pour devenir agentic AI engineer..." (1 sentence)
2. The problem: The roadmap teaches _what_ (LangGraph, tools, RAG, evaluation) but not _why_. It's linear. (2-3 sentences)
3. The insight: Real transformation happens when you move from "learning tools" to "architecting systems." (1-2 sentences)
4. Bridge: "The real 5 patterns of becoming an agentic AI engineer are the architectural levers that make steps 8-13 of the roadmap possible." (1-2 sentences)

Tone: Reflective, not dismissive. Complement the Medium guide, don't contradict it.

- [ ] **Step 2: Commit Section 1**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — section 1 (why 14 steps aren't enough)"
```

---

### Task 3: Write Pattern 1 – Data-Driven Configuration

**Files:**

- Modify: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed sections 0–1
- Produces: Pattern 1 section (~400 words)

- [ ] **Step 1: Write Pattern 1 (~400 words)**

Structure:

```
## Pattern 1: Data-Driven Configuration (The Foundation)

[Definition: 1-2 sentences]
Your agent is not defined in code. It's defined in structured data (YAML, files, config).
The system reads this data at runtime, not at build time.

[The problem it solves: Before/After]
Before: Change an agent's persona → edit code → redeploy → restart.
After: Change a YAML file → system picks it up next turn → zero downtime.

[Concrete realization (vague): 2-3 sentences]
J'ai réalisé que mes agents ne devaient pas avoir de code dur. Tout devrait être une donnée...

[Mindset shift: 1-2 sentences with callout]
Use <Callout type="note"> wrapper for emphasis.
"Avant, je pensais 'code is the source of truth'. Maintenant, c'est 'data is the source of truth...'"
```

Use `<Callout type="note">` for the mindset shift (see Astro prose components).

- [ ] **Step 2: Commit Pattern 1**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — pattern 1 (data-driven configuration)"
```

---

### Task 4: Write Pattern 2 – LIVE Orchestration via Middleware

**Files:**

- Modify: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed patterns 0–1
- Produces: Pattern 2 section (~400 words)

- [ ] **Step 1: Write Pattern 2 (~400 words)**

Structure (same as Pattern 1):

```
## Pattern 2: LIVE Orchestration via Middleware (The Heart)

[Definition]
Configuration changes (personas, skills, tools, models) are injected dynamically
every turn, not built once and frozen.

[The problem it solves]
Enables rapid iteration without redeploy. Allows an agent to adapt per-request.

[Concrete realization]
"Le vrai défi n'était pas le modèle. C'était l'orchestration — décider quoi injecter, quand, comment."

[Mindset shift]
"Je pensais que le modèle décidait tout. En vrai, c'est le middleware qui décide..."
Use <Callout type="note"> for emphasis.
```

Tone: Reflective. "The real challenge wasn't..." — personal insight.

- [ ] **Step 2: Commit Pattern 2**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — pattern 2 (live orchestration)"
```

---

### Task 5: Write Pattern 3 – Dynamic Subagent Discovery

**Files:**

- Modify: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed patterns 0–2
- Produces: Pattern 3 section (~400 words)

- [ ] **Step 1: Write Pattern 3 (~400 words)**

Structure:

```
## Pattern 3: Dynamic Subagent Discovery (Scalability)

[Definition]
New subagents are discovered and registered at runtime by scanning a directory.
No code change, no restart.

[The problem it solves]
Scaling the agent roster without editing code. Enables modular architecture.

[Concrete realization]
"À un moment, j'ai réalisé que créer un nouveau subagent ne devrait pas être une décision
d'architecture. Ça devrait être aussi simple que créer un dossier."

[Mindset shift]
"Avant, les agents étaient des singletons hardcodés. Maintenant, c'est une roster
découverte dynamiquement..."
Use <Callout type="note">.
```

- [ ] **Step 2: Commit Pattern 3**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — pattern 3 (dynamic discovery)"
```

---

### Task 6: Write Pattern 4 – Per-Call Context Injection

**Files:**

- Modify: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed patterns 0–3
- Produces: Pattern 4 section (~400 words)

- [ ] **Step 1: Write Pattern 4 (~400 words)**

Structure:

```
## Pattern 4: Per-Call Context Injection (Security & Isolation)

[Definition]
The agent has no global state. Every context (user, scope, collection, permissions)
is injected into the tools for that specific call.

[The problem it solves]
Multi-tenant safety, concurrent request safety, authorization as first-class concern.

[Concrete realization]
"Le moment clé: je me suis rendu compte que les agents ne doivent pas 'connaître'
qui les utilise... Ça doit être injecté dans chaque appel."

[Mindset shift]
"Avant, je pensais state management. Maintenant, c'est: 'nothing is stored,
everything is injected'."
Use <Callout type="note">.
```

- [ ] **Step 2: Commit Pattern 4**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — pattern 4 (per-call context)"
```

---

### Task 7: Write Pattern 5 – Graceful Degradation & Hot Reload

**Files:**

- Modify: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed patterns 0–4
- Produces: Pattern 5 section (~400 words)

- [ ] **Step 1: Write Pattern 5 (~400 words)**

Structure:

```
## Pattern 5: Graceful Degradation & Hot Reload (Resilience)

[Definition]
The system continues working even when config is being edited (malformed YAML,
incomplete files). It degrades gracefully.

[The problem it solves]
Live iteration without crashes. Editing agents while they're running.

[Concrete realization]
"Je construisais un système où des gens éditent les agents en live.
La première question: comment ça ne crash pas?"

[Mindset shift]
"Avant, un erreur de config = system down. Maintenant, c'est: 'keep running,
log the issue, use the last good version'."
Use <Callout type="note">.
```

- [ ] **Step 2: Commit Pattern 5**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — pattern 5 (graceful degradation)"
```

---

### Task 8: Write Section – Link to Medium Roadmap & Conclusion

**Files:**

- Modify: `src/content/notes/fr/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed patterns 1–5
- Produces: Roadmap-link section (~400 words) + Conclusion (~300 words)

- [ ] **Step 1: Write Roadmap-Link Section (~400 words)**

Structure:

```
## Linking the 5 Patterns to the 14-Step Roadmap

[The mapping: Which patterns address which steps]
- Steps 1-3 (Mental Model) → Understand what an agentic AI engineer builds.
- Steps 4-8 (Building Blocks) → Learn technical foundations.
- Steps 9-13 (Build It Right) → Here's where the 5 patterns matter most.

[Specific connections]
Step 10 (State file) + Step 12 (Evaluation) → Pattern #5 (Graceful Degradation).
Step 11 (Maker-checker split) → Pattern #4 (Per-Call Context Injection).
Step 8 (LangGraph orchestration) → Pattern #1 + #2 (Data-Driven Config + LIVE Orchestration).

[The insight]
"Le roadmap te dit *quoi* apprendre. Les 5 patterns, c'est le *pourquoi* de l'architecture.
L'un sans l'autre, tu vas apprendre la théorie mais ne pas savoir comment le tout tient ensemble."
```

- [ ] **Step 2: Write Conclusion (~300 words)**

Structure:

```
## Conclusion

[Recap]
"Voici ce qui différencie un prompt engineer d'un agentic AI engineer:"
1. Configuration data > hardcoded behavior.
2. Orchestration via middleware > dumb LLM call.
3. Dynamic discovery > static roster.
4. Context injection > global state.
5. Graceful degradation > crash on error.

[The shift (mindset)]
"Ce n'est plus 'comment je parle au modèle?'. C'est 'comment je construis un système
où le modèle décide, orchestré correctement, sans état global, résilient'."

[Call-to-action (subtle)]
"Si tu veux explorer comment ça marche concrètement, j'accompagne les indie builders
qui construisent des agents IA. [Link to `/collaborer`]"

Use `localizePath("work")` or equivalent i18n link for `/collaborer` reference.
```

- [ ] **Step 3: Verify article is complete in FR**

Read the entire file top-to-bottom. Check:

- Frontmatter is valid YAML.
- All sections flow naturally.
- Tone is consistent (personal, reflective).
- No code samples.
- No hardcoded colors or sizes.
- Links use `localizePath` or proper MDX syntax.

- [ ] **Step 4: Commit Roadmap + Conclusion**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — roadmap link + conclusion (FR complete)"
```

---

### Task 9: Translate to English – Frontmatter & Intro + Section 1

**Files:**

- Create: `src/content/notes/en/2026-07-agentic-transformation.mdx` (start)

**Interfaces:**

- Consumes: Completed FR article (reference only)
- Produces: EN article frontmatter + intro + section 1 (~550 words)

**Translation notes:**

- Preserve tone: personal, reflective, English idioms.
- `translationKey` must match FR exactly: `2026-07-agentic-transformation`
- `locale: en`
- All other frontmatter fields mirror FR (tags, date, etc.)

- [ ] **Step 1: Create EN file with translated frontmatter**

```yaml
---
title: "From Prompt Engineer to Agentic AI Engineer — The 5 Patterns That Changed Everything"
date: 2026-07-29
locale: en
translationKey: "2026-07-agentic-transformation"
tags: ["ia", "claude", "process", "build"]
excerpt: "They say you need 14 steps to become an agentic AI engineer. Spoiler: the real transformation fits into 5 architectural patterns. Here's how I realized it's not about talking to the model—it's about building a system that decides."
draft: false
---
```

- [ ] **Step 2: Translate intro (~250 words)**

English opening (must match spirit, not word-for-word):

> "A prompt engineer talks to a model. An agentic AI engineer builds a system that the model orchestrates."

Preserve structure and tone from FR version. Use natural English idioms.

- [ ] **Step 3: Translate Section 1 (~300 words)**

Same structure as FR. Preserve the insight: "The roadmap tells you _what_ to learn. Patterns tell you _why_ the architecture matters."

- [ ] **Step 4: Commit EN intro + section 1**

```bash
git add src/content/notes/en/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — intro + section 1 (EN)"
```

---

### Task 10: Translate to English – All 5 Patterns

**Files:**

- Modify: `src/content/notes/en/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed EN intro + section 1
- Produces: EN patterns 1–5 (~2000 words)

- [ ] **Step 1: Translate Pattern 1 (~400 words)**

Preserve structure and tone. "Before/After" stays clear. Mindset shift uses `<Callout type="note">`.

- [ ] **Step 2: Translate Pattern 2 (~400 words)**

Same structure. Key phrase: "The real challenge wasn't the model. It was orchestration..."

- [ ] **Step 3: Translate Pattern 3 (~400 words)**

"Creating a new subagent shouldn't be an architecture decision. It should be as simple as creating a folder."

- [ ] **Step 4: Translate Pattern 4 (~400 words)**

"Agents shouldn't _know_ who's using them or what context. That must be injected per call."

- [ ] **Step 5: Translate Pattern 5 (~400 words)**

"I was building a system where people edit agents live. First question: how does it not crash?"

- [ ] **Step 6: Commit all 5 EN patterns**

```bash
git add src/content/notes/en/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — patterns 1–5 (EN)"
```

---

### Task 11: Translate to English – Roadmap Link & Conclusion

**Files:**

- Modify: `src/content/notes/en/2026-07-agentic-transformation.mdx` (append)

**Interfaces:**

- Consumes: Completed EN patterns 1–5
- Produces: EN roadmap-link + conclusion (~700 words)

- [ ] **Step 1: Translate Roadmap-Link Section (~400 words)**

Same structure as FR. Preserve the insight that patterns and roadmap complement each other.

- [ ] **Step 2: Translate Conclusion (~300 words)**

Preserve the 5-point recap and the final mindset shift. Translate CTA to `/collaborer` using `localizePath("work")`.

- [ ] **Step 3: Verify EN article is complete**

Read top-to-bottom. Check:

- Frontmatter valid.
- `translationKey` matches FR exactly.
- Tone is natural English (not translated-sounding).
- All 5 patterns translated.
- Links use `localizePath`.
- No hardcoded colors.

- [ ] **Step 4: Commit EN roadmap + conclusion**

```bash
git add src/content/notes/en/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): agentic-transformation — roadmap link + conclusion (EN complete)"
```

---

### Task 12: Validate & Finalize

**Files:**

- Reference: `src/content/notes/fr/2026-07-agentic-transformation.mdx`
- Reference: `src/content/notes/en/2026-07-agentic-transformation.mdx`
- Read: `src/styles/theme.css`

**Interfaces:**

- Consumes: Both complete articles (FR + EN)
- Produces: Validated, ready-to-merge articles

- [ ] **Step 1: Run astro check**

```bash
npm run astro -- check
```

Expected: 0 errors, 0 warnings on both `.mdx` files.

If errors, fix them:

- Missing imports (e.g., `Callout` not imported)?
- TypeScript type mismatch in frontmatter?
- Invalid MDX syntax?

Re-run until pass.

- [ ] **Step 2: Verify frontmatter matches spec**

Check both files:

- `translationKey` is identical: `2026-07-agentic-transformation`
- `date` is identical: `2026-07-29`
- `tags` are identical: `["ia", "claude", "process", "build"]`
- `locale` is correct: `fr` vs `en`
- `draft: false` in both

- [ ] **Step 3: Verify no hardcoded colors**

Search each file for color hex codes, RGB, or color names (e.g., `#fff`, `red`, `blue`).

Expected: Zero matches (all styling via theme.css or Tailwind classes that reference `@theme`).

- [ ] **Step 4: Verify links use i18n**

Search for `/collaborer` or internal links. They should use:

- `localizePath("/collaborer", locale)` or similar i18n helper, OR
- Relative paths that work in both FR and EN.

Check that the link resolves correctly for both locales (FR: `/collaborer`, EN: `/en/work`).

- [ ] **Step 5: Verify contrast**

Manual spot-check: Copy a paragraph into your editor and render it. Does it read clearly on dark background with light text?

Expected: Yes (theme tokens are already WCAG AA compliant).

- [ ] **Step 6: Final spell-check & flow (FR + EN)**

Read through once more:

- No typos.
- Tone consistent.
- Sections flow naturally.
- Intro sets up conclusion.
- No dangling references.

- [ ] **Step 7: Commit validation pass**

```bash
git add src/content/notes/fr/2026-07-agentic-transformation.mdx src/content/notes/en/2026-07-agentic-transformation.mdx
git commit -m "feat(notes): publish agentic-transformation article (FR + EN, validated)"
```

- [ ] **Step 8: Verify npm run build passes**

```bash
npm run build
```

Expected: No errors, warnings on article files. Static site builds successfully.

If build fails, check error messages. Fix and re-run.

Once pass:

```bash
git log --oneline -5
```

Verify your commits are there.

---

## Success Criteria Checklist

- [ ] `src/content/notes/fr/2026-07-agentic-transformation.mdx` exists and is 2500–3000 words.
- [ ] `src/content/notes/en/2026-07-agentic-transformation.mdx` exists, is similar length, natural English tone.
- [ ] Both files have identical `translationKey: "2026-07-agentic-transformation"`.
- [ ] Both files have `draft: false` and correct `date: 2026-07-29`.
- [ ] All 5 patterns are explained (~400 words each, clear + concrete + mindset shift).
- [ ] No code samples anywhere.
- [ ] No hardcoded colors (all Tailwind `@theme` tokens).
- [ ] Intro and conclusion are personal, reflective.
- [ ] Links to `/collaborer` use `localizePath` for i18n correctness.
- [ ] `astro check` passes (0 errors, 0 warnings).
- [ ] `npm run build` succeeds.
- [ ] All commits follow conventional commits (`feat(notes): ...`).
- [ ] Article is ready to merge to `main`.

---

## Notes

- **No additional files needed:** The article is self-contained. No components, no new utilities, no CSS.
- **MDX imports:** `<Callout>` is already available in `src/components/prose/Callout.astro`. No import needed (Astro auto-imports prose components).
- **Tone is the hardest part:** Personal voice, vague on projects, clear on patterns. Review tone repeatedly.
- **Translation is not word-for-word:** EN should feel natural, not machine-translated.
