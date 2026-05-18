export const DEFAULT_PAGES_BASE_PATH = "/hyper-dank";

type PagesBaseEnvironment = Record<string, string | undefined>;

export function normalizePagesBasePath(value: string): string {
  const trimmed = value.trim();

  if (trimmed === "" || trimmed === "/") {
    return "";
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    throw new Error(`Pages base path must be a path, not a URL: ${value}`);
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, "");
  const pathBody = withoutTrailingSlash.slice(1);

  if (/\s/.test(withoutTrailingSlash)) {
    throw new Error(`Pages base path must not contain whitespace: ${value}`);
  }

  if (pathBody.includes("/")) {
    throw new Error(`Pages base path must be a single GitHub Pages project path: ${value}`);
  }

  return withoutTrailingSlash;
}

export function resolvePagesBasePath(environment: PagesBaseEnvironment = process.env): string {
  const explicitBasePath = environment.PAGES_BASE_PATH?.trim();

  if (explicitBasePath) {
    return normalizePagesBasePath(explicitBasePath);
  }

  const repositoryName = repositoryNameFromSlug(environment.GITHUB_REPOSITORY);

  if (repositoryName) {
    return normalizePagesBasePath(repositoryName);
  }

  return DEFAULT_PAGES_BASE_PATH;
}

export function paceDemoBaseFromPagesBasePath(basePath: string): string {
  const normalizedBasePath = normalizePagesBasePath(basePath);
  return normalizedBasePath === "" ? "/pace/" : `${normalizedBasePath}/pace/`;
}

export function githubOutputForPagesBasePath(basePath: string): string {
  return [
    `base_path=${normalizePagesBasePath(basePath)}`,
    `pace_demo_base=${paceDemoBaseFromPagesBasePath(basePath)}`,
    "",
  ].join("\n");
}

export function withJekyllBaseUrl(config: string, basePath: string): string {
  const normalizedBasePath = normalizePagesBasePath(basePath);
  const baseUrlPattern = /^baseurl:\s*.*$/m;

  if (!baseUrlPattern.test(config)) {
    throw new Error("Could not find a baseurl entry in the Jekyll config.");
  }

  return config.replace(baseUrlPattern, `baseurl: ${JSON.stringify(normalizedBasePath)}`);
}

function repositoryNameFromSlug(repositorySlug?: string): string | undefined {
  const trimmed = repositorySlug?.trim();

  if (!trimmed) {
    return undefined;
  }

  const match = /^[^/\s]+\/([^/\s]+)$/.exec(trimmed);

  if (!match) {
    throw new Error(`GITHUB_REPOSITORY must look like owner/repo: ${repositorySlug}`);
  }

  return match[1];
}
