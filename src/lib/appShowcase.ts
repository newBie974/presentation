import { appDetails } from "@/data/appDetails";
import { appShowcase } from "@/data/appShowcase";
import { projects } from "@/data/projects";
import { localizePath } from "@/i18n/utils";
import type { AppShowcasePanel, Locale, Project } from "@/types";

/** Un panneau prêt à rendre : la donnée vitrine, le projet correspondant, son
 *  rang affiché (01 / 04) et le lien vers sa page de détail. */
export interface ShowcaseEntry {
  panel: AppShowcasePanel;
  project: Project;
  position: string;
  total: string;
  href: string;
}

const POSITION_PAD = 2;

function findProject(slug: string): Project {
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) {
    throw new Error(`appShowcase: aucun projet pour le slug "${slug}"`);
  }
  return project;
}

function buildHref(project: Project, locale: Locale): string {
  const hasDetailPage = Boolean(appDetails[project.slug]);
  return hasDetailPage
    ? `${localizePath("apps", locale)}/${project.slug}`
    : project.url;
}

function pad(value: number): string {
  return value.toString().padStart(POSITION_PAD, "0");
}

export function loadShowcaseEntries(locale: Locale): ShowcaseEntry[] {
  const total = pad(appShowcase.length);
  return appShowcase.map((panel, index) => {
    const project = findProject(panel.slug);
    return {
      panel,
      project,
      position: pad(index + 1),
      total,
      href: buildHref(project, locale),
    };
  });
}
