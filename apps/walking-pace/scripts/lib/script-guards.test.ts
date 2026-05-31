import { describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fetchWithTimeout, parseJsonText, readJsonFile, responseJson } from "./script-guards";

describe("script guard helpers", () => {
  test("parses JSON files and includes file paths in parse failures", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-script-guards-"));
    const filePath = path.join(directory, "package.json");

    try {
      await writeFile(filePath, '{"name":"hyper-dank"}\n');
      expect(await readJsonFile<{ name: string }>(filePath)).toEqual({ name: "hyper-dank" });

      await writeFile(filePath, "{");
      await expect(readJsonFile(filePath)).rejects.toThrow(`Could not parse JSON from ${filePath}`);
    } finally {
      await rm(directory, { force: true, recursive: true });
    }
  });

  test("parses inline JSON with source labels", () => {
    expect(parseJsonText<{ ok: true }>("inline", '{"ok":true}')).toEqual({ ok: true });
    expect(() => parseJsonText("inline", "{")).toThrow("Could not parse JSON from inline");
  });

  test("wraps fetch failures and timeouts with the requested URL", async () => {
    await expect(
      fetchWithTimeout("https://registry.example.test/pkg", {
        fetchImpl: () => {
          throw new Error("network down");
        },
      }),
    ).rejects.toThrow("Could not fetch https://registry.example.test/pkg: network down");

    await expect(
      fetchWithTimeout("https://registry.example.test/slow", {
        fetchImpl: (_url, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
          }),
        timeoutMs: 1,
      }),
    ).rejects.toThrow("Could not fetch https://registry.example.test/slow within 1ms.");
  });

  test("wraps response JSON parse failures with the requested URL", async () => {
    const response = new Response("{", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    await expect(responseJson(response, "https://registry.example.test/pkg")).rejects.toThrow(
      "Could not parse JSON from https://registry.example.test/pkg",
    );
  });
});
