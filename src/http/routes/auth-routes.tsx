import type { Context, Hono } from "hono";
import type { AuthProvider } from "../../auth";
import { InviteForm, InvitePage, LoginForm, LoginPage } from "../../components";
import type { InvitationService } from "../../services/invitations";
import { errorMessage, FormValues, routeParam } from "../form-values";
import type { HttpResponder } from "../responder";

export class AuthRoutes {
  constructor(
    private readonly app: Hono,
    private readonly authProvider: AuthProvider,
    private readonly invitationService: InvitationService,
    private readonly responder: HttpResponder,
  ) {}

  register(): void {
    this.app.get("/login", (context) => this.showLogin(context));
    this.app.post("/login", (context) => this.login(context));
    this.app.post("/logout", (context) => this.logout(context));
    this.app.get("/invite/:token", (context) => {
      return context.html(<InvitePage token={context.req.param("token")} />);
    });
    this.app.post("/invite/:token", (context) => this.acceptInvite(context));
  }

  private async showLogin(context: Context) {
    const session = await this.authProvider.getSession(context.req.raw);
    if (session) return context.redirect("/", 303);

    return context.html(<LoginPage />);
  }

  private async login(context: Context) {
    const form = await FormValues.from(context);
    const authResponse = await this.authProvider.signIn(
      {
        email: form.string("email"),
        password: form.string("password"),
      },
      context.req.raw,
    );

    if (!authResponse.ok) {
      if (this.responder.isHtmxRequest(context)) {
        return context.html(<LoginForm error="Invalid email or password." />);
      }

      return context.html(<LoginPage error="Invalid email or password." />, 401);
    }

    return this.responder.redirectWithAuthCookies(context, "/", authResponse);
  }

  private async logout(context: Context) {
    const authResponse = await this.authProvider.signOut(context.req.raw);
    return this.responder.redirectWithAuthCookies(context, "/login", authResponse);
  }

  private async acceptInvite(context: Context) {
    const token = routeParam(context, "token");
    const form = await FormValues.from(context);
    const password = form.string("password");

    try {
      const user = await this.invitationService.acceptInvitation({
        token,
        name: form.string("name"),
        password,
      });
      const authResponse = await this.authProvider.signIn(
        {
          email: user.email,
          password,
        },
        context.req.raw,
      );

      return this.responder.redirectWithAuthCookies(context, "/", authResponse);
    } catch (error) {
      if (this.responder.isHtmxRequest(context)) {
        return context.html(<InviteForm token={token} error={errorMessage(error)} />);
      }

      return context.html(<InvitePage token={token} error={errorMessage(error)} />, 400);
    }
  }
}
