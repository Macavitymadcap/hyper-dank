import { Database } from "bun:sqlite";
import type { DatabaseProvider } from "../model";
import { SqliteInviteRepository } from "../repositories/sqlite-invite-repository";
import { SqliteWalkRepository } from "../repositories/sqlite-walk-repository";

export interface SqliteDatabaseProviderOptions {
  db?: Database;
  filename?: string;
}

const DEFAULT_SQLITE_FILENAME = "walking-pace.sqlite3";

interface Migration {
  version: string;
  path: URL;
}

const migrations: Migration[] = [
  {
    version: "0001_create_walks",
    path: new URL("../migrations/sqlite/0001_create_walks.sql", import.meta.url),
  },
  {
    version: "0002_auth_invites_and_user_scoping",
    path: new URL("../migrations/sqlite/0002_auth_invites_and_user_scoping.sql", import.meta.url),
  },
  {
    version: "0003_local_auth",
    path: new URL("../migrations/sqlite/0003_local_auth.sql", import.meta.url),
  },
];

export class SqliteDatabaseProvider implements DatabaseProvider {
  readonly kind = "sqlite";
  private readonly db: Database;

  constructor({ db, filename = DEFAULT_SQLITE_FILENAME }: SqliteDatabaseProviderOptions = {}) {
    this.db = db ?? new Database(filename, { create: true });
  }

  createWalkRepository() {
    return new SqliteWalkRepository({ db: this.db });
  }

  createInviteRepository() {
    return new SqliteInviteRepository(this.db);
  }

  createRepositories() {
    return {
      invites: this.createInviteRepository(),
      walks: this.createWalkRepository(),
    };
  }

  getDatabase(): Database {
    return this.db;
  }

  async migrate(): Promise<void> {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const migration of migrations) {
      const applied = this.db
        .query("SELECT version FROM schema_migrations WHERE version = ?")
        .get(migration.version);

      if (applied) continue;

      const sql = await Bun.file(migration.path).text();

      this.db.transaction(() => {
        this.db.run(sql);
        this.db.query("INSERT INTO schema_migrations (version) VALUES (?)").run(migration.version);
      })();
    }
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

export const createSqliteDatabaseProvider = (options: SqliteDatabaseProviderOptions = {}) =>
  new SqliteDatabaseProvider(options);
