import type { GitHubRepo } from "./github";

export type Theme = "light" | "dark";

export interface ScreenshotResult {
  flowId: string;
  flowLabel: string;
  label: string;
  relativePath: string;
  stateSlug: string;
  theme: Theme;
}

export interface ScreenshotStateSummary {
  label: string;
  slug: string;
}

export interface ScreenshotFlowSummary {
  id: string;
  label: string;
  states: ScreenshotStateSummary[];
}

interface BuildImagesSectionOptions {
  branch: string;
  flows: ScreenshotFlowSummary[];
  repo: GitHubRepo;
  screenshots: ScreenshotResult[];
}

export function buildImagesSection({
  branch,
  flows,
  repo,
  screenshots,
}: BuildImagesSectionOptions) {
  const byState = new Map<string, ScreenshotResult[]>();
  for (const screenshot of screenshots) {
    const key = stateKey(screenshot.flowId, screenshot.stateSlug);
    byState.set(key, [...(byState.get(key) ?? []), screenshot]);
  }

  const rows = flows.flatMap((flow) =>
    flow.states.map((state) => {
      const stateScreenshots = byState.get(stateKey(flow.id, state.slug)) ?? [];
      const light = stateScreenshots.find((screenshot) => screenshot.theme === "light");
      const dark = stateScreenshots.find((screenshot) => screenshot.theme === "dark");

      return `| ${flow.label} | ${state.label} | ${renderImage(light, repo, branch)} | ${renderImage(dark, repo, branch)} |`;
    }),
  );

  return [
    "## Images",
    "",
    "| Flow | State | Light | Dark |",
    "| --- | --- | --- | --- |",
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

  return `![${screenshot.flowLabel} ${screenshot.label} ${screenshot.theme}](${rawUrl(repo, branch, screenshot.relativePath)})`;
}

function rawUrl(repo: GitHubRepo, branch: string, relativePath: string) {
  const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${encodeURIComponent(branch)}/${encodedPath}`;
}

function stateKey(flowId: string, stateSlug: string) {
  return `${flowId}:${stateSlug}`;
}
