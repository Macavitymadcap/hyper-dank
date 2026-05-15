#!/usr/bin/env bun
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import puppeteer, { type Page } from "puppeteer";
import { addWalk as addServerWalk, clearWalks as clearServerWalks, startInMemoryAppServer, waitForHttp, type SampleWalk } from "./lib/app-server";
import { getGitHubRepo, getGitHubToken, getPullRequest, githubRequest, type GitHubPullRequest } from "./lib/github";
import { normalizePath, root } from "./lib/paths";
import { run } from "./lib/process";
import { buildImagesSection, updateImagesSection, type ScreenshotResult, type Theme } from "./lib/pr-images";

interface ScreenshotState {
  label: string;
  slug: string;
  setup: () => Promise<void>;
  afterLoad?: (page: Page) => Promise<void>;
}

const args = new Set(process.argv.slice(2));
const port = Number(process.env.PR_SCREENSHOT_PORT ?? 4100);
const branch = run("git", ["branch", "--show-current"]);
const shouldCommitAndPush = args.has("--commit-and-push");
const shouldPersist = args.has("--persist") || shouldCommitAndPush || args.has("--update-pr-only");
const screenshotRoot = normalizePath(process.env.PR_SCREENSHOT_DIR ?? (shouldPersist ? `docs/pr-screenshots/${branch}` : `.cache/pr-screenshots/${branch}`));
const shouldStage = shouldPersist && !args.has("--no-stage");
const shouldUpdatePr = shouldPersist && !args.has("--no-update-pr");

const themes: Theme[] = ["light", "dark"];
const sampleWalks: SampleWalk[] = [
  { miles: "1.2", minutes: "18", seconds: "55" },
  { miles: "1.4", minutes: "20", seconds: "12" },
  { miles: "0.8", minutes: "11", seconds: "30" },
  { miles: "2.0", minutes: "31", seconds: "20" },
  { miles: "1.1", minutes: "16", seconds: "45" },
  { miles: "1.6", minutes: "24", seconds: "5" },
  { miles: "0.9", minutes: "13", seconds: "40" },
  { miles: "2.2", minutes: "34", seconds: "10" },
  { miles: "1.3", minutes: "19", seconds: "25" },
  { miles: "1.7", minutes: "26", seconds: "50" },
  { miles: "1.0", minutes: "14", seconds: "55" },
  { miles: "1.9", minutes: "29", seconds: "15" },
];

const states: ScreenshotState[] = [
  {
    label: "No walks",
    slug: "no-walks",
    setup: clearWalks,
  },
  {
    label: "One walk",
    slug: "one-walk",
    setup: async () => {
      await clearWalks();
      await addSampleWalk(sampleWalks[0]);
    },
  },
  {
    label: "Many walks",
    slug: "many-walks",
    setup: async () => {
      await seedManyWalks();
    },
  },
  {
    label: "Confirm clear all",
    slug: "confirm-clear-all",
    setup: async () => {
      await seedManyWalks();
    },
    afterLoad: renderConfirmClearAll,
  },
];

if (args.has("--update-pr-only")) {
  const pr = await updatePullRequest(expectedScreenshots());
  console.log(`Updated PR screenshots: ${pr.html_url}`);
  process.exit(0);
}

const server = startInMemoryAppServer(port);

try {
  await waitForHttp(server.url);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 360,
    height: 640,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 8.0.0; SAMSUNG SM-A520F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36"
  );

  const screenshots = await captureScreenshots(page);
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
    console.log(buildImagesSection({ branch, repo: getGitHubRepo(), screenshots, states }));
  } else {
    console.log("PR update skipped. Screenshots were kept in the ignored local cache; use --persist to write repo-hosted PR images.");
  }

  console.log(`Screenshots written to ${screenshotRoot}`);
} finally {
  server.stop();
}

