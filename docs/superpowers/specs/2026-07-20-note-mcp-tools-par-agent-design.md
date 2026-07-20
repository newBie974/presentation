# Design — Note « Perplexity recule sur MCP en interne. Voici comment je m'en sers sans me cogner au même mur. »

Date : 2026-07-20
Type : article de blog bilingue (note MDX FR + EN)
Source : architecture réelle d'un serveur de tools maison (« pool de tools » +
filtrage MCP par agent) d'un **projet client**. Le pattern est transférable ;
l'article le **génériquise entièrement** (voir « Contrainte de contenu »).
Déclencheur : l'article _"Why Perplexity is stepping back from MCP internally"_
(agent-engineering.dev).

## Objectif

Article d'opinion technique, ton _constat nuancé_ (ni manifeste hype, ni naïf),
ultra-concret. **Thèse** : le problème que Perplexity nomme (token bloat,
permissions faibles) est réel — mais c'est un problème de **câblage**, pas de
protocole. N'expose pas tout ; projette tes tools REST dans MCP, et n'accorde à
chaque agent que sa part.

**Cadrage POC — à mettre en avant partout.** Ce n'est pas un produit ni une archi
enterprise : c'est un **proof-of-concept** monté vite, qui prouve **une** chose —
qu'on esquive le mur du token bloat à l'échelle indie, sans renoncer à MCP. Cadre
l'article comme « voici mon POC et ce qu'il démontre / ce qu'il ne prétend pas
résoudre », pas comme une solution clé en main. Ça rend les limites honnêtes
(zéro isolation, loopback only, pas d'OAuth) cohérentes plutôt que gênantes : un
POC assume son périmètre.

Public : devs qui branchent des agents LLM sur des tools (MCP, function-calling).
Tags : `["ia", "tools", "build"]`.

## Contrainte de contenu (mémoire `articles-from-chats`) — NON NÉGOCIABLE

Le pattern vient d'un **projet client** (assistant de due-diligence sur documents
confidentiels). Interdiction absolue de le mentionner :

- **Zéro** : nom du client / de l'org, « due diligence », « fonds »,
  « collections », noms de groupes réels (`collection`, `extraction`, `grounding`),
  noms d'agents réels (`orchestrateur`, `chat`, `extracteur`), chemins réels.
- Le serveur de tools est présenté comme **l'outillage indie d'Aymeric**, pas celui
  d'un client.
- Exemple fil rouge **neutre et reproductible** : deux tools `search-notes` (JS) et
  `weather` (Python) ; deux agents `assistant` (voit `search`) et `meteo` (voit
  `weather`).
- Voix : première personne, nuancée, concrète. EN = vraie réécriture idiomatique.
- Vérifier les faits MCP/Perplexity : attribuer les critiques **à l'article**
  (« un papier argumente que… »), ne pas les affirmer comme parole officielle de
  Perplexity. Les faits sur MCP (transports stdio / streamable HTTP, schémas de
  tools chargés en contexte) doivent rester exacts.

## Les 3 critiques MCP relayées par le papier (à citer fidèlement)

1. **Token / context bloat** — MCP charge tous les schémas + descriptions de tools
   dans le contexte à chaque appel (des dizaines de k tokens) → coût + latence.
2. **Sécurité / permissions faibles** — pas d'OAuth, permissions granulaires,
   rate-limit, audit, gestion de credentials natifs.
3. **Fiabilité en prod** — transports par défaut (stdio) OK en local, mais latence /
   non-déterminisme / monitoring difficile en distribué.
   Réponse de Perplexity : retour aux **REST APIs + CLIs** + une Agent API managée.

## Le pattern (faits techniques réels à préserver, génériquisés)

**A — « un script n'est qu'un script ».** Un tool = un dossier avec un
`openapi.json` + un script par `operationId` (`operationId` === nom de fichier).
Contrat du script, aucun SDK :

- **stdin** : l'objet de paramètres fusionné (path + query + body), en JSON, puis
  fermé.
