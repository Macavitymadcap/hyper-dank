import { Database } from "bun:sqlite";
import type { DatabaseProvider } from "./model";
import { SqliteWalkRepository } from "./repository";

export interface SqliteDatabaseProviderOptions {
  db?: Database;
  filename?: string;
}

const DEFAULT_SQLITE_FILENAME = "walking-pace.sqlite3";
const sqliteMigration = new URL("./migrations/sqlite/0001_create_walks.sql", import.meta.url);

export class SqliteDatabaseProvider implements DatabaseProvider {
  readonly kind = "sqlite";
  private readonly db: Database;

  constructor({ db, filename = DEFAULT_SQLITE_FILENAME }: SqliteDatabaseProviderOptions = {}) {
    this.db = db ?? new Database(filename, { create: true });
  }

  createWalkRepository() {
    return new SqliteWalkRepository({ db: this.db });
  }

  async migrate(): Promise<void> {
    const sql = await Bun.file(sqliteMigration).text();
    this.db.run(sql);
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

export const createSqliteDatabaseProvider = (options: SqliteDatabaseProviderOptions = {}) =>
  new SqliteDatabaseProvider(options);
