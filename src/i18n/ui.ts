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
    "cta.visitSite": "Voir le site",
    "cta.demo": "Démo",
    "cta.code": "Code",
    "cta.viewAllLab": "Voir tout le lab",
    "section.lab": "Le lab",
    "section.builds": "Ce que je construis",
    "section.latestNotes": "Dernières notes",
    "section.allNotes": "Toutes les notes",
    "section.about": "À propos",
    "social.follow": "Suivre",
    "status.live": "Live",
    "status.building": "En cours",
    "status.dispoLabel": "Dispo S2 2026 · 1 slot",
    "footer.copy": "© 2026 Aymeric Dijoux · La Réunion & Paris",
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
    "cta.visitSite": "Visit site",
    "cta.demo": "Demo",
    "cta.code": "Code",
    "cta.viewAllLab": "See the whole lab",
    "section.lab": "The lab",
    "section.builds": "What I'm building",
    "section.latestNotes": "Latest writing",
    "section.allNotes": "All writing",
    "section.about": "About",
    "social.follow": "Follow",
    "status.live": "Live",
    "status.building": "Building",
    "status.dispoLabel": "Available H2 2026 · 1 slot",
    "footer.copy": "© 2026 Aymeric Dijoux · La Réunion & Paris",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)["fr"];

export const routes = {
  fr: {
    home: "/",
    about: "/a-propos",
    notes: "/notes",
    work: "/collaborer",
    now: "/now",
    lab: "/lab",
  },
  en: {
    home: "/en/",
    about: "/en/about",
    notes: "/en/writing",
    work: "/en/work",
    now: "/en/now",
    lab: "/en/lab",
  },
} as const;
