import type { HttpResponder } from "@macavitymadcap/hyper-dank-transport";
import { FormValues } from "@macavitymadcap/hyper-dank-transport";
import type { Context, Hono } from "hono";
import { Home, StatsSection, WalksTable } from "../../components";
import type { WalkRepository } from "../../db";
import { validateWalkInput } from "../../walks/validation";
import type { SessionGuard } from "../session-guard";

export class WalkRoutes {
  constructor(
    private readonly app: Hono,
    private readonly guard: SessionGuard,
    private readonly responder: HttpResponder,
    private readonly walksRepository: WalkRepository,
  ) {}

  register(): void {
    this.app.get("/", (context) => this.home(context));
    this.app.get("/stats", (context) => this.stats(context));
    this.app.post("/walks", (context) => this.addWalk(context));
    this.app.delete("/walks", (context) => this.clearWalksFragment(context));
    this.app.post("/walks/delete", (context) => this.clearWalksFallback(context));
    this.app.delete("/walks/:id", (context) => this.deleteWalkFragment(context));
    this.app.post("/walks/:id/delete", (context) => this.deleteWalkFallback(context));
  }

  private async home(context: Context) {
    const auth = await this.guard.requireSession(context);
    if ("response" in auth) return auth.response;

    const walks = await this.walksRepository.getAllWalks(auth.session.user.id);
    const stats = await this.walksRepository.getStats(auth.session.user.id);

    return context.html(<Home walks={walks} stats={stats} user={auth.session.user} />);
  }

  private async stats(context: Context) {
    const auth = await this.guard.requireSession(context);
    if ("response" in auth) return auth.response;

    const stats = await this.walksRepository.getStats(auth.session.user.id);
    return context.html(<StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />);
  }

  private async addWalk(context: Context) {
    const auth = await this.guard.requireSession(context);
    if ("response" in auth) return auth.response;

    const form = await FormValues.from(context);
    const validation = validateWalkInput(form.raw);
    if (!validation.ok) return context.text(validation.message, 400);

    await this.walksRepository.addWalk(auth.session.user.id, validation.value);
    if (!this.responder.isHtmxRequest(context)) return context.redirect("/", 303);

    const walks = await this.walksRepository.getAllWalks(auth.session.user.id);
    return this.walksFragment(context, <WalksTable walks={walks} />);
  }

  private async clearWalksFragment(context: Context) {
    const auth = await this.guard.requireSession(context);
    if ("response" in auth) return auth.response;

    await this.walksRepository.clearWalks(auth.session.user.id);
    return this.walksFragment(context, <WalksTable walks={[]} />);
  }

  private async clearWalksFallback(context: Context) {
    const auth = await this.guard.requireSession(context);
    if ("response" in auth) return auth.response;

    await this.walksRepository.clearWalks(auth.session.user.id);
    return context.redirect("/", 303);
  }

  private async deleteWalkFragment(context: Context) {
    const auth = await this.guard.requireSession(context);
    if ("response" in auth) return auth.response;

    const id = this.walkId(context);
    if (!id) return context.text("Walk id must be a positive integer.", 400);

    await this.walksRepository.deleteWalk(auth.session.user.id, id);
    const walks = await this.walksRepository.getAllWalks(auth.session.user.id);
    return this.walksFragment(context, <WalksTable walks={walks} />);
  }

  private async deleteWalkFallback(context: Context) {
    const auth = await this.guard.requireSession(context);
    if ("response" in auth) return auth.response;

    const id = this.walkId(context);
    if (!id) return context.text("Walk id must be a positive integer.", 400);

    await this.walksRepository.deleteWalk(auth.session.user.id, id);
    return context.redirect("/", 303);
  }

  private walkId(context: Context): number | null {
    const id = Number(context.req.param("id"));
    return Number.isInteger(id) && id > 0 ? id : null;
  }

  private walksFragment(context: Context, fragment: string | Promise<string>) {
    return context.html(fragment, 200, {
      "HX-Trigger": "refresh",
    });
  }
}
