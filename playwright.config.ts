import { defineConfig, devices } from "@playwright/test";

// Rode `npm run build` antes. Em ambientes com Chromium pré-instalado, defina PW_CHROMIUM_PATH.
const executablePath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions: executablePath ? { executablePath } : {} } },
  ],
});
