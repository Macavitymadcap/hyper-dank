import { createApp } from "../app";
import { Repository } from "../db";

export const htmxHeaders = {
  "HX-Request": "true",
};

export const createAppHarness = () => {
  const repository = new Repository({ filename: ":memory:" });
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

  const close = () => repository.close();

  return {
    app,
    close,
    postWalk,
    repository,
  };
};
