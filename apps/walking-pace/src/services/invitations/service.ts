import type { AuthProvider, EmailSender, UserRole } from "../../auth";
import type { Invitation, InviteRepository } from "./model";

const DEFAULT_INVITE_EXPIRY_DAYS = 7;
const DEFAULT_USER_LIMIT = 10;

export interface InvitationServiceOptions {
  authProvider: AuthProvider;
  demoMode?: boolean;
  emailSender: EmailSender;
  inviteRepository: InviteRepository;
  baseUrl?: string;
  userLimit?: number;
}

export interface CreateInvitationInput {
  email: string;
  role: UserRole;
  invitedByUserId: string;
}

export interface CreateInvitationResult {
  delivery: {
    message: string;
    status: "sent" | "simulated";
  };
  invitation: Invitation;
  inviteUrl: string;
  token: string;
}

export interface AcceptInvitationInput {
  token: string;
  name: string;
  password: string;
}

export class InvitationService {
  private readonly authProvider: AuthProvider;
  private readonly demoMode: boolean;
  private readonly emailSender: EmailSender;
  private readonly inviteRepository: InviteRepository;
  private readonly baseUrl: string;
  private readonly userLimit: number;

  constructor({
    authProvider,
    demoMode = false,
    emailSender,
    inviteRepository,
    baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    userLimit = Number(process.env.USER_LIMIT ?? DEFAULT_USER_LIMIT),
  }: InvitationServiceOptions) {
    this.authProvider = authProvider;
    this.demoMode = demoMode;
    this.emailSender = emailSender;
    this.inviteRepository = inviteRepository;
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.userLimit = Number.isFinite(userLimit) && userLimit > 0 ? userLimit : DEFAULT_USER_LIMIT;
  }

  async createInvitation(input: CreateInvitationInput): Promise<CreateInvitationResult> {
    const email = normalizeEmail(input.email);
    if (!email) throw new Error("A valid email address is required.");

    await this.assertCapacityForInvite();

    const token = crypto.randomUUID();
    const tokenHash = await hashInvitationToken(token);
    const expiresAt = new Date(Date.now() + DEFAULT_INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const invitation = await this.inviteRepository.createInvitation({
      id: crypto.randomUUID(),
      email,
      role: input.role,
      tokenHash,
      invitedByUserId: input.invitedByUserId,
      expiresAt,
    });
    const inviteUrl = `${this.baseUrl}/invite/${token}`;

    const delivery = this.demoMode
      ? {
          message: `Demo mode is on, so no email was sent. Share this review invite link manually: ${inviteUrl}`,
          status: "simulated" as const,
        }
      : {
          message: "Invitation email sent.",
          status: "sent" as const,
        };

    if (!this.demoMode) {
      await this.emailSender.sendInvitation({
        to: email,
        inviteUrl,
      });
    }

    return {
      delivery,
      invitation,
      inviteUrl,
      token,
    };
  }

  async acceptInvitation(input: AcceptInvitationInput) {
    const tokenHash = await hashInvitationToken(input.token);
    const invitation = await this.inviteRepository.findPendingByTokenHash(tokenHash);

    if (!invitation) throw new Error("This invitation is invalid or has already been used.");
    if (new Date(invitation.expiresAt).getTime() < Date.now()) {
      throw new Error("This invitation has expired.");
    }

    await this.assertCapacityForUser();

    const user = await this.authProvider.createUser({
      email: invitation.email,
      name: input.name,
      password: input.password,
      role: invitation.role,
    });
    await this.inviteRepository.acceptInvitation(invitation.id, user.id);

    return user;
  }

  listInvitations(): Promise<Invitation[]> {
    return this.inviteRepository.listInvitations();
  }

  revokeInvitation(invitationId: string): Promise<boolean> {
    return this.inviteRepository.revokeInvitation(invitationId);
  }

  private async assertCapacityForInvite(): Promise<void> {
    const users = await this.authProvider.countUsers();
    const pending = await this.inviteRepository.countPendingInvitations();

    if (users + pending >= this.userLimit) {
      throw new Error(`User limit reached. This app is capped at ${this.userLimit} users.`);
    }
  }

  private async assertCapacityForUser(): Promise<void> {
    const users = await this.authProvider.countUsers();

    if (users >= this.userLimit) {
      throw new Error(`User limit reached. This app is capped at ${this.userLimit} users.`);
    }
  }
}

export async function hashInvitationToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
}
