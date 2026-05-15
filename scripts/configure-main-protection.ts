#!/usr/bin/env bun
import { githubRequest, getGitHubToken, parseGitHubRepo } from "./lib/github";
import { root } from "./lib/paths";

const repo = parseGitHubRepo(process.argv[2] ?? "Macavitymadcap/pace-calculator");
const token = getGitHubToken();
const configPath = `${root}/.github/branch-protection-main.json`;
const config = await Bun.file(configPath).text();

if (!token) {
  throw new Error("Set GITHUB_TOKEN or GH_TOKEN, or authenticate git for github.com before configuring branch protection.");
}

await githubRequest(repo, token, `/repos/${repo.owner}/${repo.name}/branches/main/protection`, {
  method: "PUT",
  body: config,
});

console.log(`Configured branch protection for ${repo.owner}/${repo.name}:main`);
