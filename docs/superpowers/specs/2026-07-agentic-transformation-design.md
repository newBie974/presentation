---
title: "De prompt engineer à agentic AI engineer — Design Spec"
date: 2026-07-29
status: draft
---

# Design Spec: Article Bilingue "Agentic AI Engineer Transformation"

## Summary

Un article de réflexion personnelle (Option B) qui positionne Aymeric comme quelqu'un qui a réellement appliqué les concepts d'agentic AI engineering. L'article relie la roadmap "14-step" du Medium à **5 patterns architecturaux concrets** qu'Aymeric a découverts — la vraie différence entre un prompt engineer et un agentic AI engineer.

**Publication:** Article normal dans `/notes`, bien tagué (`ia`, `claude`, `process`, `build`). Pas de section spéciale sur la home, mais visible en recherche et feed via tags.

---

## Metadata

| Field                | Value                                                                                                                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Titre FR**         | De prompt engineer à agentic AI engineer — les 5 patterns qui m'ont transformé                                                                                                                                                                                           |
| **Titre EN**         | From Prompt Engineer to Agentic AI Engineer — The 5 Patterns That Changed Everything                                                                                                                                                                                     |
| **Translation Key**  | `2026-07-agentic-transformation`                                                                                                                                                                                                                                         |
| **Locale**           | FR (primary), EN (mirror)                                                                                                                                                                                                                                                |
| **Tags**             | `ia`, `claude`, `process`, `build`                                                                                                                                                                                                                                       |
| **Excerpt FR**       | On dit qu'il faut apprendre 14 étapes pour devenir un agentic AI engineer. Spoiler: les vraies transformations tiennent en 5 patterns architecturaux. Voici comment j'ai compris qu'il ne s'agissait plus de parler au modèle, mais de construire un système qui décide. |
| **Excerpt EN**       | They say you need 14 steps to become an agentic AI engineer. Spoiler: the real transformation fits into 5 architectural patterns. Here's how I realized it's not about talking to the model—it's about building a system that decides.                                   |
| **Draft**            | false                                                                                                                                                                                                                                                                    |
| **Wordcount Target** | 2500–3000 words (FR)                                                                                                                                                                                                                                                     |
| **Read Time**        | ~12 min (FR)                                                                                                                                                                                                                                                             |

---

## Structure & Flow

### **Intro (250 words)**

**Purpose:** Establish the core shift and hook.

- **Opening line:** "Un prompt engineer parle au modèle. Un agentic AI engineer construit un système que le modèle orchestre."
- **Context:** Personal realization that this difference is real, not just semantic.
- **Bridge:** "On parle beaucoup de la roadmap '14 steps' pour devenir agentic AI engineer. Mais la vraie transformation, elle tient en 5 patterns architecturaux."
- **Teaser:** These 5 patterns are what separate theory from shipping real systems.

**Tone:** Conversational, personal ("J'ai réalisé que...", "Ce moment où j'ai compris...").

---

### **Section 1: Pourquoi les 14 steps ne suffisent pas (300 words)**

**Purpose:** Contextualize the Medium roadmap without naming it directly.

- **Hook:** "Il y a une roadmap célèbre qui énumère 14 étapes pour devenir agentic AI engineer, de Python jusqu'au déploiement. C'est un guide utile. Mais c'est linéaire."
- **The problem:** The roadmap teaches _what_ (LangGraph, tools, RAG, evaluation). It doesn't teach _why_ the architecture matters, or the patterns that determine success.
- **The shift:** Real transformation happens when you move from "learning tools" to "architecting systems."
- **Bridge:** "Les vraies 5 patterns du devenir agentic AI engineer, ce sont les leviers architecturaux qui rendent les étapes 8-13 du roadmap possibles."

**Tone:** Reflective, not dismissive of the Medium guide — complement it.

---

### **Section 2-6: Les 5 Patterns (2000 words, ~400 words per pattern)**

**Order (logical, not chronological):**

#### **Pattern 1: Data-Driven Configuration (Foundation)**

- **Definition:** Your agent is not defined in code. It's defined in structured data (YAML, files, config). The system reads this data at runtime, not at build time.
- **The problem it solves:**
  - Before: Change an agent's persona → edit code → redeploy → restart.
  - After: Change a YAML file → system picks it up next turn → zero downtime.
- **Concrete realization (vague on project):** "J'ai réalisé que mes agents ne devaient pas avoir de code dur. Tout devrait être une donnée — la persona, les skills, les outils. Quand tu fais ça, l'architecture devient vivante."
- **Mindset shift:** "Avant, je pensais 'code is the source of truth'. Maintenant, c'est 'data is the source of truth, code just reads it'."

#### **Pattern 2: LIVE Orchestration via Middleware (The Heart)**

- **Definition:** Configuration changes (personas, skills, tools, models) are injected dynamically every turn, not built once and frozen.
- **The problem it solves:**
  - Enables rapid iteration without redeploy.
  - Allows an agent to adapt its behavior per-request based on injected context.
- **Concrete realization:** "Le vrai défi n'était pas le modèle. C'était l'orchestration — décider quoi injecter, quand, comment."
- **Mindset shift:** "Je pensais que le modèle décidait tout. En vrai, c'est le middleware qui décide quoi proposer au modèle. Le middleware, c'est où vit le vrai contrôle."

#### **Pattern 3: Dynamic Subagent Discovery (Scalability)**

- **Definition:** New subagents are discovered and registered at runtime by scanning a directory. No code change, no restart.
- **The problem it solves:**
  - Scaling the agent roster without editing code.
  - Enables a truly modular architecture where each subagent is self-contained.
