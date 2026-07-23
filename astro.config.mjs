// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";

const SITE = "https://aymeric.dijoux.dev";

// Wrap each Markdown <table> in a scrollable div so wide tables scroll inside
// their own box instead of pushing horizontal overflow onto the page body.
function rehypeTableScroll() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      walk(child);
      if (child.type === "element" && child.tagName === "table") {
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"] },
          children: [child],
        };
      }
      return child;
    });
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// FR ↔ EN slugs differ, so the default prefix-based i18n sitemap can't pair
// them. Declare the real translation pairs and inject reciprocal hreflang.
const I18N_PAIRS = [
  ["/", "/en/"],
  ["/a-propos/", "/en/about/"],
  ["/collaborer/", "/en/work/"],
  ["/notes/", "/en/writing/"],
  ["/now/", "/en/now/"],
  ["/lab/", "/en/lab/"],
];

/** @param {string} pathname */
function i18nLinksFor(pathname) {
  // Dynamic app detail pages: /apps/<slug>/ ↔ /en/apps/<slug>/
  const appMatch = pathname.match(/^\/(?:en\/)?apps\/([^/]+)\/?$/);
  if (appMatch) {
    const slug = appMatch[1];
    return [
      { lang: "fr-FR", url: `${SITE}/apps/${slug}/` },
      { lang: "en-US", url: `${SITE}/en/apps/${slug}/` },
    ];
  }
  const pair = I18N_PAIRS.find(
    ([fr, en]) => fr === pathname || en === pathname,
  );
  if (!pair) return undefined;
  return [
    { lang: "fr-FR", url: SITE + pair[0] },
    { lang: "en-US", url: SITE + pair[1] },
  ];
}

// 2026-07 tag taxonomy cleanup: merged `ai`→`ia` and dropped the thin long-tail.
// Redirect the removed tag URLs so any indexed/linked ones don't 404.
const REMOVED_TAGS = [
  "app-store", "astro", "backend", "data", "design",
  "freelance", "geo", "launch", "remote", "web",
];
const TAG_REDIRECTS = Object.fromEntries([
  ["/notes/tags/ai", "/notes/tags/ia"],
  ["/en/writing/tags/ai", "/en/writing/tags/ia"],
  ...REMOVED_TAGS.flatMap((t) => [
    [`/notes/tags/${t}`, "/notes/tags"],
    [`/en/writing/tags/${t}`, "/en/writing/tags"],
  ]),
]);

export default defineConfig({
  output: "static",
  site: "https://aymeric.dijoux.dev",
  base: "/",
  redirects: TAG_REDIRECTS,
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const links = i18nLinksFor(new URL(item.url).pathname);
        if (links) item.links = links;
        return item;
      },
    }),
    icon({ include: { lucide: ["*"], "simple-icons": ["*"] } }),
  ],
  markdown: {
    // Astro 6 deprecated markdown.remarkPlugins / mdx({ remarkPlugins }) in favour
    // of a unified() processor from @astrojs/markdown-remark. gfm defaults to true,
    // so remark-gfm is no longer passed explicitly. shikiConfig still applies.
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          { target: "_blank", rel: ["noopener", "noreferrer"] },
        ],
        rehypeTableScroll,
      ],
    }),
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
