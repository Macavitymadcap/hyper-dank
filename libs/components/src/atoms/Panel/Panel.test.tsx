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
});
