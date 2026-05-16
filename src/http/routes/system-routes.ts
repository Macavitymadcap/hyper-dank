import type { Hono } from "hono";
import type { AuthProvider } from "../../auth";

export class SystemRoutes {
  constructor(
    private readonly app: Hono,
    private readonly authProvider: AuthProvider,
  ) {}

  register(): void {
    this.app.get("/healthz", (context) => {
      return context.json({ ok: true });
    });

    this.app.all("/api/auth/*", (context) => this.authProvider.handler(context.req.raw));
  }
}
