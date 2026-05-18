#!/usr/bin/env bun
import {
  getGitHubToken,
  githubRequest,
  parseGitHubRepo,
} from "@macavitymadcap/hyper-dank-automation";
import { root } from "./lib/paths";

const repo = parseGitHubRepo(process.argv[2] ?? "Macavitymadcap/hyper-dank");
const token = getGitHubToken();
const configPath = `${root}/.github/branch-protection-main.json`;
const config = await Bun.file(configPath).text();

if (!token) {
  throw new Error(
    "Set GITHUB_TOKEN or GH_TOKEN, or authenticate git for github.com before configuring branch protection.",
  );
}

await githubRequest(repo, token, `/repos/${repo.owner}/${repo.name}/branches/main/protection`, {
  method: "PUT",
  body: config,
});

console.log(`Configured branch protection for ${repo.owner}/${repo.name}:main`);
