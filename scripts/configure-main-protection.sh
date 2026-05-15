#!/usr/bin/env bash
set -euo pipefail

repo="${1:-Macavitymadcap/pace-calculator}"
config_path=".github/branch-protection-main.json"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required: https://cli.github.com/" >&2
  exit 1
fi

if [[ ! -f "$config_path" ]]; then
  echo "Cannot find $config_path. Run this script from the repository root." >&2
  exit 1
fi

gh api \
  --method PUT \
  "repos/${repo}/branches/main/protection" \
  --input "$config_path"

echo "Configured branch protection for ${repo}:main"
