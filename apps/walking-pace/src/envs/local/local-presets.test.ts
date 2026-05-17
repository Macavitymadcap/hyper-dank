import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { TestAuthProvider } from "../../auth";
import {
  createSqliteDatabaseProvider,
  type DatabaseProvider,
  SqliteDatabaseProvider,
  type WalkRepository,
} from "../../db";
import {
  LOCAL_DEV_PASSWORD,
  LOCAL_DEV_PRESET_USERS,
  resetSqliteLocalDevPresetUsers,
  seedLocalDevPresets,
} from "./local-presets";

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

  test("resets only SQLite records owned by preset users", () => {
    if (!(databaseProvider instanceof SqliteDatabaseProvider)) {
      throw new Error("Expected SQLite provider");
    }
    const db = databaseProvider.getDatabase();

    resetSqliteLocalDevPresetUsers(db, []);
    db.query(
      `INSERT INTO local_auth_users (id, email, name, password_hash, role, banned)
      VALUES (?, ?, ?, ?, ?, ?)`,
    ).run("preset-admin", "admin@example.com", "Admin", "hash", "admin", 0);
    db.query(
      `INSERT INTO local_auth_users (id, email, name, password_hash, role, banned)
      VALUES (?, ?, ?, ?, ?, ?)`,
    ).run("outside-user", "outside@example.com", "Outside", "hash", "user", 0);
    db.query("INSERT INTO walks (user_id, miles, minutes, seconds) VALUES (?, ?, ?, ?)").run(
      "preset-admin",
      1,
      20,
      0,
    );
    db.query("INSERT INTO walks (user_id, miles, minutes, seconds) VALUES (?, ?, ?, ?)").run(
      "outside-user",
      2,
      30,
      0,
    );
    db.query("INSERT INTO local_auth_sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
      "session-1",
      "preset-admin",
      "2099-01-01T00:00:00.000Z",
    );
    db.query(
      `INSERT INTO invitations (id, email, role, token_hash, status, invited_by_user_id, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run("invite-1", "admin@example.com", "admin", "token-1", "pending", "outside-user", "2099");
    db.query(
      `INSERT INTO invitations (id, email, role, token_hash, status, invited_by_user_id, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run("invite-2", "outside@example.com", "user", "token-2", "pending", "outside-user", "2099");
    const adminPreset = LOCAL_DEV_PRESET_USERS[0];
    if (!adminPreset) throw new Error("Expected admin preset");

    resetSqliteLocalDevPresetUsers(db, [adminPreset]);

    expect(db.query("SELECT id FROM local_auth_users WHERE id = ?").get("preset-admin")).toBeNull();
    expect(
      db.query("SELECT token FROM local_auth_sessions WHERE token = ?").get("session-1"),
    ).toBeNull();
    expect(db.query("SELECT id FROM walks WHERE user_id = ?").get("preset-admin")).toBeNull();
    expect(db.query("SELECT id FROM invitations WHERE id = ?").get("invite-1")).toBeNull();
    expect(
      db.query("SELECT id FROM local_auth_users WHERE id = ?").get("outside-user"),
    ).toBeTruthy();
    expect(db.query("SELECT id FROM walks WHERE user_id = ?").get("outside-user")).toBeTruthy();
    expect(db.query("SELECT id FROM invitations WHERE id = ?").get("invite-2")).toBeTruthy();
  });
});
