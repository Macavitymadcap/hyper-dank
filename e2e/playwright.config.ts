import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 4300);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
  testDir: "./tests",
  testMatch: /.*\.e2e\.ts/,
  timeout: 30_000,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  workers: 1,
});
