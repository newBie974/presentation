// Canonical tag set (see 2026-07 taxonomy cleanup): the only tags allowed in note
// frontmatter, ordered by usage. Merged `ai`→`ia`; dropped the thin long-tail
// (web, app-store, remote, launch, geo, freelance, design, data, backend, astro).
export const PRIMARY_TAGS = [
  "ia",
  "claude",
  "process",
  "build",
  "mobile",
  "tools",
  "indie",
  "stack",
] as const;
