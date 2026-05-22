import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { services } from "@/data/services";
import { loadPublishedNotes, buildNoteUrl } from "@/lib/notes";

export async function GET() {
  const enNotes = await loadPublishedNotes("en");
  const parts: string[] = [];

  parts.push(`# ${SITE_NAME}\n\n${profile.bio.en}\n`);

  parts.push(`## Apps\n`);
  projects.forEach((p) => {
    parts.push(
      `### ${p.title}\n${p.tagline.en}\nURL: ${p.url}\nStack: ${p.techStack.join(
        ", ",
      )}\n`,
    );
  });

  parts.push(`## Stack\n`);
  stack.forEach((s) => parts.push(`- ${s.category.en}: ${s.items.join(", ")}`));

  parts.push(`\n## Services\n`);
  services.forEach((s) =>
    parts.push(`### ${s.title.en}\n${s.description.en}\n`),
  );

  parts.push(`\n## Recent writing\n`);
  enNotes.forEach((n) => {
    parts.push(
      `### ${n.data.title} (${n.data.date.toISOString().slice(0, 10)})\n${n.data.excerpt}\nURL: ${SITE_URL}${buildNoteUrl(n)}\n`,
    );
  });

  return new Response(parts.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
