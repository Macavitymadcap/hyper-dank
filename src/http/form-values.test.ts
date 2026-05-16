import { describe, expect, test } from "bun:test";
import type { Context } from "hono";
import { errorMessage, FormValues, routeParam } from "./form-values";

describe("FormValues", () => {
  test("reads strings and normalizes roles", () => {
    const values = new FormValues({ email: "user@example.com", role: "admin", other: 42 });

    expect(values.string("email")).toBe("user@example.com");
    expect(values.string("other")).toBe("");
    expect(values.role("role")).toBe("admin");
    expect(values.role("missing")).toBe("user");
  });
});

describe("errorMessage", () => {
  test("formats unknown errors safely", () => {
    expect(errorMessage(new Error("Boom"))).toBe("Boom");
    expect(errorMessage("nope")).toBe("Something went wrong.");
  });
});

describe("routeParam", () => {
  test("normalizes missing route params to empty strings", () => {
    const context = {
      req: {
        param: (key: string) => (key === "id" ? "user-1" : undefined),
      },
    } as Context;

    expect(routeParam(context, "id")).toBe("user-1");
    expect(routeParam(context, "missing")).toBe("");
  });
});
