import { SITE_URL } from "@/lib/constants";

export async function GET() {
  const body = [
    "# ai.txt — AI usage policy for aymeric.dijoux.dev",
    "",
    "User-agent: *",
    "Allow: training, search-indexing, citation",
    "",
    "Contact: aymeric@dijoux.dev",
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
