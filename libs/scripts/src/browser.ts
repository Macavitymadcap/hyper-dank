import path from "node:path";
import type { Page } from "@playwright/test";
import type { ScreenshotResult, Theme } from "./pr-images";

export interface ScreenshotFlowContext<TServer = unknown> {
  page: Page;
  server: TServer;
  theme: Theme;
}

export interface ScreenshotStateBehavior<TServer = unknown> {
  authUserId?: string | null;
  label: string;
  path?: string;
  setup?: (context: ScreenshotFlowContext<TServer>) => Promise<void>;
  afterLoad?: (context: ScreenshotFlowContext<TServer>) => Promise<void>;
  slug: string;
}

export interface ScreenshotFlow<TServer = unknown> {
  defaultAuthUserId?: string | null;
  description: string;
  id: string;
  label: string;
  setup?: (context: ScreenshotFlowContext<TServer>) => Promise<void>;
  states: ScreenshotStateBehavior<TServer>[];
}

export interface CaptureScreenshotsOptions<TServer = unknown> {
  baseUrl: string;
  flows: ScreenshotFlow<TServer>[];
  outputDir: string;
  page: Page;
  server: TServer;
  setAuthUser?: (server: TServer, userId: string | null) => void | Promise<void>;
  themes?: Theme[];
}

export async function captureScreenshots<TServer = unknown>({
  baseUrl,
  flows,
  outputDir,
  page,
  server,
  setAuthUser,
  themes = ["light", "dark"],
}: CaptureScreenshotsOptions<TServer>): Promise<ScreenshotResult[]> {
  const screenshots: ScreenshotResult[] = [];

  for (const flow of flows) {
    for (const state of flow.states) {
      const authUserId = state.authUserId ?? flow.defaultAuthUserId ?? null;
      await setAuthUser?.(server, authUserId);

      for (const theme of themes) {
        const context = { page, server, theme };
        await flow.setup?.(context);
        await state.setup?.(context);
        await page.goto(new URL(state.path ?? "/", baseUrl).toString());
        await setTheme(page, theme);
        await state.afterLoad?.(context);

        const relativePath = path
          .join(flow.id, state.slug, `${theme}.png`)
          .split(path.sep)
          .join("/");
        await page.screenshot({ fullPage: true, path: path.join(outputDir, relativePath) });
        screenshots.push({
          flowId: flow.id,
          flowLabel: flow.label,
          label: state.label,
          relativePath,
          stateSlug: state.slug,
          theme,
        });
      }
    }
  }

  return screenshots;
}

export async function setTheme(page: Page, theme: Theme) {
  await page.evaluate((selectedTheme) => {
    const document = globalThis.document;

    localStorage.setItem("hyper-dank-theme", selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;

    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle instanceof HTMLInputElement) {
      const isDark = selectedTheme === "dark";
      toggle.checked = isDark;
      toggle.setAttribute("aria-checked", String(isDark));
    }
  }, theme);
}
