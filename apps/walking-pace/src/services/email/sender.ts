import { Resend } from "resend";
import type { EmailSender, InvitationEmailInput } from "../../auth";

export interface EmailEnvironment {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
}

export interface ResendEmailClient {
  emails: {
    send(input: {
      from: string;
      html: string;
      subject: string;
      text: string;
      to: string;
    }): Promise<unknown>;
  };
}

export class ConsoleEmailSender implements EmailSender {
  readonly sentInvitations: InvitationEmailInput[] = [];

  constructor(private readonly logger: Pick<Console, "info"> = console) {}

  async sendInvitation(input: InvitationEmailInput): Promise<void> {
    this.sentInvitations.push(input);
    this.logger.info(`Invitation for ${input.to}: ${input.inviteUrl}`);
  }
}

export class ResendEmailSender implements EmailSender {
  private readonly resend: ResendEmailClient;
  private readonly from: string;

  constructor(apiKey: string, from: string, resend: ResendEmailClient = new Resend(apiKey)) {
    this.resend = resend;
    this.from = from;
  }

  async sendInvitation(input: InvitationEmailInput): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to: input.to,
      subject: "Your Walking Pace Tracker invite",
      html: `<p>You have been invited to Walking Pace Tracker.</p><p><a href="${input.inviteUrl}">Accept your invite</a></p>`,
      text: `You have been invited to Walking Pace Tracker. Accept your invite: ${input.inviteUrl}`,
    });
  }
}

export const createEmailSender = (environment?: EmailEnvironment): EmailSender => {
  const env = environment ?? {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
  };

  if (env.RESEND_API_KEY && env.EMAIL_FROM) {
    return new ResendEmailSender(env.RESEND_API_KEY, env.EMAIL_FROM);
  }

  return new ConsoleEmailSender();
};
