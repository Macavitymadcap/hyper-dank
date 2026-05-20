import type { Context } from "hono";

export class FormValues {
  static async from(context: Context): Promise<FormValues> {
    return new FormValues(await context.req.parseBody());
  }

  constructor(private readonly body: Record<string, unknown>) {}

  get raw(): Record<string, unknown> {
    return this.body;
  }

  string(key: string): string {
    const value = this.body[key];
    return typeof value === "string" ? value : "";
  }

  optionalString(key: string): string | undefined {
    const value = this.body[key];
    return typeof value === "string" ? value : undefined;
  }

  number(key: string): number | undefined {
    const value = this.optionalString(key);
    if (value === undefined || value.trim() === "") return undefined;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  boolean(key: string): boolean {
    const value = this.body[key];
    if (typeof value !== "string") return false;

    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function routeParam(context: Context, key: string): string {
  return context.req.param(key) ?? "";
}
