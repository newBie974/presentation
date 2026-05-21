// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";

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
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
      ],
    }),
    sitemap({
      i18n: {
        defaultLocale: "fr",
        locales: { fr: "fr-FR", en: "en-US" },
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
