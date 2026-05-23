import { describe, expect, test } from "bun:test";
import { BasicGraph } from "./BasicGraph";

const render = (node: unknown): string => String(node);

describe("BasicGraph", () => {
  test("renders an accessible labelled bar graph", () => {
    const html = render(
      <BasicGraph
        id="publishing"
        title="Publishing activity"
        summary="Three published posts and one draft."
        data={[
          { label: "Published", value: 3 },
          { label: "Draft", value: 1 },
        ]}
      />,
    );

    expect(html).toContain('class="basic-graph"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-labelledby="publishing-title publishing-summary"');
    expect(html).toContain('<title id="publishing-title">Publishing activity</title>');
    expect(html).toContain(
      '<desc id="publishing-summary">Three published posts and one draft.</desc>',
    );
    expect(html).toContain('class="basic-graph-axis"');
    expect(html).toContain('class="basic-graph-bar"');
    expect(html).toContain('class="basic-graph-label"');
    expect(html).toContain(">Published</text>");
    expect(html).toContain(">3</text>");
    expect(html).toContain("<figcaption");
  });

  test("renders a line graph with generated summary text", () => {
    const html = render(
      <BasicGraph
        id="readers"
        kind="line"
        title="Readers"
        valueFormatter={(value) => `${value} visits`}
        data={[
          { label: "Mon", value: 8 },
          { label: "Tue", value: 12 },
        ]}
      />,
    );

    expect(html).toContain('class="basic-graph-line"');
    expect(html).toContain('class="basic-graph-value"');
    expect(html).toContain(">8 visits</text>");
    expect(html).toContain("Mon: 8 visits; Tue: 12 visits");
  });
});
