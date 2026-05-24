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

  test("captures hd-0024 status and notification evidence", () => {
    const [flow] = selectScreenshotFlows(["hd-0024-status-notifications"]);

    expect(flow?.states.map((state) => state.slug)).toEqual(["status-and-notifications"]);
    expect(flow?.states.map((state) => state.path)).toEqual([
      "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--status-and-notifications",
    ]);
  });

  test("captures hd-0025 dense table evidence", () => {
    const [flow] = selectScreenshotFlows(["hd-0025-data-tables"]);

    expect(flow?.states.map((state) => state.slug)).toEqual(["dense-dashboard-table"]);
    expect(flow?.states.map((state) => state.path)).toEqual([
      "/storybook/iframe.html?id=components-shared-molecules-scrollabletable--dense-dashboard-table",
    ]);
  });

  test("captures hd-0065 staged form evidence", () => {
    const [flow] = selectScreenshotFlows(["hd-0065-staged-form"]);

    expect(flow?.states.map((state) => state.slug)).toEqual([
      "staged-form-workflow",
      "staged-form-actions",
    ]);
    expect(flow?.states.map((state) => state.path)).toEqual([
      "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--staged-form-workflow",
      "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--staged-form-workflow",
    ]);
  });
});
