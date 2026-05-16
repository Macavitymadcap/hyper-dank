import { Resend } from "resend";
import type { EmailSender, InvitationEmailInput } from "../auth";

export interface EmailEnvironment {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
}

export class ConsoleEmailSender implements EmailSender {
  readonly sentInvitations: InvitationEmailInput[] = [];

  async sendInvitation(input: InvitationEmailInput): Promise<void> {
    this.sentInvitations.push(input);
    console.info(`Invitation for ${input.to}: ${input.inviteUrl}`);
  }
}

export class ResendEmailSender implements EmailSender {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(apiKey: string, from: string) {
    this.resend = new Resend(apiKey);
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

export const createEmailSender = (
  environment: EmailEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },
): EmailSender => {
  if (environment.RESEND_API_KEY && environment.EMAIL_FROM) {
    return new ResendEmailSender(environment.RESEND_API_KEY, environment.EMAIL_FROM);
  }

  return new ConsoleEmailSender();
};
