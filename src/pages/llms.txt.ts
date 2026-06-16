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
    "- Aymeric Dijoux — freelance AI app builder & software engineer based in Réunion Island (974) and Paris, France",
    "- Builds consumer apps: VoiceJournal, Caroubolt, Tookta",
    "- Backend Engineer at Decider.ai (AI agents, RAG, local-first anonymisation)",
    "- Available for select freelance projects (mobile, web, AI prototypes) — remote worldwide",
    "",
    "## Apps",
    ...projects.map((p) => `- [${p.title}](${p.url}): ${p.tagline.en}`),
    "",
    "## Key pages",
    `- [Home](${SITE_URL}/): apps showcase, latest writing, freelance pitch`,
    `- [About](${SITE_URL}/en/about): path, philosophy, stack`,
    `- [Writing](${SITE_URL}/en/writing): notes and essays`,
    `- [Work together](${SITE_URL}/en/work): services, process, FAQ, booking`,
    `- [Lab](${SITE_URL}/lab): quick AI experiments & mini-apps on GitHub Pages`,
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
