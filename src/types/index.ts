export interface Profile {
  name: string;
  tagline: string;
  avatarPath: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface Project {
  title: string;
  tagline: string;
  url: string;
  status: "live" | "building" | "coming-soon";
  techStack: string[];
  appStoreUrl?: string;
  playStoreUrl?: string;
  logo?: ImageMetadata;
}

import type { ImageMetadata } from "astro";
