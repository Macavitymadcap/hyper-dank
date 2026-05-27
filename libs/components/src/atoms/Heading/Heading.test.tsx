import { describe, expect, test } from "bun:test";
import { Heading } from "./Heading";

const render = (node: unknown): string => String(node);

describe("Heading", () => {
  test("renders semantic heading levels with separate visual hooks", () => {
    const html = render(
      <Heading id="section-title" level={3} visualLevel={2}>
        Section
      </Heading>,
    );

    expect(html).toBe('<h3 class="heading" data-level="2" id="section-title">Section</h3>');
  });
});
