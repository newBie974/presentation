# Spec — Article « Développeur orchestrateur / manager d'agents »

Date : 2026-06-08
Type : note bilingue (FR + EN), content collection `notes`
Auteur : Aymeric Dijoux

---

## Objectif

Publier un article qui décrit **l'évolution du métier de développeur** vers un rôle
d'**orchestrateur / manager d'agents IA**, en lien avec le spec-driven development.

Thèse (constat nuancé, pas manifeste choc) :

> Je code encore — mais ce n'est plus là qu'est la valeur. Elle a glissé de la frappe
> au clavier vers la spec, le jugement et la garantie que ce qui part est ce qui était
> attendu de l'agent.

Le cœur de l'article est **le nouveau métier** (les compétences qui montent / baissent,
l'analogie manager d'équipe), pas la mécanique du workflow — qui est déjà couverte par
l'article spec-driven existant et sera simplement liée.

## Pourquoi

- Prolonge la ligne éditoriale « indie builder qui ship avec l'IA » du site.
- Capitalise sur deux articles déjà publiés (`spec-driven-development`,
  `clean-code-react-native-claude`) en les reliant plutôt qu'en les répétant.
- Donne une pièce « vision métier » qui manque au corpus : on a le _comment_ (workflow,
  règles), il manque le _pourquoi ça change le métier_.

## Non-goals

- **Pas** de re-explication du pipeline spec → plan → subagents (déjà fait, on lie).
- **Pas** de manifeste provocateur « le dev est mort ». Ton nuancé, crédible.
- **Pas** de prédictions macro sur l'emploi / le marché. On reste à l'échelle vécue.
- **Pas** de nouveau composant, de nouvelle page, ni de modif de data/i18n.

## Métadonnées

| Champ            | FR                                                                                                                                           | EN                                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Fichier          | `src/content/notes/fr/2026-06-developpeur-orchestrateur.mdx`                                                                                 | `src/content/notes/en/2026-06-developer-orchestrator.mdx`                                                                                   |
| `title`          | « Je code encore, mais ce n'est plus là qu'est la valeur »                                                                                   | "I still write code — but that's no longer where the value is"                                                                              |
| `date`           | 2026-06-08                                                                                                                                   | 2026-06-08                                                                                                                                  |
| `locale`         | `fr`                                                                                                                                         | `en`                                                                                                                                        |
| `translationKey` | `2026-06-developer-orchestrator`                                                                                                             | `2026-06-developer-orchestrator`                                                                                                            |
| `tags`           | `["ia", "process", "claude"]`                                                                                                                | `["ia", "process", "claude"]`                                                                                                               |
| `draft`          | `false`                                                                                                                                      | `false`                                                                                                                                     |
| `excerpt`        | Le métier de dev glisse de la frappe au pilotage : orchestrer des agents, écrire la spec, garantir que ce qui part est ce qui était attendu. | The dev job is shifting from typing to steering: orchestrating agents, writing the spec, guaranteeing that what ships is what was expected. |

Frontmatter conforme au schema Zod de `content/config.ts` (title, date, locale,
translationKey, tags, excerpt, draft). `excerpt` ~ 1 phrase dense.

## Structure (7 sections, ~1100–1300 mots)

1. **Hook — l'aveu nuancé.** « Je code encore, mais… ». On casse le claim choc dès la
   première ligne pour rester crédible. Pose le glissement de la valeur.

2. **Ce qui a bougé.** La frappe descend, le jugement monte. Le dev passe d'exécutant à
   donneur d'ordre + contrôleur qualité. Court, pose le décor.

3. **Le nouveau métier : manager d'agents.** Section centrale. Analogie : piloter un
   agent ≈ manager une équipe de juniors brillants mais littéraux — tu cadres, tu
   délègues, tu reviewses, tu ne mets pas la main au clavier pour chaque ligne. Ce que
   fait concrètement un orchestrateur dans une journée.

4. **Les compétences qui montent / qui baissent.** Montent : écrire une spec, décomposer
   un problème, reviewer, le _goût_ (juger « bon » vs « moyen »). Baissent : mémoriser la
   syntaxe d'une lib, la vitesse de frappe pure. Format liste claire.

5. **« M'assurer que ce qui part est ce qui est attendu ».** La boucle de garantie :
   spec = contrat, review = QA. Reformule la phrase de l'utilisateur. Liens vers
   `/notes/2026-05-spec-driven-development` (le _comment_) et
   `/notes/2026-05-clean-code-react-native-claude` (le _contrat de qualité_).

6. **Ce que je fais encore à la main.** Contre-nuance qui rend l'article honnête : archi
   tordue, debug subtil, décision de goût impossible à spécifier, le « dernier 5 % ».
   Empêche l'article de sonner comme une pub.

7. **Ce que ça change / ne change pas.** Clôture. Le métier change de forme, pas de fond :
   on a toujours été payés pour notre jugement, pas pour taper.

## Éléments de contenu

- Voix : première personne, FR par défaut, ton direct des notes existantes.
- Un `<Callout>` (import `@/components/prose/Callout.astro`) sur l'idée forte de la
  section 5 ou 6 (ex : la review n'est pas une formalité, c'est devenu le cœur du job).
- Au moins une liste « montent / baissent » (section 4).
- Liens internes via chemins relatifs `/notes/...` (cohérent avec les MDX existants qui
  utilisent des liens markdown absolus de type `/notes/slug`).
- Pas de bloc de code lourd obligatoire ; un petit encart conceptuel possible mais pas
  requis (l'article est plus « vision » que « tuto »).

## Critères de succès

- [ ] Les deux fichiers MDX existent, frontmatter complet et valide (schema Zod).
- [ ] `translationKey` identique des deux côtés → toggle FR↔EN actif.
- [ ] `npm run build` passe 0 erreur, 0 warning (articles inclus dans le build).
- [ ] Aucune duplication du contenu de l'article spec-driven : il est **lié**, pas réécrit.
- [ ] L'article tient la thèse nuancée du début à la fin (pas de dérive « manifeste »).
- [ ] EN = vraie réécriture idiomatique, pas du mot-à-mot traduit.

## Plan d'exécution (léger)

1. Écrire le MDX FR complet.
2. Écrire le MDX EN (réécriture idiomatique, même structure).
3. `npm run build` → vérifier 0 erreur / 0 warning et que les routes des deux articles
   sont générées.
4. Commit conventionnel : `feat(notes): add developer-as-orchestrator article (FR + EN)`.

Pas de spec/plan superpowers lourd : c'est du contenu, l'exécution est en 2 fichiers.
