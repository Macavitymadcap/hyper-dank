import { describe, expect, test } from "bun:test";
import { Container } from "./Container";

const render = (node: unknown): string => String(node);

describe("Container", () => {
  test("renders a semantic width-constrained wrapper", () => {
    const html = render(
      <Container as="main" id="content" labelledBy="content-title" width="wide" maxWidth="72rem">
        <h1 id="content-title">Content</h1>
      </Container>,
    );

    expect(html).toContain('<main aria-labelledby="content-title"');
    expect(html).toContain('class="container"');
    expect(html).toContain('data-width="wide"');
    expect(html).toContain("--container-max-width: 72rem");
  });
});
