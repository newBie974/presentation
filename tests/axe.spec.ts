import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/a-propos",
  "/notes",
  "/collaborer",
  "/en/",
  "/en/about",
  "/en/writing",
  "/en/work",
];

for (const route of ROUTES) {
  test(`a11y — ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
