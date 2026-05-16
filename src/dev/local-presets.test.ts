import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { TestAuthProvider } from "../auth";
import { createSqliteDatabaseProvider, type DatabaseProvider, type WalkRepository } from "../db";
import { LOCAL_DEV_PASSWORD, LOCAL_DEV_PRESET_USERS, seedLocalDevPresets } from "./local-presets";

let authProvider: TestAuthProvider;
let databaseProvider: DatabaseProvider;
let walksRepository: WalkRepository;

beforeEach(async () => {
  authProvider = new TestAuthProvider();
  databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();
  walksRepository = databaseProvider.createWalkRepository();
});

afterEach(async () => {
  await databaseProvider.close();
});

describe("local dev presets", () => {
  test("seeds reusable local users with different states and walk histories", async () => {
    const results = await seedLocalDevPresets({ authProvider, walksRepository });
    const usersByEmail = new Map(results.map((result) => [result.user.email, result]));

    expect(results).toHaveLength(LOCAL_DEV_PRESET_USERS.length);
    expect(usersByEmail.get("admin@example.com")?.user.role).toBe("admin");
    expect(usersByEmail.get("walker@example.com")?.walkCount).toBe(3);
    expect(usersByEmail.get("history@example.com")?.walkCount).toBe(12);
    expect(usersByEmail.get("empty@example.com")?.walkCount).toBe(0);
    expect(usersByEmail.get("banned@example.com")?.user.banned).toBe(true);

    const historyUser = usersByEmail.get("history@example.com")?.user;
    expect(historyUser).toBeDefined();
    expect(await walksRepository.getAllWalks(historyUser?.id ?? "")).toHaveLength(12);

    const signInResponse = await authProvider.signIn({
      email: "admin@example.com",
      password: LOCAL_DEV_PASSWORD,
    });
    expect(signInResponse.status).toBe(200);

    const bannedSignInResponse = await authProvider.signIn({
      email: "banned@example.com",
      password: LOCAL_DEV_PASSWORD,
    });
    expect(bannedSignInResponse.status).toBe(401);
  });

  test("can be run repeatedly without duplicating preset walks", async () => {
    await seedLocalDevPresets({ authProvider, walksRepository });
    const results = await seedLocalDevPresets({ authProvider, walksRepository });
    const usersByEmail = new Map(results.map((result) => [result.user.email, result]));

    for (const result of results) {
      expect(await walksRepository.getAllWalks(result.user.id)).toHaveLength(result.walkCount);
    }

    expect(usersByEmail.get("walker@example.com")?.walkCount).toBe(3);
    expect(usersByEmail.get("history@example.com")?.walkCount).toBe(12);
  });
});
