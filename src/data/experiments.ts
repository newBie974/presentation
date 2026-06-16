import type { Experiment } from "@/types";

export const experiments: Experiment[] = [
  {
    slug: "world-cup-ia-prono",
    title: "World Cup IA Prono",
    tagline: {
      fr: "Claude vs GPT vs Gemini pronostiquent la Coupe du Monde, en live.",
      en: "Claude vs GPT vs Gemini predict the World Cup, live.",
    },
    url: "https://newbie974.github.io/world-cup-ia-prono/",
    date: "2026-06",
    techStack: ["Vanilla JS", "Flue", "Gemini"],
    repoUrl: "https://github.com/newBie974/world-cup-ia-prono",
    articleHref: {
      fr: "/notes/2026-06-ia-prono-coupe-du-monde",
      en: "/en/writing/2026-06-ai-world-cup-predictions",
    },
  },
];
