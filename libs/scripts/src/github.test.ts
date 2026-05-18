import { describe, expect, test } from "bun:test";
import { githubRequest, parseGitHubRepo } from "./github";

describe("github helpers", () => {
  test("parses GitHub shorthand and remotes", () => {
    expect(parseGitHubRepo("Macavitymadcap/hyper-dank")).toEqual({
      owner: "Macavitymadcap",
      name: "hyper-dank",
    });
    expect(parseGitHubRepo("git@github.com:Macavitymadcap/hyper-dank.git")).toEqual({
      owner: "Macavitymadcap",
      name: "hyper-dank",
    });
    expect(parseGitHubRepo("https://github.com/Macavitymadcap/hyper-dank.git")).toEqual({
      owner: "Macavitymadcap",
      name: "hyper-dank",
    });
  });

  test("formats GitHub API failures with repository context", async () => {
    const fetchImpl = async () =>
      new Response("bad credentials", {
        status: 401,
      });

    await expect(
      githubRequest(
        { owner: "Macavitymadcap", name: "hyper-dank" },
        "token",
        "/repos/Macavitymadcap/hyper-dank",
        {},
        { fetchImpl },
      ),
    ).rejects.toThrow("Macavitymadcap/hyper-dank: 401 bad credentials");
  });
});
