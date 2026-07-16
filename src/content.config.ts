import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string().min(3),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    locale: z.enum(["fr", "en"]),
    translationKey: z.string(),
    excerpt: z.string().min(20),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { notes };
