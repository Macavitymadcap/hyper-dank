import type { Context } from "hono";
import type { UserRole } from "../auth";

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

  role(key: string): UserRole {
    return this.string(key) === "admin" ? "admin" : "user";
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function routeParam(context: Context, key: string): string {
  return context.req.param(key) ?? "";
}
