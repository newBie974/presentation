import { ui, routes, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./ui";
import type { Locale, UiKey } from "./ui";

export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split("/");
  if ((SUPPORTED_LOCALES as readonly string[]).includes(first))
    return first as Locale;
  return DEFAULT_LOCALE;
}

export function useTranslations(locale: Locale) {
  function t(key: UiKey): string {
    return ui[locale][key] ?? ui[DEFAULT_LOCALE][key];
  }
  t.path = (route: keyof (typeof routes)["fr"]) => routes[locale][route];
  return t;
}

export function localizePath(
  route: keyof (typeof routes)["fr"],
  locale: Locale,
): string {
  return routes[locale][route];
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}

export function alternateUrl(
  route: keyof (typeof routes)["fr"],
  locale: Locale,
): string {
  return routes[alternateLocale(locale)][route];
}

export { ui, routes };
export type { Locale, UiKey };
