#!/usr/bin/env bash
set -euo pipefail

port="${A11Y_PORT:-3999}"
url="http://localhost:${port}"
log_file="$(mktemp -t pace-a11y-server.XXXXXX.log)"
server_pid=""

cleanup() {
  if [[ -n "$server_pid" ]] && kill -0 "$server_pid" >/dev/null 2>&1; then
    kill "$server_pid" >/dev/null 2>&1 || true
    wait "$server_pid" >/dev/null 2>&1 || true
  fi

  rm -f "$log_file"
}

trap cleanup EXIT

PORT="$port" DB_PATH=":memory:" bun src/index.ts >"$log_file" 2>&1 &
server_pid="$!"

for attempt in {1..30}; do
  if curl -fsS "$url" >/dev/null 2>&1; then
    break
  fi

  if ! kill -0 "$server_pid" >/dev/null 2>&1; then
    cat "$log_file" >&2
    exit 1
  fi

  sleep 1
done

curl -fsS "$url" >/dev/null
curl -fsS \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "miles=1.2&minutes=18&seconds=55" \
  "$url/walks" >/dev/null

pa11y "$url" --config .pa11yrc.json
