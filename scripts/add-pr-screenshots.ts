#!/usr/bin/env bun
import { spawn, spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import puppeteer, { type Page } from "puppeteer";

type Theme = "light" | "dark";

interface ScreenshotState {
  label: string;
  slug: string;
  setup: () => Promise<void>;
  afterLoad?: (page: Page) => Promise<void>;
}

interface ScreenshotResult {
  label: string;
  theme: Theme;
  relativePath: string;
}

interface GitHubPullRequest {
  body: string | null;
  html_url: string;
  number: number;
}

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const port = Number(process.env.PR_SCREENSHOT_PORT ?? 4100);
const baseUrl = `http://localhost:${port}`;
const branch = run("git", ["branch", "--show-current"]);
const screenshotRoot = normalizePath(process.env.PR_SCREENSHOT_DIR ?? `docs/pr-screenshots/${branch}`);
const shouldStage = !args.has("--no-stage");
const shouldUpdatePr = !args.has("--no-update-pr");
const shouldCommitAndPush = args.has("--commit-and-push");

const themes: Theme[] = ["light", "dark"];
const sampleWalks = [
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
      await addWalk(sampleWalks[0]);
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

const server = spawn("bun", ["src/index.ts"], {
  cwd: root,
  env: {
    ...process.env,
    DB_PATH: ":memory:",
    PORT: String(port),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForServer();

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
    run("git", ["add", screenshotRoot]);
  }

  if (shouldCommitAndPush && hasChanges(screenshotRoot)) {
    run("git", ["commit", "-m", "Add PR screenshots", "--", screenshotRoot]);
    run("git", ["push"]);
  }

  if (shouldUpdatePr) {
    const pr = await updatePullRequest(screenshots);
    console.log(`Updated PR screenshots: ${pr.html_url}`);
  } else {
    console.log(buildImagesSection(screenshots, getGitHubRepo()));
  }

  console.log(`Screenshots written to ${screenshotRoot}`);
} finally {
  server.kill();
}

async function captureScreenshots(page: Page): Promise<ScreenshotResult[]> {
  const screenshots: ScreenshotResult[] = [];

  for (const state of states) {
    for (const theme of themes) {
      await state.setup();
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
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
  const response = await fetch(`${baseUrl}/walks`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to clear walks: ${response.status}`);
}

async function addWalk(walk: { miles: string; minutes: string; seconds: string } | undefined) {
  if (!walk) throw new Error("Missing sample walk");

  const body = new URLSearchParams(walk);
  const response = await fetch(`${baseUrl}/walks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) throw new Error(`Failed to add walk: ${response.status}`);
}

async function seedManyWalks() {
  await clearWalks();
  for (const walk of sampleWalks) {
    await addWalk(walk);
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
    }

    if (server.exitCode !== null) {
      throw new Error(`Server exited before it was ready:\n${serverOutput}`);
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${baseUrl}\n${serverOutput}`);
}

async function updatePullRequest(screenshots: ScreenshotResult[]): Promise<GitHubPullRequest> {
  const repo = getGitHubRepo();
  const token = getGitHubToken();
  if (!token) {
    throw new Error("Set GITHUB_TOKEN or GH_TOKEN, or authenticate git for github.com before updating the PR.");
  }

  const pr = await getPullRequest(repo, token);
  const body = pr.body ?? "";
  const nextBody = updateImagesSection(body, buildImagesSection(screenshots, repo));

  return githubRequest<GitHubPullRequest>(repo, token, `/repos/${repo.owner}/${repo.name}/pulls/${pr.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: nextBody }),
  });
}

async function getPullRequest(repo: GitHubRepo, token: string): Promise<GitHubPullRequest> {
  const prNumber = Number(process.env.PR_NUMBER);
  if (Number.isInteger(prNumber) && prNumber > 0) {
    return githubRequest<GitHubPullRequest>(repo, token, `/repos/${repo.owner}/${repo.name}/pulls/${prNumber}`);
  }

  const head = encodeURIComponent(`${repo.owner}:${branch}`);
  const pulls = await githubRequest<GitHubPullRequest[]>(
    repo,
    token,
    `/repos/${repo.owner}/${repo.name}/pulls?head=${head}&state=open`
  );
  const [pr] = pulls;
  if (!pr) throw new Error(`No open PR found for ${repo.owner}:${branch}`);

  return pr;
}

interface GitHubRepo {
  name: string;
  owner: string;
}

function getGitHubRepo(): GitHubRepo {
  const remote = run("git", ["remote", "get-url", "origin"]);
  const sshMatch = remote.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
  const httpsMatch = remote.match(/github\.com\/([^/]+)\/(.+?)(?:\.git)?$/);
  const match = sshMatch ?? httpsMatch;
  if (!match?.[1] || !match[2]) throw new Error(`Could not parse GitHub remote: ${remote}`);

  return {
    owner: match[1],
    name: match[2],
  };
}

function getGitHubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  const credential = spawnSync("git", ["credential", "fill"], {
    cwd: root,
    encoding: "utf8",
    input: "protocol=https\nhost=github.com\n\n",
  });
  if (credential.status !== 0) return "";

  return credential.stdout
    .split("\n")
    .find((line) => line.startsWith("password="))
    ?.replace("password=", "") ?? "";
}

async function githubRequest<T>(
  repo: GitHubRepo,
  token: string,
  endpoint: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...init,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed for ${repo.owner}/${repo.name}: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

function buildImagesSection(screenshots: ScreenshotResult[], repo: GitHubRepo) {
  const byState = new Map<string, ScreenshotResult[]>();
  for (const screenshot of screenshots) {
    byState.set(screenshot.label, [...(byState.get(screenshot.label) ?? []), screenshot]);
  }

  const rows = states.map((state) => {
    const stateScreenshots = byState.get(state.label) ?? [];
    const light = stateScreenshots.find((screenshot) => screenshot.theme === "light");
    const dark = stateScreenshots.find((screenshot) => screenshot.theme === "dark");

    return `| ${state.label} | ${renderImage(light, repo)} | ${renderImage(dark, repo)} |`;
  });

  return [
    "## Images",
    "",
    "| State | Light | Dark |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function renderImage(screenshot: ScreenshotResult | undefined, repo: GitHubRepo) {
  if (!screenshot) return "";

  return `![${screenshot.label} ${screenshot.theme}](${rawUrl(repo, screenshot.relativePath)})`;
}

function rawUrl(repo: GitHubRepo, relativePath: string) {
  const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${encodeURIComponent(branch)}/${encodedPath}`;
}

function updateImagesSection(body: string, imagesSection: string) {
  if (body.includes("## Images")) {
    return body.replace(/## Images\n[\s\S]*?(?=\n## |\s*$)/, `${imagesSection}\n\n`);
  }

  return `${body.trim()}\n\n${imagesSection}\n`;
}

function hasChanges(relativePath: string) {
  return run("git", ["status", "--short", relativePath], { allowFailure: true }).length > 0;
}

function run(command: string, commandArgs: string[], options: { allowFailure?: boolean } = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
  });

  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} ${commandArgs.join(" ")} failed:\n${result.stderr}`);
  }

  return result.stdout.trim();
}

function normalizePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}
