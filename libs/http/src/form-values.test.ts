import { describe, expect, test } from "bun:test";
import type { Context } from "hono";
import { errorMessage, FormValues, routeParam } from "./form-values";

describe("FormValues", () => {
  test("reads strings and exposes the raw body", () => {
    const values = new FormValues({ email: "user@example.com", role: "admin", other: 42 });

    expect(values.raw).toEqual({ email: "user@example.com", role: "admin", other: 42 });
    expect(values.string("email")).toBe("user@example.com");
    expect(values.string("missing")).toBe("");
    expect(values.string("other")).toBe("");
  });

  test("reads optional strings, numbers, and checkbox-style booleans", () => {
    const values = new FormValues({
      confirmed: "on",
      disabled: "false",
      empty: "",
      repeated: ["one", "two"],
      retries: "3",
      title: "Draft",
      invalid: "three",
    });

    expect(values.optionalString("title")).toBe("Draft");
    expect(values.optionalString("missing")).toBeUndefined();
    expect(values.optionalString("repeated")).toBeUndefined();
    expect(values.number("retries")).toBe(3);
    expect(values.number("empty")).toBeUndefined();
    expect(values.number("invalid")).toBeUndefined();
    expect(values.boolean("confirmed")).toBe(true);
    expect(values.boolean("disabled")).toBe(false);
    expect(values.boolean("missing")).toBe(false);
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
