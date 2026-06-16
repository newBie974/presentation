// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";

const SITE = "https://aymeric.dijoux.dev";

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
  const pair = I18N_PAIRS.find(
    ([fr, en]) => fr === pathname || en === pathname,
  );
  if (!pair) return undefined;
  return [
    { lang: "fr-FR", url: SITE + pair[0] },
    { lang: "en-US", url: SITE + pair[1] },
  ];
}

export default defineConfig({
  output: "static",
  site: "https://aymeric.dijoux.dev",
  base: "/",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeExternalLinks,
          { target: "_blank", rel: ["noopener", "noreferrer"] },
        ],
      ],
    }),
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
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
