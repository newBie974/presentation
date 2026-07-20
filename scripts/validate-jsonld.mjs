#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name === "index.html") yield path;
  }
}

let failed = 0;
let checked = 0;

for await (const file of walk(DIST)) {
  const html = await readFile(file, "utf8");
  // Astro redirect stubs are minimal `<meta http-equiv="refresh">` pages with
  // no content of their own — they carry no JSON-LD by design, so skip them.
  if (/<meta[^>]+http-equiv="refresh"/i.test(html)) continue;
  checked++;
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
  const types = new Set();
  for (const [, body] of blocks) {
    try {
      const data = JSON.parse(body);
      const arr = Array.isArray(data) ? data : [data];
      arr.forEach((node) => node["@type"] && types.add(node["@type"]));
    } catch (e) {
      console.error(`✗ ${file} — invalid JSON-LD: ${e.message}`);
      failed++;
    }
  }
  if (!types.has("Person")) {
    console.error(`✗ ${file} — missing Person JSON-LD`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} JSON-LD issue(s) found in ${checked} pages`);
  process.exit(1);
}
console.log(`✓ JSON-LD validation passed (${checked} pages)`);
