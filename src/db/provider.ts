import type { DatabaseProvider } from "./model";
import { createPostgresDatabaseProvider } from "./postgres-provider";
import { createSqliteDatabaseProvider } from "./sqlite-provider";

export interface DatabaseEnvironment {
  DATABASE_URL?: string;
  DB_PATH?: string;
}

export const createDatabaseProvider = (
  environment: DatabaseEnvironment = {
    DATABASE_URL: process.env.DATABASE_URL,
    DB_PATH: process.env.DB_PATH,
  },
): DatabaseProvider => {
  if (environment.DATABASE_URL) {
    return createPostgresDatabaseProvider({ connectionString: environment.DATABASE_URL });
  }

  return createSqliteDatabaseProvider({ filename: environment.DB_PATH });
};
