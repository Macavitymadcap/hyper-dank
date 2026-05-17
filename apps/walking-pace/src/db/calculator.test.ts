import { describe, expect, test } from "bun:test";
import { validateWalkInput } from "../walks/validation";
import { Calculator } from "./calculator";

describe("Calculator", () => {
  test("calculates speed in miles per hour", () => {
    expect(Calculator.getSpeed(3, 30, 0)).toBeCloseTo(6);
  });

  test("calculates pace in minutes per mile", () => {
    expect(Calculator.getPace(2, 20, 30)).toBeCloseTo(10.25);
  });

  test("returns 0 for impossible speed or pace inputs", () => {
    expect(Calculator.getSpeed(0, 30, 0)).toBe(0);
    expect(Calculator.getSpeed(3, 0, 0)).toBe(0);
    expect(Calculator.getPace(0, 30, 0)).toBe(0);
  });

  test("calculates averages", () => {
    expect(Calculator.getAverage([2, 4, 6])).toBe(4);
    expect(Calculator.getAverage([])).toBe(0);
  });

  test("calculates odd and even medians", () => {
    expect(Calculator.getMedian([9, 1, 3])).toBe(3);
    expect(Calculator.getMedian([10, 1, 5, 7])).toBe(6);
    expect(Calculator.getMedian([])).toBe(0);
  });
});

describe("validateWalkInput", () => {
  test("accepts valid form values", () => {
    expect(validateWalkInput({ miles: "1.2", minutes: "18", seconds: "55" })).toEqual({
      ok: true,
      value: { miles: 1.2, minutes: 18, seconds: 55 },
    });
  });

  test("rejects missing, negative, fractional, and impossible values", () => {
    expect(validateWalkInput({ miles: "", minutes: "18", seconds: "55" }).ok).toBe(false);
    expect(validateWalkInput({ miles: "-1", minutes: "18", seconds: "55" }).ok).toBe(false);
    expect(validateWalkInput({ miles: "1", minutes: "1.5", seconds: "0" }).ok).toBe(false);
    expect(validateWalkInput({ miles: "1", minutes: "0", seconds: "60" }).ok).toBe(false);
    expect(validateWalkInput({ miles: "1", minutes: "0", seconds: "0" }).ok).toBe(false);
  });
});
