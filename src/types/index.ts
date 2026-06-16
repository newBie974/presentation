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

export type AppStatus = "live" | "building" | "coming-soon";

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
