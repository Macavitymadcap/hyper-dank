import type { GitHubRepo } from "./github";

export type Theme = "light" | "dark";

export interface ScreenshotResult {
  flowId: string;
  flowLabel: string;
  label: string;
  relativePath: string;
  stateSlug: string;
  theme: Theme;
  viewportLabel?: string;
  viewportSlug?: string;
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

export interface BuildImagesSectionOptions {
  branch: string;
  cacheKey?: string;
  flows: ScreenshotFlowSummary[];
  repo: GitHubRepo;
  screenshots: ScreenshotResult[];
}

export function buildImagesSection({
  branch,
  cacheKey,
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
    flow.states.flatMap((state) => {
      const stateScreenshots = byState.get(stateKey(flow.id, state.slug)) ?? [];
      const viewportSlugs = uniqueViewportSlugs(stateScreenshots);

      return viewportSlugs.map((viewportSlug) => {
        const viewportScreenshots = stateScreenshots.filter(
          (screenshot) => screenshotViewportSlug(screenshot) === viewportSlug,
        );
        const light = viewportScreenshots.find((screenshot) => screenshot.theme === "light");
        const dark = viewportScreenshots.find((screenshot) => screenshot.theme === "dark");

        return `| ${flow.label} | ${stateLabel(state.label, viewportScreenshots[0])} | ${renderImage(light, repo, branch, cacheKey)} | ${renderImage(dark, repo, branch, cacheKey)} |`;
      });
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
    return body.replace(/## Images\n[\s\S]*?(?=\n## |\s*$)/, `${imagesSection}\n`);
  }

  return `${body.trim()}\n\n${imagesSection}\n`;
}

function renderImage(
  screenshot: ScreenshotResult | undefined,
  repo: GitHubRepo,
  branch: string,
  cacheKey?: string,
) {
  if (!screenshot) return "";

  return `![${screenshot.flowLabel} ${screenshot.label} ${screenshot.theme}](${rawUrl(repo, branch, screenshot.relativePath, cacheKey)})`;
}

function rawUrl(repo: GitHubRepo, branch: string, relativePath: string, cacheKey?: string) {
  const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${encodeURIComponent(branch)}/${encodedPath}`;
  return cacheKey ? `${url}?v=${encodeURIComponent(cacheKey)}` : url;
}

function stateKey(flowId: string, stateSlug: string) {
  return `${flowId}:${stateSlug}`;
}

function screenshotViewportSlug(screenshot: ScreenshotResult) {
  return screenshot.viewportSlug ?? "default";
}

function stateLabel(label: string, screenshot: ScreenshotResult | undefined) {
  return screenshot?.viewportLabel ? `${label} (${screenshot.viewportLabel})` : label;
}

function uniqueViewportSlugs(screenshots: ScreenshotResult[]) {
  const slugs: string[] = [];
  for (const screenshot of screenshots) {
    const slug = screenshotViewportSlug(screenshot);
    if (!slugs.includes(slug)) slugs.push(slug);
  }

  return slugs.length > 0 ? slugs : ["default"];
}
