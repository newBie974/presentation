# Spec — Article « Le harness : ce qui transforme un LLM en agent (et pourquoi tu n'as pas à le coder) »

Date : 2026-06-08
Type : note bilingue (FR + EN), content collection `notes`
Auteur : Aymeric Dijoux
Source : conversation claude.ai « Infrastructure des agents IA et harness » (7-8 juin 2026)

---

## Objectif

Publier un article **explainer pédagogique à la première personne** qui répond à la
question « c'est quoi un harness avec les agents IA, les couches, la stack », et qui
amène la bascule : le pattern **harness + skill + memory + agent.md** décrit déjà le
**Claude Agent SDK**. Donc on n'assemble pas le harness à la main — le SDK _est_ le
harness.

Thèse (explainer à la 1ʳᵉ personne) :

> Je voulais comprendre ce qu'est un _harness_. En le creusant, j'ai réalisé que mon
> pattern mental — harness + skill + memory + agent.md — décrivait déjà le Claude Agent
> SDK. On n'assemble pas le harness : on écrit surtout du markdown.

## Pourquoi

- Prolonge la ligne éditoriale « comprendre et shipper avec l'IA » (CLAUDE.md, hooks,
  skills, spec-driven sont déjà couverts ; le _harness_ manque au corpus).
- Tiré d'une vraie conversation de l'auteur → ton authentique, exemples vécus.
- Relie les articles existants [CLAUDE.md](/notes/2026-04-claude-md) et
  [spec-driven](/notes/2026-05-spec-driven-development) plutôt que de les répéter.

## Non-goals

- **Pas** de re-explication du pipeline spec→plan→subagents (déjà fait, on lie).
- **Pas** de publication de l'agent d'extraction réel de l'auteur (c'est son travail).
  On le remplace par un agent-exemple neutre et reproductible.
- **Pas** de tutoriel exhaustif du SDK : on montre les **extraits qui comptent**, pas un
  projet complet fichier par fichier.
- **Pas** de nouveau composant, page, data ou i18n.

## Décision : agent-exemple

L'exemple central est un **agent « analyse de profil social »** (choisi par l'auteur,
orienté produit, on-brand avec son corpus Insta/TikTok) :

- **Entrée** : le contenu d'un profil (bio + posts avec leurs métriques) déposé dans un dossier.
- **Sortie structurée** (`outputFormat` json_schema) : `{ thèmes, ton, angle de contenu,
topPosts: [{ post, raison }] }` — il **classe les posts par performance** et explique
  le pattern gagnant.
- **memory** : garde l'historique des profils déjà analysés (comparer l'évolution, ne pas refaire).

Cet exemple expose les 4 briques sans rien révéler du produit pro de l'auteur.

## Exactitude technique (vérifiée contre la doc officielle, 2026-06-08)

API du **Claude Agent SDK** (TypeScript), à utiliser telle quelle dans les extraits :

| Brique du pattern | Réalité SDK (exacte)                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| harness           | `import { query } from "@anthropic-ai/claude-agent-sdk"` ; `query({ prompt, options })`          |
| agent.md          | `CLAUDE.md`, chargé via `options.settingSources: ['project']` (opt-in — défaut = prompt minimal) |
| skill             | `.claude/skills/<nom>/SKILL.md`, activés via `options.skills: 'all'` ou `[noms]`                 |
| memory            | tiers `'user' \| 'project' \| 'local'`                                                           |
| sortie structurée | `options.outputFormat: { type: 'json_schema', schema }` → champ `structured_output` du résultat  |
| garde-fou         | `options.allowedTools: ["Read", ...]` + fonction `options.canUseTool`                            |

**Nuance à ne pas survoler** : CLAUDE.md n'est PAS chargé par défaut ; il faut
`settingSources: ['project']`. L'article doit le dire (le chat l'avait simplifié).

Aucun claim technique de mémoire : tout extrait de code reflète l'API vérifiée ci-dessus.

## Métadonnées

