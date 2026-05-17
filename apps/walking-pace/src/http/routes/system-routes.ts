import type { Hono } from "hono";
import type { AuthProvider } from "../../auth";
import { serveClientAsset, servePublicFile, serveStorybookFile } from "../static-assets";

export class SystemRoutes {
  constructor(
    private readonly app: Hono,
    private readonly authProvider: AuthProvider,
  ) {}

  register(): void {
    this.app.get("/assets/*", (context) => serveClientAsset(context));
    this.app.get("/favicon.svg", (context) => servePublicFile(context, "favicon.svg"));
    this.app.get("/robots.txt", (context) => servePublicFile(context, "robots.txt"));
    this.app.get("/storybook", (context) => context.redirect("/storybook/"));
    this.app.get("/storybook/*", (context) => serveStorybookFile(context));

    this.app.get("/healthz", (context) => {
      return context.json({ ok: true });
    });

    this.app.all("/api/auth/*", (context) => this.authProvider.handler(context.req.raw));
  }
}
