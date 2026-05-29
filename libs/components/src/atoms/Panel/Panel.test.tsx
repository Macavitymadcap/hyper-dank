import { describe, expect, test } from "bun:test";
import { Panel } from "./Panel";

describe("Panel", () => {
  test("renders a labelled section", () => {
    const html = String(
      <Panel labelledBy="panel-title" width="narrow">
        Content
      </Panel>,
    );

    expect(html).toContain('aria-labelledby="panel-title"');
    expect(html).toContain('data-width="narrow"');
  });

  test("supports predictable ariaLabelledBy, ariaLabel, and app styling hooks", () => {
    const html = String(
      <Panel ariaLabel="Panel region" ariaLabelledBy="panel-title" className="settings-panel">
        Content
      </Panel>,
    );

    expect(html).toContain('class="panel settings-panel"');
    expect(html).toContain('aria-label="Panel region"');
    expect(html).toContain('aria-labelledby="panel-title"');
  });
});
