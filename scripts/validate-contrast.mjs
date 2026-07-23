#!/usr/bin/env node
// Pure-Node WCAG contrast gate for the design tokens in theme.css.
// Resolves color-mix(... transparent) tints over their base so tinted pills
// are checked the same way a browser would — no Playwright/Chromium needed.
import { readFile } from "node:fs/promises";

const THEME_PATH = "src/styles/theme.css";
const AA_NORMAL = 4.5;

// Real foreground/background pairs used in the UI (single dark theme).
const CHECKS = [
  { id: "body text", fg: "color-text", bg: solid("color-bg") },
  { id: "muted on bg", fg: "color-text-muted", bg: solid("color-bg") },
  {
    id: "muted on bg-soft",
    fg: "color-text-muted",
    bg: solid("color-bg-soft"),
  },
  { id: "faint on bg", fg: "color-text-faint", bg: solid("color-bg") },
  {
    id: "faint on bg-soft",
    fg: "color-text-faint",
    bg: solid("color-bg-soft"),
  },
  {
    id: "faint on bg-raised",
    fg: "color-text-faint",
    bg: solid("color-bg-raised"),
  },
  { id: "accent link on bg", fg: "color-accent", bg: solid("color-bg") },
  { id: "primary CTA", fg: "color-on-accent", bg: solid("color-accent") },
  {
    id: "status.live pill",
    fg: "color-success",
    bg: tint("color-success", 14, "color-bg-soft"),
  },
  {
    id: "status.building pill",
    fg: "color-building",
    bg: tint("color-building", 16, "color-bg-soft"),
  },
  {
    id: "accent pill",
    fg: "color-accent",
    bg: tint("color-accent", 10, "color-bg-soft"),
  },
  { id: "danger on bg", fg: "color-danger", bg: solid("color-bg") },
];

function solid(token) {
  return { token };
}
function tint(token, percent, over) {
  return { token, percent, over };
}

function parseBlocks(css) {
  const blocks = {};
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls = {};
    for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      decls[name] = value.trim();
    }
    blocks[selector.trim()] = decls;
  }
  return blocks;
}

function buildTokens(css) {
  const blocks = parseBlocks(css);
  const key = Object.keys(blocks).find((k) => k.includes("@theme"));
  return blocks[key];
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const full =
    value.length === 3 ? [...value].map((c) => c + c).join("") : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function mixOverBase([r, g, b], alpha, [br, bg, bb]) {
  const blend = (c, base) => Math.round(c * alpha + base * (1 - alpha));
  return [blend(r, br), blend(g, bg), blend(b, bb)];
}

function resolveBg(spec, tokens) {
  if (spec.percent === undefined) return hexToRgb(tokens[spec.token]);
  const color = hexToRgb(tokens[spec.token]);
  return mixOverBase(color, spec.percent / 100, hexToRgb(tokens[spec.over]));
}

function relativeLuminance([r, g, b]) {
  const toLinear = (c) => {
    const channel = c / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg, bg) {
  const [light, dark] = [relativeLuminance(fg), relativeLuminance(bg)].sort(
    (a, b) => b - a,
  );
  return (light + 0.05) / (dark + 0.05);
}

function evaluate(check, tokens) {
  const ratio = contrastRatio(
    hexToRgb(tokens[check.fg]),
    resolveBg(check.bg, tokens),
  );
  return { ratio, passed: ratio >= AA_NORMAL };
}

const css = await readFile(THEME_PATH, "utf8");
const tokens = buildTokens(css);
let failed = 0;

for (const check of CHECKS) {
  const { ratio, passed } = evaluate(check, tokens);
  const mark = passed ? "✓" : "✗";
  const line = `${mark} ${check.id.padEnd(24)} ${ratio.toFixed(2)}:1 (min ${AA_NORMAL})`;
  if (passed) console.log(line);
  else {
    console.error(line);
    failed++;
  }
}

if (failed > 0) {
  console.error(
    `\n${failed} contrast issue(s) below WCAG AA — fix the token in ${THEME_PATH}`,
  );
  process.exit(1);
}
console.log(`\n✓ Contrast validation passed (${CHECKS.length} token pairs)`);
