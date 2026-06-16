import { experiments } from "@/data/experiments";
import type { Experiment } from "@/types";

export function loadExperiments(limit?: number): Experiment[] {
  const sorted = [...experiments].sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
