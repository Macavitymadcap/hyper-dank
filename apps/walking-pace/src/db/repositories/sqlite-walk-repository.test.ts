import { describe, test } from "bun:test";
import { describeWalkRepositoryContract } from "../contracts/repository-contracts";
import { createSqliteDatabaseProvider } from "../providers/sqlite-provider";
import { SqliteWalkRepository } from "./sqlite-walk-repository";

describeWalkRepositoryContract("SqliteWalkRepository contract", async () => {
  const databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();

  return {
    repository: databaseProvider.createWalkRepository(),
    cleanup: () => databaseProvider.close(),
  };
});

describe("SqliteWalkRepository", () => {
  test("can own and close its default database connection", () => {
    const repository = new SqliteWalkRepository({ filename: ":memory:" });

    repository.migrate();
    repository.close();
  });
});