- **Concrete realization:** "À un moment, j'ai réalisé que créer un nouveau subagent ne devrait pas être une décision d'architecture. Ça devrait être aussi simple que créer un dossier."
- **Mindset shift:** "Avant, les agents étaient des singletons hardcodés. Maintenant, c'est une roster découverte dynamiquement. La différence? Ça passe à l'échelle sans effort."

#### **Pattern 4: Per-Call Context Injection (Security & Isolation)**

- **Definition:** The agent has no global state. Every context (user, scope, collection, permissions) is injected into the tools for that specific call.
- **The problem it solves:**
  - Multi-tenant safety (no cross-talk between users).
  - Concurrent request safety (no race conditions).
  - Authorization as a first-class concern, not an afterthought.
- **Concrete realization:** "Le moment clé: je me suis rendu compte que les agents ne doivent pas 'connaître' qui les utilise ou quel contexte. Ça doit être injecté dans chaque appel."
- **Mindset shift:** "Avant, je pensais state management. Maintenant, c'est: 'nothing is stored, everything is injected'."

#### **Pattern 5: Graceful Degradation & Hot Reload (Resilience)**

- **Definition:** The system continues working even when config is being edited (malformed YAML, incomplete files). It degrades gracefully—keeps the last known good version.
- **The problem it solves:**
  - Live iteration without system crashes.
  - Editing agents while they're running.
  - Observability when things break (errors don't propagate, they degrade).
- **Concrete realization:** "Je construisais un système où des gens éditent les agents en live. La première question: comment ça ne crash pas?"
- **Mindset shift:** "Avant, un erreur de config = system down. Maintenant, c'est: 'keep running, log the issue, use the last good version'."

---

### **Section 7: Lier les 5 Patterns aux Steps du Roadmap (400 words)**

**Purpose:** Connect back to the Medium 14-step roadmap, showing where your patterns fit.

- **The mapping:**
  - Steps 1-3 (Mental Model) → Understand what an agentic AI engineer actually builds.
  - Steps 4-8 (Building Blocks) → Learn the technical foundations (Python, async, tools, LangGraph).
  - **Steps 9-13 (Build It Right)** → Here's where the 5 patterns matter most.
    - Step 10 (State file) + Step 12 (Evaluation) → Pattern #5 (Graceful Degradation).
    - Step 11 (Maker-checker split) → Pattern #4 (Per-Call Context Injection).
    - Step 8 (LangGraph orchestration) → Pattern #1 + #2 (Data-Driven Config + LIVE Orchestration).

- **The insight:** "Le roadmap te dit _quoi_ apprendre. Les 5 patterns, c'est le _pourquoi_ de l'architecture. L'un sans l'autre, tu vas apprendre la théorie mais ne pas savoir comment le tout tient ensemble."

---

### **Conclusion (300 words)**

**Purpose:** Synthesize and call to action.

- **Recap:** "Voici ce qui différencie un prompt engineer d'un agentic AI engineer:"
  1. Configuration data > hardcoded behavior.
  2. Orchestration via middleware > dumb LLM call.
  3. Dynamic discovery > static roster.
  4. Context injection > global state.
  5. Graceful degradation > crash on error.

- **The shift:** "Ce n'est plus 'comment je parle au modèle?'. C'est 'comment je construis un système où le modèle décide, orchestré correctement, sans état global, résilient'."

- **Call-to-action (subtle):** "Si tu veux explorer comment ça marche concrètement, j'accompagne les indie builders qui construisent des agents IA. [Link to `/collaborer`]"

---

## Content Guidelines

### **Tone & Style**

- **Personal:** First-person, moments of realization ("J'ai réalisé que...").
- **Non-technical:** Zero code samples, zero deep implementation details. This is vision, not a tutorial.
- **Vague on projects:** Never name Decider or specific client work. Keep it general ("when I was building...").
- **Clear on patterns:** Each pattern is named, defined, and explained without jargon.

### **MDX Components Used**

- `<Callout type="info">` for key insights (e.g., definition of each pattern).
- `<Callout type="note">` for mindset shifts ("Before I thought... Now I realize...").
- No code blocks.
- No diagrams (text is sufficient).

### **Links**

- Internal: Link to `/collaborer` in conclusion (using `localizePath`).
- No external links (self-contained).

### **Metadata in Frontmatter**

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

---

## Files to Create

1. **French version:** `src/content/notes/fr/2026-07-agentic-transformation.mdx`
2. **English version:** `src/content/notes/en/2026-07-agentic-transformation.mdx`
3. **This spec:** `docs/superpowers/specs/2026-07-agentic-transformation-design.md`

---

## Success Criteria

- [ ] Article is ~2500-3000 words (FR).
- [ ] All 5 patterns are explained clearly, one per section.
- [ ] No code samples, no deep technical details.
- [ ] Personal voice maintained throughout.
- [ ] Links back to Medium roadmap without naming it (implicit reference).
- [ ] Conclusion includes subtle CTA to `/collaborer`.
- [ ] Both FR and EN versions have matching `translationKey` in frontmatter.
- [ ] Tags are correct: `ia`, `claude`, `process`, `build`.
- [ ] `astro check` passes (TypeScript, syntax, links).
- [ ] No contrast issues (verified against theme.css).

---

## Scope Notes

**In scope:**

- Explaining the 5 patterns conceptually.
- Linking to the Medium 14-step roadmap (implicitly).
- Personal reflection on the shift from prompt engineering to agentic AI engineering.

**Out of scope:**

- Deep technical tutorials.
- Code samples or implementation details.
- Naming specific projects or clients.
- Comparing tools/frameworks (LangGraph vs. others).

---

## Timeline

- **Writing:** 2-3 hours (outline + draft + review).
- **Review & edits:** 1 hour.
- **Publish:** Commit + merge to `main`.
