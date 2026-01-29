import type { Project } from "../types/index";
import tooktaLogo from "../assets/tookta.png";

export const projects: Project[] = [
  {
    title: "Carrousel.ai",
    tagline: "Ai helps you to create the best carroussel for Tiktok, Instagram",
    url: "#",
    status: "building",
    techStack: ["", "", ""],
  },
  {
    title: "Tookta",
    tagline: "Find the perfect activity for your kids, effortlessly",
    url: "https://tookta.fr",
    status: "live",
    techStack: ["Flutter", "Nest", "TypeScript", "Typesense"],
    appStoreUrl: "https://apps.apple.com/fr/app/tookta/id6474099484",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.tookta.fr",
    logo: tooktaLogo,
  },
];
