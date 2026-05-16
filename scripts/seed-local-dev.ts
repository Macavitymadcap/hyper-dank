#!/usr/bin/env bun
import type { Database } from "bun:sqlite";
import { createAuthProvider } from "../src/auth";
import { createDatabaseProvider, type DatabaseProvider } from "../src/db";
import {
  LOCAL_DEV_PASSWORD,
  resetSqliteLocalDevPresetUsers,
  seedLocalDevPresets,
} from "../src/dev/local-presets";

interface SqliteBackedDatabaseProvider extends DatabaseProvider {
  readonly kind: "sqlite";
  getDatabase(): Database;
}

if (process.env.DATABASE_URL) {
  throw new Error("seed:dev is local-only. Unset DATABASE_URL and use DB_PATH for SQLite.");
}

const databaseProvider = createDatabaseProvider();

try {
  await databaseProvider.migrate();

  if (!isSqliteBackedProvider(databaseProvider)) {
    throw new Error("seed:dev requires the SQLite database provider.");
  }

  resetSqliteLocalDevPresetUsers(databaseProvider.getDatabase());

  const authProvider = createAuthProvider({ databaseProvider });
  const results = await seedLocalDevPresets({
    authProvider,
    walksRepository: databaseProvider.createWalkRepository(),
  });

  console.info(`Seeded ${results.length} local dev users.`);
  console.info(`Shared password: ${LOCAL_DEV_PASSWORD}`);

  for (const result of results) {
    const status = result.user.banned ? "banned" : result.user.role;
    console.info(
      `- ${result.user.email} (${status}, ${result.walkCount} walks): ${result.profile}`,
    );
  }
} finally {
  await databaseProvider.close();
}

function isSqliteBackedProvider(
  databaseProvider: DatabaseProvider,
): databaseProvider is SqliteBackedDatabaseProvider {
  return databaseProvider.kind === "sqlite" && "getDatabase" in databaseProvider;
}
