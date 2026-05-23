import { describe, expect, test } from "bun:test";
import { Kbd } from "./Kbd";

const render = (node: unknown): string => String(node);

describe("Kbd", () => {
  test("renders keyboard input text", () => {
    expect(render(<Kbd>Esc</Kbd>)).toBe('<kbd class="kbd">Esc</kbd>');
  });
});
