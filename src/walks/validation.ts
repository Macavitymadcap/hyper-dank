import type { WalkInput } from "../db";

export type WalkInputValidation = { ok: true; value: WalkInput } | { ok: false; message: string };

const readRequiredNumber = (value: unknown): number => {
  if (value === null || value === undefined) return Number.NaN;

  const text = String(value).trim();
  if (text.length === 0) return Number.NaN;

  return Number(text);
};

export const validateWalkInput = (values: Record<string, unknown>): WalkInputValidation => {
  const miles = readRequiredNumber(values.miles);
  const minutes = readRequiredNumber(values.minutes);
  const seconds = readRequiredNumber(values.seconds);

  if (!Number.isFinite(miles) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return { ok: false, message: "Miles, minutes, and seconds are required numbers." };
  }

  if (miles <= 0) {
    return { ok: false, message: "Miles must be greater than zero." };
  }

  if (!Number.isInteger(minutes) || minutes < 0) {
    return { ok: false, message: "Minutes must be a whole number of zero or more." };
  }

  if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
    return { ok: false, message: "Seconds must be a whole number from 0 to 59." };
  }

  if (minutes === 0 && seconds === 0) {
    return { ok: false, message: "Duration must be greater than zero." };
  }

  return { ok: true, value: { miles, minutes, seconds } };
};
