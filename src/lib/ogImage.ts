import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let cachedFonts: { interBold: Buffer; mono: Buffer } | null = null;

function loadFonts() {
  if (cachedFonts) return cachedFonts;
  const interBoldPath =
    require.resolve("@fontsource/inter-tight/files/inter-tight-latin-700-normal.woff");
  const monoPath =
    require.resolve("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff");
  cachedFonts = {
    interBold: readFileSync(interBoldPath),
    mono: readFileSync(monoPath),
  };
  return cachedFonts;
}

export interface OgImageArgs {
  title: string;
  subtitle: string;
  badge?: string;
}

export async function renderOg(args: OgImageArgs): Promise<Buffer> {
  const { interBold, mono } = loadFonts();
  const titleSize =
    args.title.length > 60 ? 56 : args.title.length > 40 ? 68 : 80;

  const markup = html(`
    <div style="display:flex;flex-direction:column;justify-content:space-between;width:1200px;height:630px;padding:64px;background:#f6f6f4;border:8px solid #0a0a0a;color:#0a0a0a;font-family:Inter;">
      <div style="display:flex;justify-content:space-between;align-items:center;width:1072px;">
        <div style="font-family:Mono;font-size:22px;letter-spacing:0.12em;color:#404040;">
          AYMERIC.DIJOUX.DEV
        </div>
        ${
          args.badge
            ? `<div style="font-family:Mono;font-size:16px;background:#ccff00;color:#0a0a0a;padding:8px 14px;letter-spacing:0.12em;font-weight:700;">${escape(args.badge)}</div>`
            : ""
        }
      </div>
      <div style="display:flex;font-size:${titleSize}px;font-weight:700;line-height:0.96;letter-spacing:-0.04em;max-width:1072px;">
        ${escape(args.title)}
      </div>
      <div style="font-family:Mono;font-size:20px;letter-spacing:0.08em;color:#404040;">
        ${escape(args.subtitle)}
      </div>
    </div>
  `);

  const svg = await satori(markup as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: interBold, weight: 700, style: "normal" },
      { name: "Mono", data: mono, weight: 400, style: "normal" },
    ],
  });

  return Buffer.from(new Resvg(svg).render().asPng());
}

function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
