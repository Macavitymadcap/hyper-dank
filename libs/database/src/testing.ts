import { describe, expect, test } from "bun:test";
import type { DatabaseLifecycle, MaybePromise } from "./index";

export interface DatabaseLifecycleHarness<TProvider extends DatabaseLifecycle> {
  cleanup?: () => MaybePromise<void>;
  provider: TProvider;
}

export type ProviderHarness<TProvider extends DatabaseLifecycle> =
  DatabaseLifecycleHarness<TProvider>;

export interface RepositoryHarness<TRepository> {
  cleanup?: () => MaybePromise<void>;
  repository: TRepository;
}

export async function runRepositoryHarness<TRepository, TResult>(
  setup: () => MaybePromise<RepositoryHarness<TRepository>>,
  assertion: (
    repository: TRepository,
    harness: RepositoryHarness<TRepository>,
  ) => MaybePromise<TResult>,
) {
  const harness = await setup();

  try {
    return await assertion(harness.repository, harness);
  } finally {
    await harness.cleanup?.();
  }
}

export async function runWithProviderHarness<TProvider extends DatabaseLifecycle, TResult>(
  setup: () => MaybePromise<ProviderHarness<TProvider>>,
  assertion: (provider: TProvider, harness: ProviderHarness<TProvider>) => MaybePromise<TResult>,
) {
  const harness = await setup();
  let result: TResult;

  try {
    result = await assertion(harness.provider, harness);
  } finally {
    try {
      await harness.provider.close();
    } finally {
      await harness.cleanup?.();
    }
  }

  return result;
}

export function describeDatabaseLifecycleContract<TProvider extends DatabaseLifecycle>(
  name: string,
  expectedKind: TProvider["kind"],
  setup: () => MaybePromise<DatabaseLifecycleHarness<TProvider>>,
) {
  describe(name, () => {
    test("exposes kind and idempotent migrations", async () => {
      await runWithProviderHarness(setup, async (provider) => {
        expect(provider.kind).toBe(expectedKind);
        await provider.migrate();
        await provider.migrate();
      });
    });
  });
}
