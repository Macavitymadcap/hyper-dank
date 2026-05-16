import { Hono } from "hono";
import { AdminPagePresenter } from "./admin-page-presenter";
import type { AppDependencies } from "./dependencies";
import { HttpResponder } from "./responder";
import { AdminRoutes } from "./routes/admin-routes";
import { AuthRoutes } from "./routes/auth-routes";
import { SystemRoutes } from "./routes/system-routes";
import { WalkRoutes } from "./routes/walk-routes";
import { SessionGuard } from "./session-guard";

export type { AppDependencies } from "./dependencies";

export const createApp = (dependencies: AppDependencies) => {
  const app = new Hono();
  const responder = new HttpResponder();
  const guard = new SessionGuard(dependencies.authProvider, responder);
  const adminPresenter = new AdminPagePresenter(
    dependencies.authProvider,
    dependencies.invitationService,
    dependencies.walksRepository,
    responder,
  );

  new SystemRoutes(app, dependencies.authProvider).register();
  new AuthRoutes(
    app,
    dependencies.authProvider,
    dependencies.invitationService,
    responder,
  ).register();
  new WalkRoutes(app, guard, responder, dependencies.walksRepository).register();
  new AdminRoutes(
    app,
    dependencies.authProvider,
    dependencies.invitationService,
    guard,
    adminPresenter,
    responder,
  ).register();

  return app;
};
