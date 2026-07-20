import type { Project } from "@/types";
import tooktaLogo from "@/assets/tookta.png";
import carouboltLogo from "@/assets/caroubolt-logo.png";
import voicejournalLogo from "@/assets/voicejournal-logo.png";
import karibteckLogo from "@/assets/karibteck-logo.svg";
import tibougLogo from "@/assets/tiboug-logo.png";

export const projects: Project[] = [
  {
    slug: "tiboug",
    title: "Ti Boug",
    tagline: {
      fr: "Le vrai prix des fruits & légumes à La Réunion, contre la vie chère.",
      en: "The real price of fruit & veg in Réunion — against the high cost of living.",
    },
    url: "https://tiboug.re",
    status: "live",
    techStack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Convex",
      "RevenueCat",
      "Gemini AI",
    ],
    platform: ["ios"],
    appStoreUrl:
      "https://apps.apple.com/fr/app/ti-boug-prix-march%C3%A9-974/id6782078868",
    logo: tibougLogo,
  },
  {
    slug: "karibteck",
    title: "KaribTeck",
    tagline: {
      fr: "L'agence web qu'on bâtit aux Antilles : sites, apps mobiles et agents IA.",
      en: "The web agency we're building in the French West Indies: sites, mobile apps and AI agents.",
    },
    url: "https://karibteck.com",
    status: "live",
    techStack: ["Astro", "TypeScript", "Tailwind CSS", "MDX"],
    platform: ["web"],
    logo: karibteckLogo,
  },
  {
    slug: "voicejournal",
    title: "VoiceJournal",
    tagline: {
      fr: "Transforme ta voix en journal quotidien, propulsé par l'IA.",
      en: "Turn your voice into a daily journal, powered by AI.",
    },
    url: "https://aivoicejournal.app",
    status: "live",
    techStack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "RevenueCat",
      "Claude AI",
    ],
    platform: ["ios"],
    appStoreUrl:
      "https://apps.apple.com/fr/app/voicejournal-journal-vocal-ia/id6762176421",
    logo: voicejournalLogo,
  },
  {
    slug: "caroubolt",
    title: "Caroubolt",
    tagline: {
      fr: "L'IA t'aide à créer les meilleurs carrousels pour TikTok et Instagram.",
      en: "AI helps you create the best carousels for TikTok and Instagram.",
    },
    url: "https://caroubolt.com",
    status: "archived",
    techStack: ["Next.js", "TypeScript", "Supabase", "Stripe", "Gemini AI"],
    platform: ["web"],
    logo: carouboltLogo,
  },
  {
    slug: "tookta",
    title: "Tookta",
    tagline: {
      fr: "Trouve l'activité parfaite pour tes enfants, sans effort.",
      en: "Find the perfect activity for your kids, effortlessly.",
    },
    url: "https://tookta.fr",
    status: "live",
    techStack: ["Flutter", "Nest", "TypeScript", "Typesense"],
    platform: ["ios", "android"],
    appStoreUrl: "https://apps.apple.com/fr/app/tookta/id6474099484",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.tookta.fr",
    logo: tooktaLogo,
  },
];
