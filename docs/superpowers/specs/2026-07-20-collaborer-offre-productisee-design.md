# Design — Reshape `/collaborer` autour de l'offre productisée (#6)

Date : 2026-07-20
Type : refonte de page bilingue (`/collaborer` FR + `/en/work` EN) + data + organisms
Source de contenu : la grille tarifaire tech privée d'Aymeric
(`docs/commercial/grille-tarifaire-tech.html`) — offre déjà productisée, chiffrée et
rédigée. On la **porte sur le site public**, adaptée à la voix des pages.
Déclencheur : audit croissance #6 (pas de page pilier buyer, H1 sans mot-clé, offre
vague, aucun signal de prix). Voir [[freelance-offer-productized]].

## 1. Objectif

Transformer `/collaborer` (aujourd'hui : 4 « formats de mission » vagues, H1 sans
mot-clé, zéro prix) en **page pilier buyer** menée par une **offre productisée à 3
paliers avec ancres de prix**. But : capter le mot-clé money (« développeur freelance
IA · La Réunion & Paris ») dans le H1/§, qualifier les leads, augmenter la conversion.

**Décisions produit validées :**

- Offre phare = **produit sur mesure** (généraliste, pas de niche verticale).
- **Prix publics** : oui, les 3 ancres « dès X € » (6 000 / 14 000 / 22 000).
- **Périmètre** : tech/IA uniquement. L'offre « présence locale » (sites artisans,
  Google Business) reste hors scope (ressort KaribTeck/agence).

## 2. L'offre (verbatim adapté de la grille tech)

### §01 — Produit sur mesure (3 paliers)

| id         | Nom (FR / EN)                                        | Pitch (FR)       | Prix         | Délai         | Inclus (FR)                                                                                                                    |
| ---------- | ---------------------------------------------------- | ---------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| proto      | Prototype IA / AI prototype                          | Valider une idée | dès 6 000 €  | 2 semaines    | Proto fonctionnel · 1 parcours IA clé déployé et testable · de quoi décider avant d'investir · reco go/no-go argumentée        |
| mvp-web    | MVP Web / Web MVP _(featured : « Le plus demandé »)_ | Du Figma au live | dès 14 000 € | 6-8 semaines  | App web sur mesure (Next/Astro) · auth + back-office · base de données + dashboards · déploiement cloud + analytics            |
| mvp-mobile | MVP Mobile / Mobile MVP                              | App Store ready  | dès 22 000 € | 8-12 semaines | iOS + Android (RN/Flutter) · backend + API dédiés · paywall/abonnements in-app · publication stores + ASO · notifications push |

### §02 — Accompagnement (secondaire, compact)

| id          | Nom (FR)                 | Prix            | Note                                                                     |
| ----------- | ------------------------ | --------------- | ------------------------------------------------------------------------ |
| renfort     | Renfort tech (régie)     | 700 € / jour    | Full-stack + mobile + IA · sans engagement · min. 5 j                    |
| consulting  | Consulting / pair design | 220 € / session | Sessions 90 min · pack 5 = 950 € · compte-rendu actionnable              |
| audit       | Audit produit            | dès 900 €       | App, archi ou perf · rapport priorisé · déductible si le projet se lance |
| maintenance | Maintenance & évolution  | 90-390 € / mois | Sérénité dès 90 €/mois · Évolution dès 390 €/mois                        |

### Bande dérisquage (conditions — trust signals, copy existante)

- Devis ferme, sans dépassement caché : le prix annoncé est le prix payé.
- Tu valides — et paies — étape par étape (40 % commande / 40 % mi-parcours / 20 %
  livraison), en voyant le produit avancer.
- Code, accès et comptes à toi dès le premier jour. Zéro dépendance.
- RDV découverte de 30 min offert, sans engagement.

## 3. Structure de page (nouvelle)

