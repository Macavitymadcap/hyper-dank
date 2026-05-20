import { describe, expect, test } from "bun:test";
import { summariseScreenshotTargets } from "./browser";

describe("browser helpers", () => {
  test("summarises screenshot targets without page or server fixtures", () => {
    const targets = summariseScreenshotTargets(
      [
        {
          id: "admin",
          label: "Admin",
          description: "Admin states",
          states: [
            { label: "List", slug: "list", path: "/admin" },
            { label: "Empty", slug: "empty" },
          ],
        },
      ],
      ["light"],
    );

    expect(targets).toEqual([
      {
        flowId: "admin",
        flowLabel: "Admin",
        label: "List",
        path: "/admin",
        slug: "list",
        themes: ["light"],
      },
      {
        flowId: "admin",
        flowLabel: "Admin",
        label: "Empty",
        path: "/",
        slug: "empty",
        themes: ["light"],
      },
    ]);
  });
});
