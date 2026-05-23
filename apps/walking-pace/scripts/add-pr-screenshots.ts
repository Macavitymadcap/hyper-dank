#!/usr/bin/env bun
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import {
  buildImagesSection,
  type GitHubPullRequest,
  getGitHubRepo,
  getGitHubToken,
  getPullRequest,
  githubRequest,
  run,
  type ScreenshotFlowSummary,
  type ScreenshotResult,
  type Theme,
  updateImagesSection,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";
import { chromium, type Page } from "@playwright/test";
import { startInMemoryAppServer } from "./lib/app-server";
import { normalizePath, root } from "./lib/paths";
import {
  listScreenshotFlows,
  type ScreenshotFlow,
  type ScreenshotFlowContext,
  selectScreenshotFlows,
  setTheme,
} from "./lib/screenshot-flows";

interface ScreenshotViewport {
  deviceScaleFactor: number;
  hasTouch: boolean;
  height: number;
  isMobile: boolean;
  label: string;
  slug: string;
  userAgent?: string;
  width: number;
}

const args = process.argv.slice(2);
const argSet = new Set(args);
const port = Number(process.env.PR_SCREENSHOT_PORT ?? 0);
const branch = run("git", ["branch", "--show-current"]);
const shouldCommitAndPush = argSet.has("--commit-and-push");
const shouldPersist =
  argSet.has("--persist") || shouldCommitAndPush || argSet.has("--update-pr-only");
const screenshotRoot = normalizePath(
  process.env.PR_SCREENSHOT_DIR ??
    (shouldPersist ? `docs/pr-screenshots/${branch}` : `.cache/pr-screenshots/${branch}`),
);
const shouldStage = shouldPersist && !argSet.has("--no-stage");
const shouldUpdatePr = shouldPersist && !argSet.has("--no-update-pr");
const themes: Theme[] = ["light", "dark"];
const selectedFlows = selectScreenshotFlows(getFlowArgs(args));
const screenshotViewports: ScreenshotViewport[] = [
  {
    deviceScaleFactor: 3,
    hasTouch: true,
    height: 640,
    isMobile: true,
    label: "Mobile",
    slug: "mobile",
    userAgent:
      "Mozilla/5.0 (Linux; Android 8.0.0; SAMSUNG SM-A520F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
    width: 360,
  },
  {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 900,
    isMobile: false,
    label: "Desktop",
    slug: "desktop",
    width: 1440,
  },
];

if (argSet.has("--list-flows")) {
  console.log(listScreenshotFlows());
  process.exit(0);
}

if (argSet.has("--update-pr-only")) {
  const pr = await updatePullRequest(expectedScreenshots());
  console.log(`Updated PR screenshots: ${pr.html_url}`);
  process.exit(0);
}

run("bun", ["run", "build"]);

const server = await startInMemoryAppServer(port, {
  authenticatedUserId: null,
  demoMode: true,
  users: [],
}).then();

try {
  await waitForHttp(server.url);

  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const screenshots: ScreenshotResult[] = [];
  for (const viewport of screenshotViewports) {
    const context = await browser.newContext({
      deviceScaleFactor: viewport.deviceScaleFactor,
      hasTouch: viewport.hasTouch,
      isMobile: viewport.isMobile,
      userAgent: viewport.userAgent,
      viewport: {
        height: viewport.height,
        width: viewport.width,
      },
    });
    const page = await context.newPage();
    screenshots.push(...(await captureScreenshots(page, viewport)));
    await context.close();
  }
  await browser.close();

  if (shouldStage || shouldCommitAndPush) {
    run("git", ["add", "-f", screenshotRoot]);
  }

  if (shouldCommitAndPush && hasChanges(screenshotRoot)) {
    run("git", ["commit", "-m", "Add PR screenshots", "--", screenshotRoot]);
    run("git", ["push"]);
  }

  if (shouldUpdatePr) {
    const pr = await updatePullRequest(screenshots);
    console.log(`Updated PR screenshots: ${pr.html_url}`);
  } else if (shouldPersist) {
    console.log(
      buildImagesSection({
        branch,
        cacheKey: screenshotCacheKey(),
        repo: getGitHubRepo(),
        screenshots,
        flows: flowSummaries(),
      }),
    );
  } else {
    console.log(
      "PR update skipped. Screenshots were kept in the ignored local cache; use --persist to write repo-hosted PR images.",
    );
  }

  console.log(`Screenshots written to ${screenshotRoot}`);
} finally {
  await server.stop();
}

async function captureScreenshots(
  page: Page,
  viewport: ScreenshotViewport,
): Promise<ScreenshotResult[]> {
  const screenshots: ScreenshotResult[] = [];

  for (const flow of selectedFlows) {
    for (const state of flow.states) {
      for (const theme of themes) {
        const context: ScreenshotFlowContext = { page, server, theme };
        await flow.setup?.(context);
        await setAuthCookie(page, state.authUserId ?? flow.defaultAuthUserId ?? null);
        await state.setup?.(context);
        await setAuthCookie(page, state.authUserId ?? flow.defaultAuthUserId ?? null);
        await page.goto(`${server.url}${themedPath(state.path ?? "/", theme)}`, {
          waitUntil: "domcontentloaded",
        });
        await setTheme(page, theme);
        await state.afterLoad?.(context);
        await delay(120);

        const relativePath = screenshotPath(flow, state.slug, theme, viewport);
        const absolutePath = path.join(root, relativePath);
        await mkdir(path.dirname(absolutePath), { recursive: true });
        await page.screenshot({ path: absolutePath });

        screenshots.push({
          flowId: flow.id,
          flowLabel: flow.label,
          label: state.label,
          stateSlug: state.slug,
          theme,
          relativePath,
          viewportLabel: viewport.label,
          viewportSlug: viewport.slug,
        });
      }
    }
  }

  return screenshots;
}

function expectedScreenshots(): ScreenshotResult[] {
  return selectedFlows.flatMap((flow) =>
    flow.states.flatMap((state) =>
      screenshotViewports.flatMap((viewport) =>
        themes.map((theme) => ({
          flowId: flow.id,
          flowLabel: flow.label,
          label: state.label,
          stateSlug: state.slug,
          theme,
          relativePath: screenshotPath(flow, state.slug, theme, viewport),
          viewportLabel: viewport.label,
          viewportSlug: viewport.slug,
        })),
      ),
    ),
  );
}

async function setAuthCookie(page: Page, userId: string | null) {
  const browserContext = page.context();
  await browserContext.clearCookies();

  if (!userId) {
    server.setAuthUser(null);
    return;
  }

  const cookie = server.setAuthUser(userId);
  const [name, value] = cookie.split(";")[0]?.split("=") ?? [];
  if (!name || !value) return;

  await browserContext.addCookies([
    {
      name,
      value,
      domain: new URL(server.url).hostname,
      path: "/",
    },
  ]);
}

function screenshotPath(
  flow: ScreenshotFlow,
  stateSlug: string,
  theme: Theme,
  viewport: ScreenshotViewport,
) {
  const flowDirectory = selectedFlows.length > 1 ? flow.id : "";
  return normalizePath(
    path.join(screenshotRoot, flowDirectory, `${stateSlug}-${viewport.slug}-${theme}.png`),
  );
}

function themedPath(routePath: string, theme: Theme) {
  if (!routePath.startsWith("/storybook/iframe.html")) return routePath;

  const url = new URL(routePath, "http://example.test");
  url.searchParams.set("globals", `theme:${theme}`);

  return `${url.pathname}${url.search}`;
}

async function updatePullRequest(screenshots: ScreenshotResult[]) {
  const repo = getGitHubRepo();
  const token = getGitHubToken();
  if (!token) {
    throw new Error(
      "Set GITHUB_TOKEN or GH_TOKEN, or authenticate git for github.com before updating the PR.",
    );
  }

  const pr = await getPullRequest(repo, token, branch);
  const body = pr.body ?? "";
  const imagesSection = buildImagesSection({
    branch,
    cacheKey: screenshotCacheKey(),
    flows: flowSummaries(),
    repo,
    screenshots,
  });
  const nextBody = updateImagesSection(body, imagesSection);

  return githubRequest<GitHubPullRequest>(
    repo,
    token,
    `/repos/${repo.owner}/${repo.name}/pulls/${pr.number}`,
    {
      method: "PATCH",
      body: JSON.stringify({ body: nextBody }),
    },
  );
}

function flowSummaries(): ScreenshotFlowSummary[] {
  return selectedFlows.map((flow) => ({
    id: flow.id,
    label: flow.label,
    states: flow.states.map((state) => ({
      label: state.label,
      slug: state.slug,
    })),
  }));
}

function getFlowArgs(values: string[]) {
  const flowIds: string[] = [];

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value) continue;

    if (value === "--flow") {
      const nextValue = values[index + 1];
      if (nextValue) {
        flowIds.push(nextValue);
        index += 1;
      }
      continue;
    }

    if (value.startsWith("--flow=")) {
      flowIds.push(value.slice("--flow=".length));
    }
  }

  if (argSet.has("--all-flows")) {
    flowIds.push("all");
  }

  return flowIds;
}

function screenshotCacheKey() {
  return process.env.PR_SCREENSHOT_CACHE_KEY ?? run("git", ["rev-parse", "--short=12", "HEAD"]);
}

function hasChanges(relativePath: string) {
  return run("git", ["status", "--short", relativePath], { allowFailure: true }).length > 0;
}
