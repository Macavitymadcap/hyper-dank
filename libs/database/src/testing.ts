import { describe, expect, test } from "bun:test";
import type { DatabaseLifecycle, MaybePromise } from "./index";

export interface DatabaseLifecycleHarness<TProvider extends DatabaseLifecycle> {
  cleanup?: () => MaybePromise<void>;
  provider: TProvider;
}

export function describeDatabaseLifecycleContract<TProvider extends DatabaseLifecycle>(
  name: string,
  expectedKind: TProvider["kind"],
  setup: () => MaybePromise<DatabaseLifecycleHarness<TProvider>>,
) {
  describe(name, () => {
    test("exposes kind and idempotent migrations", async () => {
      const harness = await setup();

      try {
        expect(harness.provider.kind).toBe(expectedKind);
        await harness.provider.migrate();
        await harness.provider.migrate();
      } finally {
        await harness.provider.close();
        await harness.cleanup?.();
      }
    });
  });
}
