import { SITE_URL } from "./constants";
import {
  routes,
  alternateLocale,
  localizePath,
  alternateUrl,
} from "@/i18n/utils";
import type { Locale } from "@/types";

type RouteKey = keyof (typeof routes)["fr"];

interface HreflangArgs {
  locale: Locale;
  canonical: string;
  routeKey?: RouteKey;
  alternatePath?: string | null;
}

export interface HreflangLink {
  hreflang: string;
  href: string;
}

function toAbsolute(pathOrUrl: string): string {
  const url = new URL(pathOrUrl, SITE_URL);
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url.href;
}

function resolveAlternateHref(
  locale: Locale,
  routeKey?: RouteKey,
  alternatePath?: string | null,
): string | null {
  if (routeKey) return toAbsolute(alternateUrl(routeKey, locale));
  if (alternatePath) return toAbsolute(alternatePath);
  return null;
}

function resolveXDefault(
  locale: Locale,
  canonical: string,
  routeKey?: RouteKey,
  alternateHref?: string | null,
): string {
  if (routeKey) return toAbsolute(localizePath(routeKey, "fr"));
  if (locale === "fr") return canonical;
  return alternateHref ?? canonical;
}

export function buildHreflangLinks(args: HreflangArgs): HreflangLink[] {
  const { locale, canonical, routeKey, alternatePath } = args;
  const alternateHref = resolveAlternateHref(locale, routeKey, alternatePath);

  const links: HreflangLink[] = [{ hreflang: locale, href: canonical }];
  if (alternateHref) {
    links.push({ hreflang: alternateLocale(locale), href: alternateHref });
  }
  links.push({
    hreflang: "x-default",
    href: resolveXDefault(locale, canonical, routeKey, alternateHref),
  });
  return links;
}
