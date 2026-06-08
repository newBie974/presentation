# Spec — Article « Flue : le harness, version framework »

Date : 2026-06-08
Type : note bilingue (FR + EN), content collection `notes`
Auteur : Aymeric Dijoux
Suite de : [le harness / Agent SDK](/notes/2026-06-harness-agent-sdk)

---

## Objectif

Article de **continuité** du harness : présenter **Flue** (`withastro/flue`,
« The Agent Harness Framework »), montrer qu'il généralise en framework ce que
l'article précédent montrait avec le Claude Agent SDK, et **porter notre agent
d'analyse de profil** (de l'article harness) en Flue comme pont concret.

Double angle (choisi par l'auteur) :

1. **Perso / Astro** : « je build ce site avec Astro, et l'équipe Astro sort un
   framework… pour des agents IA ». Entrée personnelle et crédible.
2. **Le harness en framework** : Flue monte d'un cran au-dessus du SDK — il fournit les
   couches externes (sandbox, sessions durables, observabilité, déploiement) que le SDK
   te laissait coder.

## Pourquoi

- Suite directe de l'article harness, très demandée par la continuité du sujet.
- On-brand : le site tourne sous Astro ; Flue vient de la même équipe → angle personnel naturel.
- Réutilise l'agent-exemple déjà établi (analyse de profil social) → fil rouge entre les deux articles.

## Non-goals

- **Pas** prétendre l'avoir tourné en prod. Posture : « je l'ai porté pour voir » +
  « framework jeune à surveiller ». Honnête.
- **Pas** de re-explication de ce qu'est un harness (déjà fait → on lie l'article précédent).
- **Pas** de nouveau composant ; on **réutilise/lie** le schéma des couches existant
  (`HarnessLayers`) plutôt que d'en refaire un.
- **Pas** de tutoriel d'install exhaustif ; extraits qui comptent.

## Exactitude technique (vérifiée contre README + docs, 2026-06-08)

API de **Flue** à utiliser telle quelle :

| Concept           | Flue (exact)                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Package           | `@flue/runtime` (+ dev `@flue/cli`)                                                              |
| Agent             | `createAgent(() => ({ model, skills, tools, sandbox }))` dans `agents/<name>.ts`                 |
| Modèle            | chaîne `anthropic/claude-opus-4-8` (ou autre)                                                    |
| Harness           | `const harness = await init(agent)`                                                              |
| Session           | `const session = await harness.session()`                                                        |
| Prompt            | `await session.prompt(message, { result })`                                                      |
| Sortie structurée | schéma **Valibot** dans `result` → `{ data }` typé/validé                                        |
| Skill             | `.agents/skills/<nom>/SKILL.md` ; `session.skill('nom')` ou import `with { type: 'skill' }`      |
| Sous-agent        | `session.task(message, { agent? })` (one-shot, session détachée)                                 |
| FS / shell        | `session.fs.*`, `session.shell(cmd)` ; sandbox virtuel `just-bash`                               |
| MCP               | `connectMcpServer()`                                                                             |
| CLI               | `flue dev` · `flue run <wf> --payload` · `flue connect` · `flue build --target node\|cloudflare` |

**Contraste clé avec l'Agent SDK** (article précédent) :

- SDK : `outputFormat: { type: 'json_schema', schema }` → `structured_output`.
- Flue : `session.prompt(msg, { result: vSchema })` → `data` (Valibot, pas JSON Schema).
- Skills : `.claude/skills/` (SDK) vs `.agents/skills/` (Flue).

Aucun claim de mémoire : tout extrait de code reflète l'API vérifiée ci-dessus. Là où
l'API exacte d'une option est incertaine, on la décrit en prose plutôt que de l'inventer
en code.

## Métadonnées

