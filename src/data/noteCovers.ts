import type { ImageMetadata } from "astro";
import tibougPanier from "@/assets/mascot/ti-boug-panier.png";

/** Maps a note's frontmatter `cover` string to an imported asset for astro:assets. */
export const noteCovers: Record<string, ImageMetadata> = {
  "tiboug-panier": tibougPanier,
};
