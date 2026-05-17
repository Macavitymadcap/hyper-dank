import type { AuthProvider } from "../auth";
import type { WalkRepository } from "../db";
import type { InvitationService } from "../services/invitations";

export interface AppDependencies {
  authProvider: AuthProvider;
  invitationService: InvitationService;
  walksRepository: WalkRepository;
}
