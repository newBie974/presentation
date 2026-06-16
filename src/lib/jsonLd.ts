import type { Locale } from "@/types";
import { SITE_URL, SITE_NAME, PERSON_ID, WEBSITE_ID } from "./constants";
import { socialLinks } from "@/data/socialLinks";
import { projects } from "@/data/projects";
import { experiments } from "@/data/experiments";

const KNOWS_ABOUT = [
  "AI app development",
  "AI agents",
  "LLM applications",
  "RAG",
  "Claude / Anthropic",
  "AI prototyping",
  "Indie hacking",
  "Consumer app development",
  "React Native",
  "Flutter",
  "Astro",
  "Next.js",
  "Supabase",
  "TypeScript",
];

const AREA_SERVED = ["La Réunion", "France", "Worldwide (remote)"];

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    givenName: "Aymeric",
    familyName: "Dijoux",
    jobTitle: "AI app builder & software engineer",
    description:
      "Aymeric Dijoux is a freelance AI app builder and software engineer based in Réunion Island (France) and Paris. He ships consumer apps (VoiceJournal, Caroubolt, Tookta), builds AI agents and RAG systems, and helps select teams as a freelancer — remote worldwide.",
    url: SITE_URL,
    image: `${SITE_URL}/avatar.png`,
    address: {
      "@type": "PostalAddress",
      addressRegion: "La Réunion",
      addressCountry: "FR",
    },
    homeLocation: [
      { "@type": "Place", name: "La Réunion, France" },
      { "@type": "Place", name: "Paris, France" },
    ],
    workLocation: { "@type": "Place", name: "Remote (worldwide)" },
    worksFor: { "@type": "Organization", name: "Decider.ai" },
    knowsAbout: KNOWS_ABOUT,
    sameAs: socialLinks.map((l) => l.url),
  };
}

const SERVICE_DESCRIPTION = {
  fr: "Développeur freelance expert apps IA, basé à La Réunion et Paris. MVP mobile/web en 6-8 semaines, prototypes IA, renfort tech — en remote partout.",
  en: "Freelance developer and AI app expert, based in Réunion Island and Paris. Mobile/web MVPs in 6-8 weeks, AI prototypes, tech rescue — remote everywhere.",
};

export function buildProfessionalServiceJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#freelance-service`,
    name: "Aymeric Dijoux — Freelance AI app builder",
    description: SERVICE_DESCRIPTION[locale],
    url: `${SITE_URL}${locale === "fr" ? "/collaborer" : "/en/work"}`,
    provider: { "@id": PERSON_ID },
    areaServed: AREA_SERVED,
    serviceType: [
      "Mobile app development",
      "Web app development",
      "AI prototyping",
      "Freelance software engineering",
    ],
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
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
  dateModified?: Date;
  image?: string;
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
    mainEntityOfPage: args.url,
    datePublished: args.datePublished.toISOString(),
    dateModified: (args.dateModified ?? args.datePublished).toISOString(),
    ...(args.image ? { image: args.image } : {}),
    inLanguage: args.locale === "fr" ? "fr-FR" : "en-US",
    keywords: args.tags.join(", "),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

interface BlogPostRef {
  title: string;
  url: string;
  datePublished: Date;
  description: string;
}

export function buildBlogJsonLd(
  posts: BlogPostRef[],
  locale: Locale,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: SITE_NAME,
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: post.url,
      datePublished: post.datePublished.toISOString(),
      description: post.description,
    })),
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

export function buildLabItemListJsonLd(locale: Locale) {
  const labUrl = `${SITE_URL}${locale === "fr" ? "/lab" : "/en/lab"}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${labUrl}#lab`,
    url: labUrl,
    name: "Lab — Aymeric Dijoux",
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: experiments.map((exp, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: exp.title,
        url: exp.url,
      })),
    },
  };
}