1. **Hero** — H1 : « **Développeur freelance IA — ton produit du Figma au store** »
   (FR) / « **Freelance AI developer — your product, Figma to store** » (EN). Deck :
   positionnement productisé (« Je conçois, développe et déploie ton app mobile ou web
   propulsée par l'IA, sans sous-traitance. Tu échanges direct avec la personne qui
   code. »). `StatusBadge` dispo conservé. Ligne de valeurs actuelle (« Construire
   ensemble, pas juste coder pour toi ») → sous-titre.
2. **§01 L'offre** — 3 paliers (`OfferTiers`), ancres « dès X € », le featured mis en
   avant.
3. **§02 Accompagnement** — 4 lignes compactes (`OfferSupport`).
4. **Bande dérisquage** (`TrustBand`).
5. **Process** — inchangé.
6. **Témoignages** — inchangés.
7. **FAQ** — +3 entrées : budget, délais, propriété du code (voir §5).
8. **Cal** — inchangé.

## 4. Architecture (sans aggraver le doublon FR/EN #9)

- **`src/data/offer.ts`** — source unique typée bilingue : `offerTiers: OfferTier[]`,
  `supportOffers: SupportOffer[]`, `trustPoints: {fr,en}[]`. Types dans `src/types`.
- **Organisms partagés** (rendus dans `collaborer.astro` ET `en/work.astro`, contenu
  depuis `offer.ts` → zéro duplication de contenu) :
  - `OfferTiers.astro` (grille 3 paliers)
  - `OfferSupport.astro` (accompagnement)
  - `TrustBand.astro` (dérisquage)
  - `molecules/OfferTierCard.astro` (une carte de palier)
- **H1** : édition dans les 2 pages (petite).
- **`src/i18n/ui.ts`** : nouvelles clés de section (§ labels, headings, « dès », « le
  plus demandé », « / jour », etc.).
- **`src/data/faq.ts`** : +3 entrées bilingues (budget, délais, propriété).
- **`src/lib/jsonLd.ts`** : enrichir `ProfessionalService` avec `makesOffer` / `hasOfferCatalog`
  (les 3 paliers + prix « dès ») pour le SEO/GEO.
- **`services.ts`** : remplacé par `offer.ts` (supprimer si plus référencé) — ou garder
  les 4 services mappés vers les nouveaux paliers. À trancher à l'implémentation :
  préférence = migrer vers `offer.ts` et retirer l'ancien `services.ts` s'il n'est plus
  utilisé ailleurs.

## 5. FAQ — nouvelles entrées (bilingues)

- **Budget** : « Combien ça coûte ? » → « Forfait fixe selon le palier : proto dès
  6 000 €, MVP web dès 14 000 €, MVP mobile dès 22 000 €. Devis ferme après le call
  découverte, sans dépassement caché. »
- **Délais** : « En combien de temps ? » → proto 2 sem · MVP web 6-8 sem · MVP mobile
  8-12 sem. Démos à chaque étape.
- **Propriété** : « À qui appartient le code ? » → « À toi, dès le premier jour. Code,
  accès et comptes, zéro dépendance. »

## 6. Contrainte de confidentialité

Le kit `docs/commercial/` est marqué « usage privé — ne pas diffuser », MAIS Aymeric a
**explicitement validé** la publication des prix et de l'offre sur `/collaborer`.
Ne PAS publier : les devis nominatifs (couvreur Dupont, Google Business, Compi), les
mentions légales détaillées (SIRET/adresse — déjà ailleurs), ni l'offre « présence
locale ». Seuls l'offre tech/IA + les ancres « dès X » passent en public.

## 7. Métadonnées / SEO

- Pas de nouvelle route (reshape de l'existante) → pas de sitemap/hreflang à changer.
- `title`/`description` : intégrer « développeur freelance IA · La Réunion & Paris ».
- H1 unique par page portant le mot-clé.
- `ProfessionalService` JSON-LD enrichi des offres.

## 8. Hors périmètre

- Offre « présence locale » (KaribTeck).
- Génération de devis / facturation (reste dans `docs/commercial/`).
- Dedup complet FR/EN des pages (#9) — on n'ajoute que du contenu data-driven partagé,
  on ne refond pas les pages entières.
- Nouvelle page pilier séparée (on reshape `/collaborer`).
