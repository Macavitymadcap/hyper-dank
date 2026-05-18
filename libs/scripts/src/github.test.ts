import { describe, expect, test } from "bun:test";
import { githubRequest, parseGitHubRepo } from "./github";

describe("github helpers", () => {
  test("parses GitHub shorthand and remotes", () => {
    expect(parseGitHubRepo("Macavitymadcap/pace-calculator")).toEqual({
      owner: "Macavitymadcap",
      name: "pace-calculator",
    });
    expect(parseGitHubRepo("git@github.com:Macavitymadcap/pace-calculator.git")).toEqual({
      owner: "Macavitymadcap",
      name: "pace-calculator",
    });
    expect(parseGitHubRepo("https://github.com/Macavitymadcap/pace-calculator.git")).toEqual({
      owner: "Macavitymadcap",
      name: "pace-calculator",
    });
  });

  test("formats GitHub API failures with repository context", async () => {
    const fetchImpl = async () =>
      new Response("bad credentials", {
        status: 401,
      });

    await expect(
      githubRequest(
        { owner: "Macavitymadcap", name: "pace-calculator" },
        "token",
        "/repos/Macavitymadcap/pace-calculator",
        {},
        { fetchImpl },
      ),
    ).rejects.toThrow("Macavitymadcap/pace-calculator: 401 bad credentials");
  });
});
