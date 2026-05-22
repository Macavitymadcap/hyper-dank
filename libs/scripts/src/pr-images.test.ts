import { describe, expect, test } from "bun:test";
import { buildImagesSection, updateImagesSection } from "./pr-images";

describe("PR image helpers", () => {
  test("builds escaped raw GitHub image URLs", () => {
    const section = buildImagesSection({
      branch: "pace 0034",
      cacheKey: "abc 123",
      repo: { owner: "Macavitymadcap", name: "hyper-dank" },
      flows: [{ id: "walks", label: "Walks", states: [{ label: "No walks", slug: "none" }] }],
      screenshots: [
        {
          flowId: "walks",
          flowLabel: "Walks",
          label: "No walks",
          relativePath: "screenshots/no walks/light.png",
          stateSlug: "none",
          theme: "light",
        },
      ],
    });

    expect(section).toContain("https://raw.githubusercontent.com/");
    expect(section).toContain("pace%200034/screenshots/no%20walks/light.png?v=abc%20123");
  });

  test("replaces an existing images section", () => {
    expect(updateImagesSection("Intro\n\n## Images\nold\n\n## Checks\nok", "## Images\nnew")).toBe(
      "Intro\n\n## Images\nnew\n\n## Checks\nok",
    );
  });

  test("renders separate rows for mobile and desktop screenshots", () => {
    const section = buildImagesSection({
      branch: "pace-0034",
      repo: { owner: "Macavitymadcap", name: "hyper-dank" },
      flows: [{ id: "docs", label: "Docs", states: [{ label: "Home", slug: "home" }] }],
      screenshots: [
        {
          flowId: "docs",
          flowLabel: "Docs",
          label: "Home",
          relativePath: "screenshots/home-mobile-light.png",
          stateSlug: "home",
          theme: "light",
          viewportLabel: "Mobile",
          viewportSlug: "mobile",
        },
        {
          flowId: "docs",
          flowLabel: "Docs",
          label: "Home",
          relativePath: "screenshots/home-desktop-light.png",
          stateSlug: "home",
          theme: "light",
          viewportLabel: "Desktop",
          viewportSlug: "desktop",
        },
      ],
    });

    expect(section).toContain("| Docs | Home (Mobile) |");
    expect(section).toContain("| Docs | Home (Desktop) |");
  });
});
