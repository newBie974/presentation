import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "mvp",
    icon: "lucide:rocket",
    title: { fr: "MVP en 6-8 semaines", en: "MVP in 6-8 weeks" },
    description: {
      fr: "Du Figma à l'App Store. Mobile (RN/Flutter) ou web (Next/Astro).",
      en: "From Figma to the App Store. Mobile (RN/Flutter) or web (Next/Astro).",
    },
  },
  {
    id: "ai-proto",
    icon: "lucide:zap",
    title: { fr: "Prototype IA en 2 semaines", en: "AI prototype in 2 weeks" },
    description: {
      fr: "Tu as une idée d'app IA. Je te livre un proto fonctionnel pour décider.",
      en: "You have an AI app idea. I ship a working proto so you can decide.",
    },
  },
  {
    id: "rescue",
    icon: "lucide:wrench",
    title: { fr: "Renfort tech ponctuel", en: "Tech rescue mission" },
    description: {
      fr: "Ton équipe est bloquée. Je rentre, je débloque, je sors.",
      en: "Your team is stuck. I come in, unblock, leave.",
    },
  },
  {
    id: "consulting",
    icon: "lucide:message-circle",
    title: { fr: "Consulting / Pair design", en: "Consulting / Pair design" },
    description: {
      fr: "Sessions de 90 min : architecture, stack, choix produit.",
      en: "90-min sessions: architecture, stack, product decisions.",
    },
  },
];
