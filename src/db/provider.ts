import type { DatabaseProvider } from "./model";
import { createPostgresDatabaseProvider } from "./postgres-provider";
import { createSqliteDatabaseProvider } from "./sqlite-provider";

export interface DatabaseEnvironment {
  DATABASE_URL?: string;
  DB_PATH?: string;
}

export const createDatabaseProvider = (
  environment?: DatabaseEnvironment,
): DatabaseProvider => {
  const env = environment ?? {
    DATABASE_URL: process.env.DATABASE_URL,
    DB_PATH: process.env.DB_PATH,
  };

  if (env.DATABASE_URL) {
    return createPostgresDatabaseProvider({ connectionString: env.DATABASE_URL });
  }

  return createSqliteDatabaseProvider({ filename: env.DB_PATH });
};
