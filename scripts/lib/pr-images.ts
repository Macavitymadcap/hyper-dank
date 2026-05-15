import type { GitHubRepo } from "./github";

export type Theme = "light" | "dark";

export interface ScreenshotResult {
  label: string;
  relativePath: string;
  theme: Theme;
}

export interface ScreenshotState {
  label: string;
  slug: string;
}

interface BuildImagesSectionOptions {
  branch: string;
  repo: GitHubRepo;
  screenshots: ScreenshotResult[];
  states: ScreenshotState[];
}

export function buildImagesSection({ branch, repo, screenshots, states }: BuildImagesSectionOptions) {
  const byState = new Map<string, ScreenshotResult[]>();
  for (const screenshot of screenshots) {
    byState.set(screenshot.label, [...(byState.get(screenshot.label) ?? []), screenshot]);
  }

  const rows = states.map((state) => {
    const stateScreenshots = byState.get(state.label) ?? [];
    const light = stateScreenshots.find((screenshot) => screenshot.theme === "light");
    const dark = stateScreenshots.find((screenshot) => screenshot.theme === "dark");

    return `| ${state.label} | ${renderImage(light, repo, branch)} | ${renderImage(dark, repo, branch)} |`;
  });

  return [
    "## Images",
    "",
    "| State | Light | Dark |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
}

export function updateImagesSection(body: string, imagesSection: string) {
  if (body.includes("## Images")) {
    return body.replace(/## Images\n[\s\S]*?(?=\n## |\s*$)/, `${imagesSection}\n\n`);
  }

  return `${body.trim()}\n\n${imagesSection}\n`;
}

function renderImage(screenshot: ScreenshotResult | undefined, repo: GitHubRepo, branch: string) {
  if (!screenshot) return "";

  return `![${screenshot.label} ${screenshot.theme}](${rawUrl(repo, branch, screenshot.relativePath)})`;
}

function rawUrl(repo: GitHubRepo, branch: string, relativePath: string) {
  const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${encodeURIComponent(branch)}/${encodedPath}`;
}
