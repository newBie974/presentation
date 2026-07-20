import type { OfferTier, SupportOffer } from "@/types";

// Public productized offer — ported from the private tech pricing grid
// (docs/commercial/grille-tarifaire-tech.html). Prices are "from" anchors.
export const offerTiers: OfferTier[] = [
  {
    id: "proto",
    name: { fr: "Prototype IA", en: "AI prototype" },
    pitch: { fr: "Valider une idée", en: "Validate an idea" },
    priceFrom: 6000,
    duration: { fr: "2 semaines", en: "2 weeks" },
    includes: [
      {
        fr: "Proto fonctionnel, 1 parcours IA clé déployé et testable",
        en: "Working prototype, 1 key AI flow deployed and testable",
      },
      {
        fr: "De quoi décider avant d'investir",
        en: "Enough to decide before you invest",
      },
      { fr: "Reco go / no-go argumentée", en: "Reasoned go / no-go call" },
    ],
  },
  {
    id: "mvp-web",
    name: { fr: "MVP Web", en: "Web MVP" },
    pitch: { fr: "Du Figma au live", en: "Figma to live" },
    priceFrom: 14000,
    duration: { fr: "6-8 semaines", en: "6-8 weeks" },
    featured: true,
    includes: [
      {
        fr: "App web sur mesure (Next / Astro)",
        en: "Custom web app (Next / Astro)",
      },
      { fr: "Authentification + back-office", en: "Auth + back-office" },
      { fr: "Base de données + dashboards", en: "Database + dashboards" },
      {
        fr: "Déploiement cloud + analytics",
        en: "Cloud deployment + analytics",
      },
    ],
  },
  {
    id: "mvp-mobile",
    name: { fr: "MVP Mobile", en: "Mobile MVP" },
    pitch: { fr: "App Store ready", en: "App Store ready" },
    priceFrom: 22000,
    duration: { fr: "8-12 semaines", en: "8-12 weeks" },
    includes: [
      {
        fr: "iOS + Android (RN / Flutter)",
        en: "iOS + Android (RN / Flutter)",
      },
      { fr: "Backend + API dédiés", en: "Dedicated backend + API" },
      {
        fr: "Paywall / abonnements in-app",
        en: "Paywall / in-app subscriptions",
      },
      { fr: "Publication stores + ASO", en: "Store publishing + ASO" },
      { fr: "Notifications push", en: "Push notifications" },
    ],
  },
];

export const supportOffers: SupportOffer[] = [
  {
    id: "renfort",
    icon: "lucide:wrench",
    name: { fr: "Renfort tech (régie)", en: "Tech reinforcement (T&M)" },
    price: { fr: "700 € / jour", en: "€700 / day" },
    note: {
      fr: "Full-stack + mobile + IA · sans engagement · min. 5 j",
      en: "Full-stack + mobile + AI · no commitment · min. 5 days",
    },
  },
  {
    id: "consulting",
    icon: "lucide:message-circle",
    name: { fr: "Consulting / pair design", en: "Consulting / pair design" },
    price: { fr: "220 € / session", en: "€220 / session" },
    note: {
      fr: "Sessions 90 min · pack 5 = 950 € · compte-rendu actionnable",
      en: "90-min sessions · 5-pack = €950 · actionable write-up",
    },
  },
  {
    id: "audit",
    icon: "lucide:search-check",
    name: { fr: "Audit produit", en: "Product audit" },
    price: { fr: "dès 900 €", en: "from €900" },
    note: {
      fr: "App, archi ou perf · rapport priorisé · déductible si le projet se lance",
      en: "App, architecture or perf · prioritized report · credited if the project starts",
    },
  },
  {
    id: "maintenance",
    icon: "lucide:heart-pulse",
    name: { fr: "Maintenance & évolution", en: "Maintenance & evolution" },
    price: { fr: "90-390 € / mois", en: "€90-390 / month" },
    note: {
      fr: "Sérénité dès 90 €/mois · Évolution dès 390 €/mois",
      en: "Care from €90/mo · Evolution from €390/mo",
    },
  },
];

export const trustPoints: { fr: string; en: string }[] = [
  {
    fr: "Devis ferme, sans dépassement caché : le prix annoncé est le prix payé.",
    en: "Firm quote, no hidden overruns: the price quoted is the price paid.",
  },
  {
    fr: "Tu valides — et paies — étape par étape (40 / 40 / 20), en voyant le produit avancer.",
    en: "You approve — and pay — step by step (40 / 40 / 20), watching the product take shape.",
  },
  {
    fr: "Code, accès et comptes à toi dès le premier jour. Zéro dépendance.",
    en: "Code, access and accounts are yours from day one. Zero lock-in.",
  },
];
