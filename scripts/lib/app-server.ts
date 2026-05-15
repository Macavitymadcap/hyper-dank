import { setTimeout as delay } from "node:timers/promises";
import { createApp } from "../../src/app";
import { Repository } from "../../src/db";

export interface SampleWalk {
  miles: string;
  minutes: string;
  seconds: string;
}

export function startInMemoryAppServer(port: number) {
  const walksRepository = new Repository({ filename: ":memory:" });
  const app = createApp({ walksRepository });
  const server = Bun.serve({
    port,
    fetch: app.fetch,
  });

  return {
    port,
    url: `http://localhost:${port}`,
    stop: () => server.stop(true),
  };
}

export async function waitForHttp(url: string, attempts = 40, delayMs = 500) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
    }

    await delay(delayMs);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

export async function clearWalks(baseUrl: string) {
  const response = await fetch(`${baseUrl}/walks`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to clear walks: ${response.status}`);
}

export async function addWalk(baseUrl: string, walk: SampleWalk | undefined) {
  if (!walk) throw new Error("Missing sample walk");

  const body = new URLSearchParams();
  body.set("miles", walk.miles);
  body.set("minutes", walk.minutes);
  body.set("seconds", walk.seconds);
  const response = await fetch(`${baseUrl}/walks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) throw new Error(`Failed to add walk: ${response.status}`);
}
