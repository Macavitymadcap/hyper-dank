import { Pool } from "pg";
import type { DatabaseProvider } from "../model";
import { PostgresInviteRepository } from "../repositories/postgres-invite-repository";
import { PostgresWalkRepository } from "../repositories/postgres-walk-repository";

export interface PostgresDatabaseProviderOptions {
  connectionString?: string;
  pool?: Pool;
}

interface Migration {
  version: string;
  path: URL;
}

const migrations: Migration[] = [
  {
    version: "0001_create_walks",
    path: new URL("../migrations/postgres/0001_create_walks.sql", import.meta.url),
  },
  {
    version: "0002_auth_invites_and_user_scoping",
    path: new URL("../migrations/postgres/0002_auth_invites_and_user_scoping.sql", import.meta.url),
  },
];

export class PostgresDatabaseProvider implements DatabaseProvider {
  readonly kind = "postgres";
  private readonly pool: Pool;

  constructor({ connectionString, pool }: PostgresDatabaseProviderOptions) {
    if (!connectionString && !pool) {
      throw new Error("PostgresDatabaseProvider requires a connection string or pool.");
    }

    this.pool = pool ?? new Pool({ connectionString });
  }

  createWalkRepository() {
    return new PostgresWalkRepository({ pool: this.pool });
  }

  createInviteRepository() {
    return new PostgresInviteRepository(this.pool);
  }

  createRepositories() {
    return {
      invites: this.createInviteRepository(),
      walks: this.createWalkRepository(),
    };
  }

  getPool(): Pool {
    return this.pool;
  }

  async migrate(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const migration of migrations) {
      const applied = await this.pool.query(
        "SELECT version FROM schema_migrations WHERE version = $1",
        [migration.version],
      );

      if (Number(applied.rowCount ?? 0) > 0) continue;

      const sql = await Bun.file(migration.path).text();
      const client = await this.pool.connect();

      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [
          migration.version,
        ]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export const createPostgresDatabaseProvider = (options: PostgresDatabaseProviderOptions) =>
  new PostgresDatabaseProvider(options);
