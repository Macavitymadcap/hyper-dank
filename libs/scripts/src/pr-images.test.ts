import { describe, expect, test } from "bun:test";
import { buildImagesSection, updateImagesSection } from "./pr-images";

describe("PR image helpers", () => {
  test("builds escaped raw GitHub image URLs", () => {
    const section = buildImagesSection({
      branch: "pace 0034",
      repo: { owner: "Macavitymadcap", name: "pace-calculator" },
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
    expect(section).toContain("pace%200034/screenshots/no%20walks/light.png");
  });

  test("replaces an existing images section", () => {
    expect(updateImagesSection("Intro\n\n## Images\nold\n\n## Checks\nok", "## Images\nnew")).toBe(
      "Intro\n\n## Images\nnew\n\n## Checks\nok",
    );
  });
});
