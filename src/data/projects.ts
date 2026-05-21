import type { Project } from "@/types";
import tooktaLogo from "@/assets/tookta.png";
import carouboltLogo from "@/assets/caroubolt-logo.png";
import voicejournalLogo from "@/assets/voicejournal-logo.png";

export const projects: Project[] = [
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
    status: "live",
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
