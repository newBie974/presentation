import type { Locale } from "@/i18n/utils";

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}
