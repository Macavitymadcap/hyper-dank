import { readFile } from "node:fs/promises";

export interface FetchWithTimeoutOptions extends RequestInit {
  fetchImpl?: FetchLike;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;

type FetchLike = (url: string, init?: RequestInit) => Promise<Response> | Response;

export async function readJsonFile<T>(filePath: string): Promise<T> {
  return parseJsonText<T>(filePath, await readFile(filePath, "utf8"));
}

export function parseJsonText<T>(source: string, text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse JSON from ${source}: ${message}`);
  }
}

export async function fetchWithTimeout(
  url: string,
  { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS, ...init }: FetchWithTimeoutOptions = {},
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (controller.signal.aborted) {
      throw new Error(`Could not fetch ${url} within ${timeoutMs}ms.`);
    }

    throw new Error(`Could not fetch ${url}: ${message}`);
  } finally {
    clearTimeout(timeout);
  }
}

export async function responseJson<T>(response: Response, source: string): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse JSON from ${source}: ${message}`);
  }
}
