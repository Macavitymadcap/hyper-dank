import { describeInviteRepositoryContract } from "../contracts/repository-contracts";
import { createSqliteDatabaseProvider } from "../providers/sqlite-provider";

describeInviteRepositoryContract("SqliteInviteRepository contract", async () => {
  const provider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await provider.migrate();

  return {
    repository: provider.createInviteRepository(),
    cleanup: () => provider.close(),
  };
});
