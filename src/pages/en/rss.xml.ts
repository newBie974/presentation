import rss from "@astrojs/rss";
import { loadPublishedNotes, buildNoteUrl } from "@/lib/notes";
import { SITE_URL } from "@/lib/constants";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const notes = await loadPublishedNotes("en");
  return rss({
    title: "Aymeric Dijoux — Writing",
    description: "Build notes, lessons learned, and technical essays.",
    site: context.site ?? SITE_URL,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      description: note.data.excerpt,
      link: buildNoteUrl(note),
    })),
    customData: `<language>en-US</language>`,
  });
}
