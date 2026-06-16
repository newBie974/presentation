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
  {
    slug: "learn-english",
    title: "Mes mots d'anglais",
    tagline: {
      fr: "3000 mots d'anglais en cartes mémoire, sans compte ni serveur.",
      en: "The 3000 most useful English words as flashcards — no account, no server.",
    },
    url: "https://newbie974.github.io/learn-english/",
    date: "2026-06",
    techStack: ["Vanilla JS", "Leitner SRS", "GitHub Pages"],
    repoUrl: "https://github.com/newBie974/learn-english",
    articleHref: {
      fr: "/notes/2026-06-app-3000-mots-anglais",
      en: "/en/writing/2026-06-3000-english-words-app",
    },
  },
];
