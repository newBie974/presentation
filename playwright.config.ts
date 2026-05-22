import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "list",
  webServer: {
    command: "npx http-server dist -p 4321 -s",
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  use: {
    baseURL: "http://localhost:4321",
  },
});
