import type { GetStaticPaths } from "astro";
import { renderOg } from "@/lib/ogImage";
import { loadPublishedNotes, getNoteSlug, type NoteEntry } from "@/lib/notes";
import { formatDateISO } from "@/lib/dates";

export const getStaticPaths: GetStaticPaths = async () => {
  const notes = await loadPublishedNotes("en");
  return notes.map((note) => ({
    params: { slug: getNoteSlug(note) },
    props: { note },
  }));
};

interface Props {
  note: NoteEntry;
}

export async function GET({ props }: { props: Props }) {
  const { note } = props;
  const tag = note.data.tags[0]?.toUpperCase() ?? "NOTE";
  const png = await renderOg({
    title: note.data.title,
    subtitle: `EN · ${formatDateISO(note.data.date)} · AYMERIC.DIJOUX.DEV`,
    badge: tag,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