async function captureScreenshots(page: Page): Promise<ScreenshotResult[]> {
  const screenshots: ScreenshotResult[] = [];

  for (const state of states) {
    for (const theme of themes) {
      await state.setup();
      await page.goto(server.url, { waitUntil: "domcontentloaded" });
      await setTheme(page, theme);
      await state.afterLoad?.(page);
      await delay(120);

      const relativePath = normalizePath(path.join(screenshotRoot, `${state.slug}-${theme}.png`));
      const absolutePath = path.join(root, relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await page.screenshot({ path: absolutePath });

      screenshots.push({
        label: state.label,
        theme,
        relativePath,
      });
    }
  }

  return screenshots;
}

function expectedScreenshots(): ScreenshotResult[] {
  return states.flatMap((state) =>
    themes.map((theme) => ({
      label: state.label,
      theme,
      relativePath: normalizePath(path.join(screenshotRoot, `${state.slug}-${theme}.png`)),
    }))
  );
}

async function setTheme(page: Page, theme: Theme) {
  await page.evaluate((selectedTheme) => {
    const browser = globalThis as any;
    const document = browser.document;

    browser.localStorage.setItem("pace-calculator-theme", selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;

    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle instanceof browser.HTMLInputElement) {
      const isDark = selectedTheme === "dark";
      toggle.checked = isDark;
      toggle.setAttribute("aria-checked", String(isDark));
    }
  }, theme);
  await delay(560);
}

async function renderConfirmClearAll(page: Page) {
  await page.evaluate(() => {
    const document = (globalThis as any).document;
    document.querySelector("[data-pr-screenshot-confirm]")?.remove();

    const button = document.querySelector(".clear-walks-btn");
    const message = button?.getAttribute("hx-confirm") ?? "Clear all walks?";
    const isDark = document.documentElement.dataset.theme === "dark";
    const backdrop = document.createElement("div");
    const panel = document.createElement("div");
    const title = document.createElement("strong");
    const prompt = document.createElement("p");
    const actions = document.createElement("div");
    const cancel = document.createElement("button");
    const clear = document.createElement("button");

    backdrop.setAttribute("data-pr-screenshot-confirm", "true");
    backdrop.style.cssText = [
      "position: fixed",
      "inset: 0",
      "z-index: 2147483647",
      "display: grid",
      "place-items: center",
      "padding: 1.25rem",
      "background: rgb(0 0 0 / 0.48)",
    ].join(";");

    panel.style.cssText = [
      "width: min(20rem, 100%)",
      `background: ${isDark ? "#16191d" : "#f8f9fa"}`,
      `color: ${isDark ? "#f8f9fa" : "#212529"}`,
      "border-radius: 0.75rem",
      "box-shadow: 0 18px 45px rgb(0 0 0 / 0.35)",
      "padding: 1rem",
      "font: 500 1rem system-ui, sans-serif",
    ].join(";");

    title.textContent = "Confirm";
    title.style.cssText = "display: block; font-size: 1.15rem; margin-block-end: 0.5rem";

    prompt.textContent = message;
    prompt.style.cssText = "margin: 0 0 1rem";

    actions.style.cssText = "display: flex; justify-content: flex-end; gap: 0.5rem";

    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.style.cssText = [
      "border: 1px solid #adb5bd",
      "border-radius: 0.35rem",
      "background: transparent",
      `color: ${isDark ? "#f8f9fa" : "#212529"}`,
      "font-weight: 700",
      "padding: 0.45rem 0.65rem",
    ].join(";");

    clear.type = "button";
    clear.textContent = "Clear all";
    clear.style.cssText = [
      "border: 0",
      "border-radius: 0.35rem",
      "background: #c92a2a",
      "color: #f8f9fa",
      "font-weight: 700",
      "padding: 0.45rem 0.65rem",
    ].join(";");

    actions.append(cancel, clear);
    panel.append(title, prompt, actions);
    backdrop.append(panel);
    document.body.append(backdrop);
  });
  await page.waitForSelector("[data-pr-screenshot-confirm]");
}

async function clearWalks() {
  await clearServerWalks(server.url);
}

async function addSampleWalk(walk: SampleWalk | undefined) {
  await addServerWalk(server.url, walk);
}

async function seedManyWalks() {
  await clearWalks();
  for (const walk of sampleWalks) {
    await addSampleWalk(walk);
  }
}

async function updatePullRequest(screenshots: ScreenshotResult[]) {
  const repo = getGitHubRepo();
  const token = getGitHubToken();
  if (!token) {
    throw new Error("Set GITHUB_TOKEN or GH_TOKEN, or authenticate git for github.com before updating the PR.");
  }

  const pr = await getPullRequest(repo, token, branch);
  const body = pr.body ?? "";
  const imagesSection = buildImagesSection({ branch, repo, screenshots, states });
  const nextBody = updateImagesSection(body, imagesSection);

  return githubRequest<GitHubPullRequest>(repo, token, `/repos/${repo.owner}/${repo.name}/pulls/${pr.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: nextBody }),
  });
}

function hasChanges(relativePath: string) {
  return run("git", ["status", "--short", relativePath], { allowFailure: true }).length > 0;
}
