import { describe, expect, test } from "bun:test";
import { ValidationSummary } from "./ValidationSummary";

const render = (node: unknown): string => String(node);

describe("ValidationSummary", () => {
  test("renders alert with linked validation messages", () => {
    const html = render(
      <ValidationSummary
        items={[{ href: "#title", message: "Enter a title" }, { message: "Choose a status" }]}
      />,
    );

    expect(html).toContain('class="validation-summary"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('tabIndex="-1"');
    expect(html).toContain("<h2>There is a problem</h2>");
    expect(html).toContain('<a href="#title">Enter a title</a>');
    expect(html).toContain("<li>Choose a status</li>");
  });

  test("renders nothing when there are no messages", () => {
    expect(render(<ValidationSummary items={[]} />)).toBe("");
  });
});