- **stdout** : le résultat, en JSON.
- **stderr** : les logs — **renvoyés à l'appelant en cas d'échec** (l'LLM lit
  l'erreur et retente).
- **exit code** : `0` = succès, sinon échec.
- Le cwd du process enfant = son propre dossier (donc `open("data.csv")` trouve le
  fichier voisin).

Le serveur sert le même dossier comme **endpoint HTTP typé** _et_ **tool MCP**. Nom
MCP namespacé par dossier : `search__query`. « One script, two protocols, one
schema. » Argument clé : **tes tools sont déjà du REST** — MCP n'est qu'une
2e projection du même script (donc le « retour au REST » de Perplexity, sans
renoncer à MCP).

**B — accorder ≠ servir.** Le serveur sert **tout** le pool à tout le monde. Un
agent est de la **config** : son frontmatter YAML déclare `tools: [search]`. Un
middleware _live-pull_ refiltre, **à chaque tour du modèle**, le pool aux seuls
tools dont le nom commence par un préfixe accordé :

```python
prefixes = tuple(f"{g}__" for g in groupes)   # ("search__",)
visibles = [t for t in pool if t.name.startswith(prefixes)]
```

Conséquence : le modèle voit **2 tools, pas 40** → antidote direct au token bloat
(#1). Accorder un tool à un autre agent = ajouter un mot dans _son_ frontmatter,
**zéro code**. Live-pull = ajouter/retirer un tool sans redéployer.

**Limites honnêtes (à ne pas cacher) :**

- **Zéro isolation.** Les scripts tournent comme des process enfants avec _tes_
  droits (lire tes fichiers, réseau, supprimer). Ce n'est **pas** un sandbox. Seule
  frontière : le bind **loopback (127.0.0.1)**. → indie-scale, pas enterprise.
- Sur #2 (sécurité) : le grant déclaratif _est_ de la permission granulaire, mais
  **pas** d'OAuth / audit / rate-limit → Perplexity a en partie raison.
- Sur #3 (stdio) : j'utilise du **HTTP loopback**, pas stdio → je dodge ce point,
  mais je suis _une_ machine, pas une flotte distribuée.
- **L'oubli est SILENCIEUX** : un groupe mal orthographié dans le frontmatter →
  `startswith` rejette ses tools → l'agent a zéro tool de ce groupe, **sans erreur**.
  Mode d'échec n°1.

## Angle central

Perplexity recule sur MCP → mais leurs 3 douleurs viennent d'un câblage naïf
(exposer tout, à tout le monde, sur stdio). Les 3 douleurs concrètes derrière :
**couplage** (le tool vit dans le code de l'agent), **sur-exposition** (chaque agent
voit tout → sécurité + le modèle se noie), **opacité** (aucune source unique ne dit
ce qu'un agent a le droit de toucher). A (exposer) + B (accorder) répondent.

## Structure (5 sections)

1. **Accroche + le problème.** Ouvre sur la news Perplexity et ses 3 critiques.
   Question : est-ce MCP le protocole, ou la façon naïve de le brancher ? Poser les
   3 douleurs concrètes (couplage, sur-exposition, opacité) et la question de
   l'article : exposer mes tools une fois, et n'accorder à chaque agent que sa part.
2. **A — Exposer un script en tool MCP, sans framework.** Le contrat stdin/stdout/
   stderr/exit. Snippets : `search-notes/query.js` (JS) + `weather/current.py`
   (Python) + le `openapi.json` (operationId=filename) + la sortie du serveur (les
   deux tools `search__query`, `weather__current`) + un `curl`. Punchline : « tes
   tools sont déjà du REST — MCP n'est qu'une 2e projection ».
3. **B — Accorder par agent.** Le serveur sert tout ; _accorder ≠ servir_. L'agent
   = config (`tools: [search]` en frontmatter des deux agents `assistant`/`meteo`).
   Le middleware live-pull + le snippet du filtre par préfixe. Le modèle voit sa
   part, pas le pool entier.
4. **Ce que ça répond — et mes limites honnêtes** (`Callout`). Mapping des 3
   critiques : #1 token bloat = réglé par le filtrage ; #2 permissions = grant
   déclaratif granulaire **mais** pas OAuth/audit/rate-limit + zéro isolation,
   loopback only ; #3 stdio = HTTP loopback, pas stdio, mais une machine ≠ flotte.
   Piège bonus : l'oubli silencieux d'un groupe.
5. **Le constat.** Pool partagé : ajouter un tool = déposer un fichier ; accorder =
   ajouter un mot ; la permission tient en une ligne auditable. MCP n'est pas mort ;
   le brancher bêtement, si.

## Métadonnées

| Champ          | FR                                                                                           | EN                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Fichier        | `src/content/notes/fr/2026-07-mcp-tools-par-agent.mdx`                                       | `src/content/notes/en/2026-07-mcp-tools-per-agent.mdx`                                             |
| title (FR)     | Perplexity recule sur MCP en interne. Voici comment je m'en sers sans me cogner au même mur. | —                                                                                                  |
| title (EN)     | —                                                                                            | Perplexity is pulling back from MCP internally — here's how I use it without hitting the same wall |
| date           | 2026-07-20                                                                                   | 2026-07-20                                                                                         |
| locale         | fr                                                                                           | en                                                                                                 |
| translationKey | `2026-07-mcp-tools-per-agent`                                                                | `2026-07-mcp-tools-per-agent`                                                                      |
| tags           | `["ia", "tools", "build"]`                                                                   | idem                                                                                               |
| draft          | false                                                                                        | false                                                                                              |

`excerpt` (≥ 20 car.) :

- FR : « Perplexity recule sur MCP en interne, et leurs raisons sont réelles. Mais le
  token bloat et les permissions faibles, c'est un problème de câblage — pas de
  protocole. Voici comment j'expose mes tools une fois et n'accorde à chaque agent
  que sa part. »
- EN : « Perplexity is pulling back from MCP internally, and their reasons are real.
  But token bloat and weak permissions are a wiring problem, not a protocol one.
  Here's how I expose my tools once and grant each agent only its slice. »

## Composants prose

- `Callout` pour la section 4 (limites honnêtes / zéro isolation).
- `FileBlock` pour l'arborescence du pool de tools (`tools/search-notes/…`,
  `tools/weather/…`) et éventuellement les frontmatters d'agents.
- Blocs de code Markdown standard (`js` / `python` / `json` / `yaml` / `console`).

## Hors périmètre

- Pas d'implémentation du serveur ni de code publiable du projet client — l'article
  décrit le **pattern**, pas le repo.
- Pas d'OG image custom (générée au build par le pipeline existant).
- Pas de tutoriel « installe scriptbox » : le nom de l'outil interne n'est pas
  publié ; on parle du _pattern_ (« un petit serveur qui transforme un dossier de
  scripts en tools MCP »), reproductible par le lecteur.
- Pas de prise de position « MCP est mort » : conclusion = nuancée.
