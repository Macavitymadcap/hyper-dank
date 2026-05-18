import { describe, expect, test } from "bun:test";
import {
  DEFAULT_PAGES_BASE_PATH,
  githubOutputForPagesBasePath,
  normalizePagesBasePath,
  paceDemoBaseFromPagesBasePath,
  resolvePagesBasePath,
  withJekyllBaseUrl,
} from "./pages-base";

describe("Pages base path helpers", () => {
  test("normalizes GitHub Pages project paths", () => {
    expect(normalizePagesBasePath("hyper-dank")).toBe("/hyper-dank");
    expect(normalizePagesBasePath("/hyper-dank/")).toBe("/hyper-dank");
    expect(normalizePagesBasePath("/")).toBe("");
  });

  test("rejects URLs and nested paths", () => {
    expect(() => normalizePagesBasePath("https://example.com/hyper-dank")).toThrow(
      "must be a path",
    );
    expect(() => normalizePagesBasePath("/org/hyper-dank")).toThrow(
      "single GitHub Pages project path",
    );
  });

  test("uses explicit base path before repository slug", () => {
    expect(
      resolvePagesBasePath({
        GITHUB_REPOSITORY: "Macavitymadcap/hyper-dank",
        PAGES_BASE_PATH: "/hyper-dank",
      }),
    ).toBe("/hyper-dank");
  });

  test("derives the project path from the current repository name", () => {
    expect(resolvePagesBasePath({ GITHUB_REPOSITORY: "Macavitymadcap/hyper-dank" })).toBe(
      "/hyper-dank",
    );
  });

  test("falls back to the final Hyper-Dank project path outside GitHub Actions", () => {
    expect(resolvePagesBasePath({})).toBe(DEFAULT_PAGES_BASE_PATH);
  });

  test("derives the static pace demo base from the Pages path", () => {
    expect(paceDemoBaseFromPagesBasePath("/hyper-dank")).toBe("/hyper-dank/pace/");
    expect(paceDemoBaseFromPagesBasePath("/")).toBe("/pace/");
  });

  test("formats GitHub Actions outputs", () => {
    expect(githubOutputForPagesBasePath("/hyper-dank")).toBe(
      "base_path=/hyper-dank\npace_demo_base=/hyper-dank/pace/\n",
    );
  });

  test("updates the Jekyll baseurl entry", () => {
    expect(withJekyllBaseUrl('title: Hyper-Dank\nbaseurl: "/old-path"\n', "/hyper-dank")).toBe(
      'title: Hyper-Dank\nbaseurl: "/hyper-dank"\n',
    );
  });

  test("allows an already-correct Jekyll baseurl entry", () => {
    expect(withJekyllBaseUrl('title: Hyper-Dank\nbaseurl: "/hyper-dank"\n', "/hyper-dank")).toBe(
      'title: Hyper-Dank\nbaseurl: "/hyper-dank"\n',
    );
  });
});
