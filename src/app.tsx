import type { Context } from "hono";
import { Hono } from "hono";
import type { AuthProvider, UserRole } from "./auth";
import { AdminPage, Home, InvitePage, LoginPage, StatsSection, WalksTable } from "./components";
import type { WalkRepository } from "./db";
import type { InvitationService } from "./invitations";
import { validateWalkInput } from "./walks/validation";

export interface AppDependencies {
  authProvider: AuthProvider;
  invitationService: InvitationService;
  walksRepository: WalkRepository;
}

export const createApp = ({
  authProvider,
  invitationService,
  walksRepository,
}: AppDependencies) => {
  const app = new Hono();

  app.get("/healthz", (context) => {
    return context.json({ ok: true });
  });

  app.all("/api/auth/*", (context) => authProvider.handler(context.req.raw));

  app.get("/login", async (context) => {
    const session = await authProvider.getSession(context.req.raw);
    if (session) return context.redirect("/", 303);

    return context.html(<LoginPage />);
  });

  app.post("/login", async (context) => {
    const body = await context.req.parseBody();
    const email = getString(body, "email");
    const password = getString(body, "password");
    const authResponse = await authProvider.signIn({ email, password }, context.req.raw);

    if (!authResponse.ok) {
      return context.html(<LoginPage error="Invalid email or password." />, 401);
    }

    return redirectWithAuthCookies(context, "/", authResponse);
  });

  app.post("/logout", async (context) => {
    const authResponse = await authProvider.signOut(context.req.raw);
    return redirectWithAuthCookies(context, "/login", authResponse);
  });

  app.get("/invite/:token", (context) => {
    return context.html(<InvitePage token={context.req.param("token")} />);
  });

  app.post("/invite/:token", async (context) => {
    const token = context.req.param("token");
    const body = await context.req.parseBody();
    const name = getString(body, "name");
    const password = getString(body, "password");

    try {
      const user = await invitationService.acceptInvitation({ token, name, password });
      const authResponse = await authProvider.signIn(
        {
          email: user.email,
          password,
        },
        context.req.raw,
      );

      return redirectWithAuthCookies(context, "/", authResponse);
    } catch (error) {
      return context.html(<InvitePage token={token} error={errorMessage(error)} />, 400);
    }
  });

  app.get("/", async (context) => {
    const auth = await requireSession(context, authProvider);
    if ("response" in auth) return auth.response;

    const walks = await walksRepository.getAllWalks(auth.session.user.id);
    const stats = await walksRepository.getStats(auth.session.user.id);

    return context.html(<Home walks={walks} stats={stats} user={auth.session.user} />);
  });

  app.get("/stats", async (context) => {
    const auth = await requireSession(context, authProvider);
    if ("response" in auth) return auth.response;

    const stats = await walksRepository.getStats(auth.session.user.id);
    return context.html(<StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />);
  });

  app.post("/walks", async (context) => {
    const auth = await requireSession(context, authProvider);
    if ("response" in auth) return auth.response;

    const body = await context.req.parseBody();
    const validation = validateWalkInput(body);

    if (!validation.ok) {
      return context.text(validation.message, 400);
    }

    await walksRepository.addWalk(auth.session.user.id, validation.value);
    const walks = await walksRepository.getAllWalks(auth.session.user.id);

    return context.html(<WalksTable walks={walks} />);
  });

  app.delete("/walks", async (context) => {
    const auth = await requireSession(context, authProvider);
    if ("response" in auth) return auth.response;

    await walksRepository.clearWalks(auth.session.user.id);
    return context.html(<WalksTable walks={[]} />);
  });

  app.delete("/walks/:id", async (context) => {
    const auth = await requireSession(context, authProvider);
    if ("response" in auth) return auth.response;

    const id = Number(context.req.param("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return context.text("Walk id must be a positive integer.", 400);
    }

    await walksRepository.deleteWalk(auth.session.user.id, id);
    const walks = await walksRepository.getAllWalks(auth.session.user.id);

    return context.html(<WalksTable walks={walks} />);
  });

  app.get("/admin", async (context) => {
    const auth = await requireAdmin(context, authProvider);
    if ("response" in auth) return auth.response;

    return renderAdminPage(context);
  });

  app.post("/admin/invites", async (context) => {
    const auth = await requireAdmin(context, authProvider);
    if ("response" in auth) return auth.response;

    const body = await context.req.parseBody();
    const role = normalizeRole(getString(body, "role"));

    try {
      await invitationService.createInvitation({
        email: getString(body, "email"),
        role,
        invitedByUserId: auth.session.user.id,
      });
    } catch (error) {
      return renderAdminPage(context, errorMessage(error));
    }

    return context.redirect("/admin", 303);
  });

  app.post("/admin/invites/:id/revoke", async (context) => {
    const auth = await requireAdmin(context, authProvider);
    if ("response" in auth) return auth.response;

    await invitationService.revokeInvitation(context.req.param("id"));
    return context.redirect("/admin", 303);
  });

  app.post("/admin/users/:id/role", async (context) => {
    const auth = await requireAdmin(context, authProvider);
    if ("response" in auth) return auth.response;

    const body = await context.req.parseBody();
    await authProvider.setUserRole(context.req.param("id"), normalizeRole(getString(body, "role")));
    return context.redirect("/admin", 303);
  });

  app.post("/admin/users/:id/ban", async (context) => {
    const auth = await requireAdmin(context, authProvider);
    if ("response" in auth) return auth.response;

    await authProvider.setUserBanned(context.req.param("id"), true);
    return context.redirect("/admin", 303);
  });

  app.post("/admin/users/:id/unban", async (context) => {
    const auth = await requireAdmin(context, authProvider);
    if ("response" in auth) return auth.response;

    await authProvider.setUserBanned(context.req.param("id"), false);
    return context.redirect("/admin", 303);
  });

  async function renderAdminPage(context: Context, error?: string) {
    const users = await authProvider.listUsers();
    const selectedUserId = context.req.query("userId") ?? users[0]?.id;
    const selectedUser = users.find((user) => user.id === selectedUserId);
    const selectedWalks = selectedUser ? await walksRepository.getAllWalks(selectedUser.id) : [];
    const selectedStats = selectedUser
      ? await walksRepository.getStats(selectedUser.id)
      : { avgSpeed: 0, medianPace: 0, count: 0 };
    const invitations = await invitationService.listInvitations();

    return context.html(
      <AdminPage
        users={users}
        invitations={invitations}
        selectedUser={selectedUser}
        selectedWalks={selectedWalks}
        selectedStats={selectedStats}
        error={error}
      />,
    );
  }

  return app;
};

async function requireSession(context: Context, authProvider: AuthProvider) {
  const session = await authProvider.getSession(context.req.raw);

  if (!session) {
    return {
      response: context.redirect("/login", 303),
    };
  }

  return { session };
}

async function requireAdmin(context: Context, authProvider: AuthProvider) {
  const auth = await requireSession(context, authProvider);
  if ("response" in auth) return auth;

  if (auth.session.user.role !== "admin") {
    return {
      response: context.text("Admin access required.", 403),
    };
  }

  return auth;
}

function redirectWithAuthCookies(context: Context, location: string, authResponse: Response) {
  const response = context.redirect(location, 303);
  const cookie = authResponse.headers.get("set-cookie");
  if (cookie) response.headers.append("set-cookie", cookie);
  return response;
}

function getString(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

function normalizeRole(role: string): UserRole {
  return role === "admin" ? "admin" : "user";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
