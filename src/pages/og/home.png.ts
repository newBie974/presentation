import { renderOg } from "@/lib/ogImage";

export async function GET() {
  const png = await renderOg({
    title: "I build the apps I wish existed.",
    subtitle: "INDIE BUILDER · ENGINEER · PARIS",
    badge: "BUILDER · 2026",
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
