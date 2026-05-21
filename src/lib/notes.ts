import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/types";
import { computeReadingTime } from "./readingTime";

export type NoteEntry = CollectionEntry<"notes">;

export function getNoteSlug(entry: NoteEntry): string {
  // Glob loader prefixes ids with the relative path (e.g. "fr/2026-04-hello")
  // — strip the locale folder to get the public slug.
  return entry.id.replace(/^(fr|en)\//, "");
}

export async function loadPublishedNotes(locale: Locale): Promise<NoteEntry[]> {
  const all = await getCollection(
    "notes",
    ({ data }) => !data.draft && data.locale === locale,
  );
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function loadLatestNotes(
  locale: Locale,
  limit: number,
): Promise<NoteEntry[]> {
  const notes = await loadPublishedNotes(locale);
  return notes.slice(0, limit);
}

export async function findTranslation(
  translationKey: string,
  targetLocale: Locale,
): Promise<NoteEntry | undefined> {
  const all = await getCollection(
    "notes",
    ({ data }) => !data.draft && data.locale === targetLocale,
  );
  return all.find((entry) => entry.data.translationKey === translationKey);
}

export async function listAllTags(locale: Locale): Promise<string[]> {
  const notes = await loadPublishedNotes(locale);
  const tags = new Set<string>();
  notes.forEach((n) => n.data.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getNoteReadingTime(entry: NoteEntry): {
  minutes: number;
  words: number;
} {
  return computeReadingTime(entry.body ?? "");
}

export function buildNoteUrl(entry: NoteEntry): string {
  const slug = getNoteSlug(entry);
  return entry.data.locale === "fr" ? `/notes/${slug}` : `/en/writing/${slug}`;
}
