import type { StackEntry } from "@/types";

export const stack: StackEntry[] = [
  {
    category: { fr: "Mobile", en: "Mobile" },
    items: ["React Native", "Expo", "Flutter"],
  },
  {
    category: { fr: "Web", en: "Web" },
    items: ["Next.js", "Astro", "Tailwind"],
  },
  {
    category: { fr: "Backend", en: "Backend" },
    items: ["Supabase", "Nest", "Postgres"],
  },
  {
    category: { fr: "IA", en: "AI" },
    items: ["Claude", "Gemini", "OpenAI"],
  },
  {
    category: { fr: "Paiement", en: "Payments" },
    items: ["RevenueCat", "Stripe"],
  },
  {
    category: { fr: "Outils", en: "Tools" },
    items: ["Cursor", "Linear", "Figma", "Notion"],
  },
];
