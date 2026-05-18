import type { HttpResponder } from "@macavitymadcap/hyper-dank-transport";
import type { Context } from "hono";
import type { AuthProvider } from "../auth";
import { AdminDashboard, AdminPage } from "../components";
import type { WalkRepository } from "../db";
import type { InvitationService } from "../services/invitations";

export class AdminPagePresenter {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly invitationService: InvitationService,
    private readonly walksRepository: WalkRepository,
    private readonly responder: HttpResponder,
  ) {}

  async render(context: Context, error?: string): Promise<Response> {
    const users = await this.authProvider.listUsers();
    const selectedUserId = context.req.query("userId") ?? users[0]?.id;
    const selectedUser = users.find((user) => user.id === selectedUserId);
    const selectedWalks = selectedUser
      ? await this.walksRepository.getAllWalks(selectedUser.id)
      : [];
    const selectedStats = selectedUser
      ? await this.walksRepository.getStats(selectedUser.id)
      : { avgSpeed: 0, medianPace: 0, count: 0 };
    const invitations = await this.invitationService.listInvitations();

    const props = {
      error,
      invitations,
      selectedStats,
      selectedUser,
      selectedWalks,
      users,
    };

    if (this.responder.isHtmxRequest(context)) {
      return context.html(<AdminDashboard {...props} />);
    }

    return context.html(<AdminPage {...props} />);
  }
}
