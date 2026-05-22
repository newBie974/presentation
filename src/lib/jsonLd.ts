import type { Locale } from "@/types";
import { SITE_URL, SITE_NAME, PERSON_ID, WEBSITE_ID } from "./constants";
import { socialLinks } from "@/data/socialLinks";
import { projects } from "@/data/projects";

const KNOWS_ABOUT = [
  "Indie hacking",
  "Consumer app development",
  "React Native",
  "Flutter",
  "Astro",
  "Next.js",
  "AI products",
  "Supabase",
  "Mobile app design",
  "TypeScript",
];

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    givenName: "Aymeric",
    familyName: "Dijoux",
    jobTitle: "Indie builder & software engineer",
    description:
      "Aymeric Dijoux is an indie builder and software engineer based in Paris, building and shipping consumer apps (VoiceJournal, Caroubolt, Tookta) and helping select teams as a freelancer.",
    url: SITE_URL,
    image: `${SITE_URL}/avatar.webp`,
    homeLocation: { "@type": "Place", name: "Paris, France" },
    knowsAbout: KNOWS_ABOUT,
    sameAs: socialLinks.map((l) => l.url),
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": PERSON_ID },
    inLanguage: ["fr-FR", "en-US"],
  };
}

export function buildSoftwareAppJsonLd() {
  return projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#app-${project.slug}`,
    name: project.title,
    description: project.tagline.en,
    url: project.url,
    operatingSystem: project.platform.join(", "),
    applicationCategory: "Productivity",
    creator: { "@id": PERSON_ID },
  }));
}

interface BlogPostingArgs {
  title: string;
  description: string;
  url: string;
  datePublished: Date;
  locale: Locale;
  tags: string[];
}

export function buildBlogPostingJsonLd(args: BlogPostingArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    url: args.url,
    datePublished: args.datePublished.toISOString(),
    inLanguage: args.locale === "fr" ? "fr-FR" : "en-US",
    keywords: args.tags.join(", "),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
