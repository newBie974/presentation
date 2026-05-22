import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { loadPublishedNotes, buildNoteUrl } from "@/lib/notes";

export async function GET() {
  const frNotes = await loadPublishedNotes("fr");

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${profile.bio.en}`,
    "",
    "## About",
    "- Aymeric Dijoux — indie builder & software engineer based in Paris",
    "- Builds consumer apps: VoiceJournal, Caroubolt, Tookta",
    "- Available for select freelance projects (mobile, web, AI prototypes)",
    "",
    "## Apps",
    ...projects.map((p) => `- [${p.title}](${p.url}): ${p.tagline.en}`),
    "",
    "## Key pages",
    `- [Home](${SITE_URL}/): apps showcase, latest writing, freelance pitch`,
    `- [About](${SITE_URL}/en/about): path, philosophy, stack`,
    `- [Writing](${SITE_URL}/en/writing): notes and essays`,
    `- [Work together](${SITE_URL}/en/work): services, process, FAQ, booking`,
    "",
    "## Latest writing",
    ...frNotes
      .slice(0, 5)
      .map((n) => `- [${n.data.title}](${SITE_URL}${buildNoteUrl(n)})`),
    "",
    "## Contact",
    `- Email: ${profile.email ?? "aymeric@dijoux.dev"}`,
    "- Book a call: https://cal.eu/aymeric-dijoux/intro",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
