import type { ImageMetadata } from "astro";

export type Locale = "fr" | "en";

export interface Profile {
  name: string;
  givenName: string;
  familyName: string;
  tagline: { fr: string; en: string };
  bio: { fr: string; en: string };
  location: string;
  email?: string;
}

export type AppStatus = "live" | "building" | "coming-soon" | "archived";

export interface Project {
  slug: string;
  title: string;
  tagline: { fr: string; en: string };
  url: string;
  status: AppStatus;
  techStack: string[];
  platform: ("ios" | "android" | "web")[];
  appStoreUrl?: string;
  playStoreUrl?: string;
  logo?: ImageMetadata;
}

export interface Experiment {
  slug: string;
  title: string;
  tagline: { fr: string; en: string };
  url: string;
  date: string; // "YYYY-MM" — used for descending sort
  techStack: string[];
  repoUrl?: string;
  articleHref?: { fr: string; en: string }; // localized path to a write-up note
}

export interface SocialLink {
  platform: "instagram" | "tiktok" | "linkedin" | "x" | "github";
  url: string;
  label: string;
}

export interface Chapter {
  yearsLabel: string;
  startYear: number;
  endYear: number | "now";
  title: { fr: string; en: string };
  role: { fr: string; en: string };
  body: { fr: string; en: string };
  highlights?: { fr: string; en: string }[];
  technologies?: string[];
}

export interface StackEntry {
  category: { fr: string; en: string };
  items: string[];
}

export interface Service {
  id: string;
  icon: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
}

export interface AppDetail {
  oneLiner: { fr: string; en: string };
  whatItIs: { fr: string; en: string };
  keyFeatures: { fr: string; en: string }[];
  targetUser: { fr: string; en: string };
  notable: { fr: string; en: string };
}

export interface OfferTier {
  id: string;
  name: { fr: string; en: string };
  pitch: { fr: string; en: string };
  priceFrom: number;
  duration: { fr: string; en: string };
  includes: { fr: string; en: string }[];
  featured?: boolean;
}

export interface SupportOffer {
  id: string;
  icon: string;
  name: { fr: string; en: string };
  price: { fr: string; en: string };
  note: { fr: string; en: string };
}

export interface FaqEntry {
  q: { fr: string; en: string };
  a: { fr: string; en: string };
}

export interface Testimonial {
  quote: string;
  author: string;
  role: { fr: string; en: string };
  company?: string;
  date?: string;
}
