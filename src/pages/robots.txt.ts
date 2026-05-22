import { SITE_URL } from "@/lib/constants";

const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export async function GET() {
  const body = [
    "# robots.txt — aymeric.dijoux.dev",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    ...AI_AGENTS.flatMap((ua) => [`User-agent: ${ua}`, "Allow: /", ""]),
    "User-agent: Bytespider",
    "Disallow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
