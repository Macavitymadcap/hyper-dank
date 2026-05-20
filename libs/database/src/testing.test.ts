import { describe, expect, test } from "bun:test";
import {
  describeDatabaseLifecycleContract,
  type ProviderHarness,
  type RepositoryHarness,
  runRepositoryHarness,
  runWithProviderHarness,
} from "./testing";

describe("repository harness helpers", () => {
  test("runs cleanup after successful repository assertions", async () => {
    const events: string[] = [];
    const harness: RepositoryHarness<{ count: () => number }> = {
      cleanup: () => {
        events.push("cleanup");
      },
      repository: {
        count: () => {
          events.push("assert");
          return 1;
        },
      },
    };

    const result = await runRepositoryHarness(
      () => harness,
      async (repository) => {
        expect(repository.count()).toBe(1);
        return "ok";
      },
    );

    expect(result).toBe("ok");
    expect(events).toEqual(["assert", "cleanup"]);
  });

  test("runs cleanup when repository assertions fail", async () => {
    const events: string[] = [];

    await expect(
      runRepositoryHarness(
        () => ({
          cleanup: () => {
            events.push("cleanup");
          },
          repository: {},
        }),
        () => {
          events.push("assert");
          throw new Error("boom");
        },
      ),
    ).rejects.toThrow("boom");

    expect(events).toEqual(["assert", "cleanup"]);
  });
});

describe("provider harness helpers", () => {
  test("closes providers before running cleanup", async () => {
    const events: string[] = [];
    const harness: ProviderHarness<{
      close: () => void;
      kind: "memory";
      migrate: () => void;
    }> = {
      cleanup: () => {
        events.push("cleanup");
      },
      provider: {
        close: () => {
          events.push("close");
        },
        kind: "memory",
        migrate: () => {
          events.push("migrate");
        },
      },
    };

    await runWithProviderHarness(
      () => harness,
      async (provider) => {
        await provider.migrate();
      },
    );

    expect(events).toEqual(["migrate", "close", "cleanup"]);
  });

  test("reports provider close failures and still runs cleanup", async () => {
    const events: string[] = [];

    await expect(
      runWithProviderHarness(
        () => ({
          cleanup: () => {
            events.push("cleanup");
          },
          provider: {
            close: () => {
              events.push("close");
              throw new Error("close failed");
            },
            kind: "memory" as const,
            migrate: () => {},
          },
        }),
        () => {
          events.push("assert");
        },
      ),
    ).rejects.toThrow("close failed");

    expect(events).toEqual(["assert", "close", "cleanup"]);
  });
});

describeDatabaseLifecycleContract("memory lifecycle compatibility", "memory", () => ({
  provider: {
    close: () => {},
    kind: "memory" as const,
    migrate: () => {},
  },
}));
