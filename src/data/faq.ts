import type { FaqEntry } from "@/types";

export const faq: FaqEntry[] = [
  {
    q: {
      fr: "Tu es basé où ?",
      en: "Where are you based?",
    },
    a: {
      fr: "Je suis Réunionnais, basé entre La Réunion (974) et Paris. Je travaille en remote avec des clients partout en France et à l'international.",
      en: "I'm from Réunion Island, based between Réunion (974) and Paris. I work remotely with clients across France and internationally.",
    },
  },
  {
    q: {
      fr: "Tu bosses en remote ou sur place ?",
      en: "Do you work remote or on-site?",
    },
    a: {
      fr: "Les deux. 100% remote par défaut, déplacement Paris ou La Réunion possible pour kick-off ou jalons.",
      en: "Both. 100% remote by default, on-site in Paris or Réunion possible for kick-off or milestones.",
    },
  },
  {
    q: { fr: "Tu peux signer un NDA ?", en: "Can you sign an NDA?" },
    a: {
      fr: "Oui, sans souci. Modèle standard sur demande.",
      en: "Yes, no problem. Standard template on request.",
    },
  },
  {
    q: { fr: "Tu factures comment ?", en: "How do you bill?" },
    a: {
      fr: "Auto-entrepreneur français. TVA selon statut client. Mensuel ou par jalon.",
      en: "French sole proprietor. VAT depending on client status. Monthly or milestone-based.",
    },
  },
  {
    q: {
      fr: "Tu bosses sur ma stack ou la tienne ?",
      en: "Do you work on my stack or yours?",
    },
    a: {
      fr: "Ta stack si elle tient debout. Sinon je propose et on en parle.",
      en: "Your stack if it holds up. Otherwise I propose and we discuss.",
    },
  },
];
