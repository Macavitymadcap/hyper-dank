import type { HttpResponder } from "@macavitymadcap/hyper-dank-http";
import type { Context } from "hono";
import type { AuthProvider, AuthSession } from "../auth";

type SessionResult = { session: AuthSession } | { response: Response };

export class SessionGuard {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly responder: HttpResponder,
  ) {}

  async requireSession(context: Context): Promise<SessionResult> {
    const session = await this.authProvider.getSession(context.req.raw);

    if (!session) {
      return {
        response: this.responder.redirectAfterAction(context, "/login"),
      };
    }

    return { session };
  }

  async requireAdmin(context: Context): Promise<SessionResult> {
    const auth = await this.requireSession(context);
    if ("response" in auth) return auth;

    if (auth.session.user.role !== "admin") {
      return {
        response: context.text("Admin access required.", 403),
      };
    }

    return auth;
  }
}