| Champ            | FR                                                                                                                                                                            | EN                                                                                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fichier          | `src/content/notes/fr/2026-06-flue-framework-agents.mdx`                                                                                                                      | `src/content/notes/en/2026-06-flue-agent-framework.mdx`                                                                                                                             |
| `title`          | « Flue : le harness d'agent, mais en framework (et c'est l'équipe Astro) »                                                                                                    | "Flue: the agent harness, but as a framework (and it's the Astro team)"                                                                                                             |
| `date`           | 2026-06-08                                                                                                                                                                    | 2026-06-08                                                                                                                                                                          |
| `locale`         | `fr`                                                                                                                                                                          | `en`                                                                                                                                                                                |
| `translationKey` | `2026-06-flue-agent-framework`                                                                                                                                                | `2026-06-flue-agent-framework`                                                                                                                                                      |
| `tags`           | `["ia", "claude", "stack"]`                                                                                                                                                   | `["ia", "claude", "stack"]`                                                                                                                                                         |
| `draft`          | `false`                                                                                                                                                                       | `false`                                                                                                                                                                             |
| `excerpt`        | L'équipe Astro sort « The Agent Harness Framework ». Flue prend le harness de l'article précédent et en fait un vrai framework. J'y ai porté notre agent d'analyse de profil. | The Astro team ships "The Agent Harness Framework." Flue takes the harness from the previous article and turns it into a real framework. I ported our profile-analysis agent to it. |

Frontmatter conforme au schema Zod (`title` min 3, `excerpt` min 20, `date` date).

## Structure (7 sections, ~1200–1400 mots)

1. **Hook perso/Astro.** Je build ce site sous Astro. L'équipe Astro vient de sortir un
   framework — pas pour des sites, pour des **agents** : Flue, littéralement « The Agent
   Harness Framework ». Pont vers l'article précédent.
2. **Rappel express.** Dans l'article précédent : le harness = l'Agent SDK, tu écris du
   markdown. Flue monte d'un cran. (lien)
3. **C'est quoi Flue.** « Comme Claude Code, mais 100% headless et programmable. »
   Runtime-agnostic (Node, Cloudflare Workers, CI). Le trio `agent → init() (harness) →
session`. + sandbox / skills / tasks / subagents / MCP / observabilité.
4. **Ce que Flue ajoute aux couches.** Renvoi au schéma des couches de l'article
   précédent : Flue te donne les couches **externes** (sandbox, exécution durable,
   observabilité, déploiement) que le SDK laissait à ta charge. Lien vers le schéma.
5. **Notre agent, version Flue (le pont).** Port de l'agent d'analyse de profil :
   `agents/profile-analyzer.ts` avec `createAgent`, `init`, `session.prompt(msg, { result })`
   et un schéma **Valibot**. Contraste explicite avec la version Agent SDK (JSON Schema →
   `structured_output` vs Valibot → `data` ; `.claude/skills` vs `.agents/skills`). CLI
   `flue run`.
6. **Ce que ça change vraiment.** Sessions durables, sandbox, déploiement multi-cible
   (Node / Workers / GitHub Actions), `task()`/subagents : la partie « ops » du harness,
   livrée. Quand prendre Flue vs l'Agent SDK seul.
7. **Honnête + clôture.** Framework jeune (Apache-2.0, équipe Astro), à surveiller ; je
   l'ai porté pour voir, pas (encore) en prod. Clôture qui boucle : le harness, d'abord un
   concept, puis un SDK, maintenant un framework.

## Éléments de contenu

- Voix : première personne, FR par défaut, ton direct des notes existantes.
- Un `<Callout>` sur l'idée forte (« comme Claude Code, mais headless et programmable » ou
  le contraste Valibot vs JSON Schema).
- Au moins un bloc de code TypeScript Flue exact (l'agent porté).
- Liens internes : article harness `/notes/2026-06-harness-agent-sdk` (et son schéma),
  éventuellement CLAUDE.md. Zéro duplication.

## Critères de succès

- [ ] Les deux fichiers MDX existent, frontmatter complet et valide (schema Zod).
- [ ] `translationKey` identique des deux côtés → toggle FR↔EN actif.
- [ ] `npm run build` passe 0 erreur, 0 warning (aucun nouveau warning).
- [ ] Chaque extrait de code reflète l'API Flue vérifiée (tableau § Exactitude) — zéro nom inventé.
- [ ] Le contraste avec l'Agent SDK est explicite, l'agent-exemple est le même (analyse de profil).
- [ ] Posture honnête (framework jeune, porté pour voir — pas de claim prod).
- [ ] EN = réécriture idiomatique, pas du mot-à-mot.

## Plan d'exécution (léger)

1. Écrire le MDX FR complet.
2. Écrire le MDX EN (réécriture idiomatique, même structure + mêmes extraits de code).
3. `npm run build` → 0 erreur / 0 warning, les deux routes générées.
4. Commit : `feat(notes): add Flue agent-framework article (FR + EN)`.
