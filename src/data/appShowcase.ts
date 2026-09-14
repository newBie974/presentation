import type { AppShowcasePanel } from "@/types";
import noanFront from "@/assets/showcase/noan-1.jpg";
import noanBack from "@/assets/showcase/noan-2.jpg";
import voicejournalFront from "@/assets/showcase/voicejournal-1.jpg";
import voicejournalBack from "@/assets/showcase/voicejournal-2.jpg";
import tibougFront from "@/assets/showcase/tiboug-1.jpg";
import tibougBack from "@/assets/showcase/tiboug-2.jpg";
import tooktaFront from "@/assets/showcase/tookta-1.jpg";
import tooktaBack from "@/assets/showcase/tookta-2.jpg";

const SINCE = { fr: "En ligne depuis", en: "Live since" };
const VERSION = { fr: "Version", en: "Version" };
const RATING = { fr: "Note App Store", en: "App Store rating" };
const CATEGORY = { fr: "Catégorie", en: "Category" };

/** Ordre d'apparition des panneaux sur la vitrine. Seules les apps mobiles y
 *  figurent : la vitrine repose sur de vraies captures d'écran.
 *
 *  Les `stats` sont un relevé des fiches App Store au 2026-09-14
 *  (itunes.apple.com/lookup). Elles ne se mettent pas à jour toutes seules :
 *  à rafraîchir quand une app change de version ou passe un cap d'avis. Noan
 *  et Ti Boug n'ont pas encore d'avis, d'où la catégorie à la place. */
export const appShowcase: AppShowcasePanel[] = [
  {
    slug: "noan",
    brand: "noan",
    frontScreen: noanFront,
    backScreen: noanBack,
    screenLabels: {
      front: { fr: "le tableau de bord", en: "the dashboard" },
      back: { fr: "la liste de courses", en: "the shopping list" },
    },
    stats: [
      { label: SINCE, value: { fr: "Septembre 2026", en: "September 2026" } },
      { label: VERSION, value: { fr: "1.1.0", en: "1.1.0" } },
      { label: CATEGORY, value: { fr: "Productivité", en: "Productivity" } },
    ],
  },
  {
    slug: "voicejournal",
    brand: "voicejournal",
    frontScreen: voicejournalFront,
    backScreen: voicejournalBack,
    screenLabels: {
      front: { fr: "une entrée de journal", en: "a journal entry" },
      back: { fr: "l'analyse des humeurs", en: "the mood analysis" },
    },
    stats: [
      { label: SINCE, value: { fr: "Avril 2026", en: "April 2026" } },
      {
        label: RATING,
        value: { fr: "5,0 ★ · 13 avis", en: "5.0 ★ · 13 ratings" },
      },
      { label: VERSION, value: { fr: "1.5.0", en: "1.5.0" } },
    ],
  },
  {
    slug: "tiboug",
    brand: "tiboug",
    frontScreen: tibougFront,
    backScreen: tibougBack,
    screenLabels: {
      front: { fr: "les bons plans du jour", en: "today's best prices" },
      back: { fr: "l'assistant marché péi", en: "the local market assistant" },
    },
    stats: [
      { label: SINCE, value: { fr: "Juillet 2026", en: "July 2026" } },
      { label: VERSION, value: { fr: "1.0", en: "1.0" } },
      { label: CATEGORY, value: { fr: "Shopping", en: "Shopping" } },
    ],
  },
  {
    slug: "tookta",
    brand: "tookta",
    frontScreen: tooktaFront,
    backScreen: tooktaBack,
    screenLabels: {
      front: { fr: "la carte des sorties", en: "the activity map" },
      back: { fr: "une fiche activité", en: "an activity page" },
    },
    stats: [
      { label: SINCE, value: { fr: "Mai 2024", en: "May 2024" } },
      {
        label: RATING,
        value: { fr: "4,4 ★ · 19 avis", en: "4.4 ★ · 19 ratings" },
      },
      { label: VERSION, value: { fr: "1.0.1", en: "1.0.1" } },
    ],
  },
];
