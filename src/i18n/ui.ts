export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const ui = {
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.notes": "Notes",
    "nav.work": "Collaborer",
    "cta.viewApps": "Voir mes apps",
    "cta.collaborate": "Collaborer",
    "cta.bookCall": "Réserver un call",
    "cta.readArticle": "Lire l'article",
    "cta.readMore": "Lire l'histoire complète",
    "section.builds": "Ce que je construis",
    "section.latestNotes": "Dernières notes",
    "section.allNotes": "Toutes les notes",
    "section.about": "À propos",
    "social.follow": "Suivre",
    "status.live": "Live",
    "status.building": "En cours",
    "status.dispoLabel": "Dispo S2 2026 · 1 slot",
    "footer.copy": "© 2026 Aymeric Dijoux · Paris",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.notes": "Writing",
    "nav.work": "Work together",
    "cta.viewApps": "See my apps",
    "cta.collaborate": "Work together",
    "cta.bookCall": "Book a call",
    "cta.readArticle": "Read the article",
    "cta.readMore": "Read the full story",
    "section.builds": "What I'm building",
    "section.latestNotes": "Latest writing",
    "section.allNotes": "All writing",
    "section.about": "About",
    "social.follow": "Follow",
    "status.live": "Live",
    "status.building": "Building",
    "status.dispoLabel": "Available H2 2026 · 1 slot",
    "footer.copy": "© 2026 Aymeric Dijoux · Paris",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)["fr"];

export const routes = {
  fr: { home: "/", about: "/a-propos", notes: "/notes", work: "/collaborer" },
  en: {
    home: "/en/",
    about: "/en/about",
    notes: "/en/writing",
    work: "/en/work",
  },
} as const;
