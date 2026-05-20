import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { assertStaticArtifact, smokeStaticSite } from "./static-site";

describe("static-site helpers", () => {
  test("asserts static artifacts and expected content", async () => {
    const siteRoot = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-static-site-"));
    await mkdir(path.join(siteRoot, "docs"), { recursive: true });
    await writeFile(path.join(siteRoot, "docs/index.html"), "<h1>Docs</h1>");

    await expect(
      assertStaticArtifact(siteRoot, { path: "docs/index.html", includes: "Docs" }),
    ).resolves.toBe(path.join(siteRoot, "docs/index.html"));
    await expect(
      smokeStaticSite({
        root: siteRoot,
        routes: [{ path: "docs/index.html", includes: ["<h1>", "Docs"] }],
      }),
    ).resolves.toEqual([path.join(siteRoot, "docs/index.html")]);
  });

  test("rejects missing or escaping static artifact paths", async () => {
    const siteRoot = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-static-site-"));

    await expect(assertStaticArtifact(siteRoot, { path: "missing.html" })).rejects.toThrow(
      "Missing static artifact: missing.html",
    );
    await expect(assertStaticArtifact(siteRoot, { path: "../outside.html" })).rejects.toThrow(
      "Static artifact path escapes root: ../outside.html",
    );
  });
});
