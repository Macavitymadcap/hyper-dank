import { run } from "./process";

export interface GitHubRepo {
  name: string;
  owner: string;
}

export interface GitHubPullRequest {
  body: string | null;
  html_url: string;
  number: number;
}

export function parseGitHubRepo(repo: string): GitHubRepo {
  const [owner, name] = repo.split("/");
  if (!owner || !name) throw new Error(`Expected OWNER/REPO, received: ${repo}`);

  return { owner, name };
}

export function getGitHubRepo(): GitHubRepo {
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

export function getGitHubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  const credential = run("git", ["credential", "fill"], {
    allowFailure: true,
    input: "protocol=https\nhost=github.com\n\n",
  });

  return credential
    .split("\n")
    .find((line) => line.startsWith("password="))
    ?.replace("password=", "") ?? "";
}

export async function getPullRequest(
  repo: GitHubRepo,
  token: string,
  branch: string,
  prNumber = Number(process.env.PR_NUMBER)
): Promise<GitHubPullRequest> {
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

export async function githubRequest<T>(
  repo: GitHubRepo,
  token: string,
  endpoint: string,
  init: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (init.headers) Object.assign(headers, init.headers);

  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed for ${repo.owner}/${repo.name}: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}
