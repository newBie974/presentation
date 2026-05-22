import { renderOg } from "@/lib/ogImage";

export async function GET() {
  const png = await renderOg({
    title: "Aymeric Dijoux — Indie builder & engineer.",
    subtitle: "AYMERIC.DIJOUX.DEV",
    badge: "PORTFOLIO",
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
