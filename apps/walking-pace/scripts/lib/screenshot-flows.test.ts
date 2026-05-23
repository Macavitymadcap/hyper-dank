import { describe, expect, test } from "bun:test";
import { listScreenshotFlows, selectScreenshotFlows } from "./screenshot-flows";

describe("screenshot flows", () => {
  test("lists the hd-0010 Storybook visual review flow", () => {
    expect(listScreenshotFlows()).toContain(
      "hd-0010-storybook-groups: Visual review evidence for the shared Storybook groups rewritten in hd-0004.",
    );
  });

  test("captures every hd-0004 rewritten Storybook group", () => {
    const [flow] = selectScreenshotFlows(["hd-0010-storybook-groups"]);

    expect(flow?.states.map((state) => state.slug)).toEqual([
      "disclosure-and-menu",
      "surfaces-and-metadata",
      "shell-navigation-and-feedback",
      "content-and-empty-states",
      "reuse-set",
    ]);
    expect(flow?.states.map((state) => state.path)).toEqual([
      "/storybook/iframe.html?id=components-shared-existing-primitives--disclosure-and-menu",
      "/storybook/iframe.html?id=components-shared-existing-primitives--surfaces-and-metadata",
      "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--shell-navigation-and-feedback",
      "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--content-and-empty-states",
      "/storybook/iframe.html?id=components-shared-reusable-patterns--reuse-set",
    ]);
  });
});
