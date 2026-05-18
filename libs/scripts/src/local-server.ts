import { setTimeout as delay } from "node:timers/promises";

export interface StartedBunServer {
  port: number;
  server: ReturnType<typeof Bun.serve>;
  url: string;
}

export type HttpFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface StartBunServerOptions {
  attempts?: number;
  fetch: (request: Request) => Response | Promise<Response>;
  hostname?: string;
  port?: number;
  portBase?: number;
  portRange?: number;
}

export interface WaitForHttpOptions {
  attempts?: number;
  delayMs?: number;
  fetchImpl?: HttpFetch;
  ok?: (response: Response) => boolean;
}

const DEFAULT_PORT_ATTEMPTS = 50;
const DEFAULT_PORT_BASE = 45_000;
const DEFAULT_PORT_RANGE = 20_000;

export function startBunServer(options: StartBunServerOptions): StartedBunServer {
  const requestedPort = options.port ?? 0;
  const attempts = requestedPort > 0 ? 1 : (options.attempts ?? DEFAULT_PORT_ATTEMPTS);
  const hostname = options.hostname ?? "127.0.0.1";
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidatePort =
      requestedPort > 0
        ? requestedPort
        : dynamicPortCandidate(
            attempt,
            options.portBase ?? DEFAULT_PORT_BASE,
            options.portRange ?? DEFAULT_PORT_RANGE,
          );

    try {
      const server = Bun.serve({
        ...(options.hostname ? { hostname } : {}),
        port: candidatePort,
        fetch: options.fetch,
      });
      const port = server.port ?? candidatePort;

      return {
        port,
        server,
        url: `http://${hostname}:${port}`,
      };
    } catch (error) {
      lastError = error;
      if (requestedPort > 0 || !isAddressInUseError(error)) throw error;
    }
  }

  throw new Error(`Unable to start test server on an available port. Last error: ${lastError}`);
}

export async function waitForHttp(url: string, options: WaitForHttpOptions = {}) {
  const attempts = options.attempts ?? 40;
  const delayMs = options.delayMs ?? 500;
  const fetchImpl = options.fetchImpl ?? fetch;
  const ok = options.ok ?? ((response: Response) => response.ok);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url);
      if (ok(response)) return response;
    } catch {}

    await delay(delayMs);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

export function dynamicPortCandidate(
  attempt: number,
  portBase = DEFAULT_PORT_BASE,
  portRange = DEFAULT_PORT_RANGE,
) {
  const start = Math.abs(process.pid) % portRange;
  return portBase + ((start + attempt) % portRange);
}

function isAddressInUseError(error: unknown) {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "EADDRINUSE"
  );
}
