import type { HttpResponder } from "@macavitymadcap/hyper-dank-http";
import { errorMessage, FormValues, routeParam } from "@macavitymadcap/hyper-dank-http";
import type { Context, Hono } from "hono";
import type { AuthProvider, UserRole } from "../../auth";
import type { InvitationService } from "../../services/invitations";
import type { AdminPagePresenter } from "../admin-page-presenter";
import type { SessionGuard } from "../session-guard";

export class AdminRoutes {
  constructor(
    private readonly app: Hono,
    private readonly authProvider: AuthProvider,
    private readonly invitationService: InvitationService,
    private readonly guard: SessionGuard,
    private readonly presenter: AdminPagePresenter,
    private readonly responder: HttpResponder,
  ) {}

  register(): void {
    this.app.get("/admin", (context) => this.showAdmin(context));
    this.app.post("/admin/invites", (context) => this.createInvite(context));
    this.app.post("/admin/invites/:id/revoke", (context) => this.revokeInvite(context));
    this.app.post("/admin/users/:id/role", (context) => this.setRole(context));
    this.app.post("/admin/users/:id/ban", (context) => this.banUser(context));
    this.app.post("/admin/users/:id/unban", (context) => this.unbanUser(context));
  }

  private async showAdmin(context: Context) {
    const auth = await this.guard.requireAdmin(context);
    if ("response" in auth) return auth.response;

    return this.presenter.render(context);
  }

  private async createInvite(context: Context) {
    const auth = await this.guard.requireAdmin(context);
    if ("response" in auth) return auth.response;

    const form = await FormValues.from(context);
    try {
      await this.invitationService.createInvitation({
        email: form.string("email"),
        role: userRole(form.string("role")),
        invitedByUserId: auth.session.user.id,
      });
    } catch (error) {
      return this.presenter.render(context, errorMessage(error));
    }

    return this.responder.redirectAfterAction(context, "/admin");
  }

  private async revokeInvite(context: Context) {
    const auth = await this.guard.requireAdmin(context);
    if ("response" in auth) return auth.response;

    await this.invitationService.revokeInvitation(routeParam(context, "id"));
    return this.responder.redirectAfterAction(context, "/admin");
  }

  private async setRole(context: Context) {
    const auth = await this.guard.requireAdmin(context);
    if ("response" in auth) return auth.response;

    const form = await FormValues.from(context);
    await this.authProvider.setUserRole(routeParam(context, "id"), userRole(form.string("role")));
    return this.responder.redirectAfterAction(context, "/admin");
  }

  private async banUser(context: Context) {
    const auth = await this.guard.requireAdmin(context);
    if ("response" in auth) return auth.response;

    await this.authProvider.setUserBanned(routeParam(context, "id"), true);
    return this.responder.redirectAfterAction(context, "/admin");
  }

  private async unbanUser(context: Context) {
    const auth = await this.guard.requireAdmin(context);
    if ("response" in auth) return auth.response;

    await this.authProvider.setUserBanned(routeParam(context, "id"), false);
    return this.responder.redirectAfterAction(context, "/admin");
  }
}

function userRole(value: string): UserRole {
  return value === "admin" ? "admin" : "user";
}
