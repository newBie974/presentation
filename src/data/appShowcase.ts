import type { AppShowcasePanel } from "@/types";
import noanFront from "@/assets/showcase/noan-1.jpg";
import noanBack from "@/assets/showcase/noan-2.jpg";
import voicejournalFront from "@/assets/showcase/voicejournal-1.jpg";
import voicejournalBack from "@/assets/showcase/voicejournal-2.jpg";
import tibougFront from "@/assets/showcase/tiboug-1.jpg";
import tibougBack from "@/assets/showcase/tiboug-2.jpg";
import tooktaFront from "@/assets/showcase/tookta-1.jpg";
import tooktaBack from "@/assets/showcase/tookta-2.jpg";

/** Ordre d'apparition des panneaux sur la home. Seules les apps mobiles y
 *  figurent : la vitrine repose sur de vraies captures d'écran. */
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
  },
];