| Champ            | FR                                                                                                                                                                               | EN                                                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fichier          | `src/content/notes/fr/2026-06-harness-agent-sdk.mdx`                                                                                                                             | `src/content/notes/en/2026-06-harness-agent-sdk.mdx`                                                                                                                       |
| `title`          | « Le harness : ce qui transforme un LLM en agent (et pourquoi tu n'as pas à le coder) »                                                                                          | "The harness: what turns an LLM into an agent (and why you don't have to build it)"                                                                                        |
| `date`           | 2026-06-08                                                                                                                                                                       | 2026-06-08                                                                                                                                                                 |
| `locale`         | `fr`                                                                                                                                                                             | `en`                                                                                                                                                                       |
| `translationKey` | `2026-06-harness-agent-sdk`                                                                                                                                                      | `2026-06-harness-agent-sdk`                                                                                                                                                |
| `tags`           | `["ia", "claude", "process"]`                                                                                                                                                    | `["ia", "claude", "process"]`                                                                                                                                              |
| `draft`          | `false`                                                                                                                                                                          | `false`                                                                                                                                                                    |
| `excerpt`        | Un LLM prédit du texte ; un agent exécute des tâches. Entre les deux : le harness. J'ai voulu le comprendre, et j'ai réalisé que mon pattern décrivait déjà le Claude Agent SDK. | An LLM predicts text; an agent runs tasks. In between sits the harness. I set out to understand it, and realized my mental pattern already described the Claude Agent SDK. |

Frontmatter conforme au schema Zod (`title` min 3, `excerpt` min 20, `date` date, etc.).

## Structure (7 sections, ~1200–1400 mots)

1. **Hook 1ʳᵉ personne.** « Je cherchais à comprendre le mot _harness_, et j'ai fini par
   comprendre que je le décrivais déjà sans le savoir. »
2. **C'est quoi un harness.** Définition (l'exosquelette autour du LLM qui le transforme
   d'un prédicteur de tokens en exécuteur de tâches) + la boucle agentique
   `call → observe → decide → repeat`. Court encart texte/ASCII.
3. **Les couches.** Le découpage qui fait consensus : cœur LLM · contexte/mémoire ·
   outils/boucle · garde-fous · observabilité. Présenté comme « ce que tu coderais… si tu
   partais de zéro ».
4. **La bascule : ton pattern = l'Agent SDK.** Le mapping 1:1 (tableau § Exactitude). Tu
   n'assembles rien, tu écris surtout du markdown. Mentionner la nuance `settingSources`.
5. **L'exemple produit (extraits).** L'agent analyse-de-profil : structure de dossier
   `.claude/skills/...`, CLAUDE.md, et la **ligne qui compte**
   `outputFormat: { type: 'json_schema', schema }` → `structured_output`. Où vit chaque
   brique. Garde-fou `allowedTools`/`canUseTool` (lecture seule). Extraits, pas le projet.
6. **La vraie décision : recherche agentique vs RAG.** Point fort du chat : ne pars pas
   par défaut sur vector DB ; l'agent fouille les fichiers ; pgvector seulement si gros
   corpus. La récupération multi-étapes coûte plus de tokens — d'où la règle.
7. **Par où commencer.** Niveau 0 (coder la boucle à la main, un soir, pour voir ce qu'un
   framework cache) → Niveau 1 (mini-harness dans ton produit via le SDK) → Niveau 2
   (observabilité / sous-agents quand l'orchestration se complexifie).

## Éléments de contenu

- Voix : première personne, FR par défaut, ton direct des notes existantes.
- Un `<Callout>` (`@/components/prose/Callout.astro`) sur l'idée forte : « la différence
  entre un chatbot et un agent, ce n'est pas le LLM, c'est tout ce qu'il y a autour ».
- Au moins un bloc de code TypeScript (l'extrait `query()` + `outputFormat`), exact.
- Liens internes vers CLAUDE.md et spec-driven via chemins `/notes/...`.
- Pas de duplication des articles liés.

## Critères de succès

- [ ] Les deux fichiers MDX existent, frontmatter complet et valide (schema Zod).
- [ ] `translationKey` identique des deux côtés → toggle FR↔EN actif.
- [ ] `npm run build` passe 0 erreur, 0 warning (aucun nouveau warning).
- [ ] Chaque extrait de code reflète l'API SDK vérifiée (tableau § Exactitude) — zéro nom
      d'API inventé, la nuance `settingSources` est mentionnée.
- [ ] L'agent pro réel de l'auteur n'apparaît pas ; l'exemple est l'analyseur de profil.
- [ ] EN = réécriture idiomatique, pas du mot-à-mot.

## Plan d'exécution (léger)

1. Écrire le MDX FR complet.
2. Écrire le MDX EN (réécriture idiomatique, même structure).
3. `npm run build` → 0 erreur / 0 warning, les deux routes générées.
4. Commit : `feat(notes): add harness & Agent SDK article (FR + EN)`.
