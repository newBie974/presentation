import type { Project } from "../types/index";
import tooktaLogo from "../assets/tookta.png";
import carouboltLogo from "../assets/caroubolt-logo.png";
import voicejournalLogo from "../assets/voicejournal-logo.png";

export const projects: Project[] = [
  {
    title: "VoiceJournal",
    tagline: "Turn your voice into a daily journal, powered by AI",
    url: "https://aivoicejournal.app",
    status: "live",
    techStack: ["React Native", "Expo", "TypeScript", "Supabase", "RevenueCat", "Claude AI"],
    appStoreUrl: "https://apps.apple.com/fr/app/voicejournal-journal-vocal-ia/id6762176421",
    logo: voicejournalLogo,
  },
  {
    title: "Caroubolt",
    tagline: "Ai helps you to create the best carroussel for Tiktok, Instagram",
    url: "https://caroubolt.com",
    status: "live",
    techStack: ["Next.js", "TypeScript", "Supabase", "Stripe", "Gemini AI"],
    logo: carouboltLogo,
  },
  {
    title: "Tookta",
    tagline: "Find the perfect activity for your kids, effortlessly",
    url: "https://tookta.fr",
    status: "live",
    techStack: ["Flutter", "Nest", "TypeScript", "Typesense"],
    appStoreUrl: "https://apps.apple.com/fr/app/tookta/id6474099484",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.tookta.fr",
    logo: tooktaLogo,
  },
];
