import { createApp } from "../app";
import { createSqliteDatabaseProvider } from "../db";

export const htmxHeaders = {
  "HX-Request": "true",
};

export const createAppHarness = async () => {
  const databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();

  const repository = databaseProvider.createWalkRepository();
  const app = createApp({ walksRepository: repository });

  const postWalk = (values: Record<string, string>, headers: Record<string, string> = {}) => {
    return app.request("/walks", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
      body: new URLSearchParams(values),
    });
  };

  const close = () => databaseProvider.close();

  return {
    app,
    close,
    databaseProvider,
    postWalk,
    repository,
  };
};
