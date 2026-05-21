import { describe, expect, test } from "bun:test";
import { Prose } from "./Prose";

const render = (node: unknown): string => String(node);

describe("Prose", () => {
  test("renders readable content inside an article wrapper", () => {
    const html = render(
      <Prose>
        <p>Body</p>
      </Prose>,
    );

    expect(html).toContain('<article class="prose">');
    expect(html).toContain("<p>Body</p>");
  });
});
