import { describe, expect, mock, test } from "bun:test";
import {
  ConsoleEmailSender,
  createEmailSender,
  type ResendEmailClient,
  ResendEmailSender,
} from "./sender";

describe("EmailSender", () => {
  test("records console invitations for local delivery", async () => {
    const logger = { info: mock(() => {}) };
    const sender = new ConsoleEmailSender(logger);

    await sender.sendInvitation({
      inviteUrl: "http://localhost/invite/token",
      to: "user@example.com",
    });

    expect(sender.sentInvitations).toEqual([
      {
        inviteUrl: "http://localhost/invite/token",
        to: "user@example.com",
      },
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      "Invitation for user@example.com: http://localhost/invite/token",
    );
  });

  test("sends invitations through Resend", async () => {
    const send = mock(() => Promise.resolve({ id: "email-1" }));
    const client: ResendEmailClient = {
      emails: { send },
    };
    const sender = new ResendEmailSender("resend-key", "noreply@example.com", client);

    await sender.sendInvitation({
      inviteUrl: "https://example.com/invite/token",
      to: "user@example.com",
    });

    expect(send).toHaveBeenCalledWith({
      from: "noreply@example.com",
      html: '<p>You have been invited to Walking Pace Tracker.</p><p><a href="https://example.com/invite/token">Accept your invite</a></p>',
      subject: "Your Walking Pace Tracker invite",
      text: "You have been invited to Walking Pace Tracker. Accept your invite: https://example.com/invite/token",
      to: "user@example.com",
    });
  });

  test("selects the configured delivery provider", () => {
    expect(createEmailSender({})).toBeInstanceOf(ConsoleEmailSender);
    expect(
      createEmailSender({
        EMAIL_FROM: "noreply@example.com",
        RESEND_API_KEY: "resend-key",
      }),
    ).toBeInstanceOf(ResendEmailSender);
  });

  test("reads process environment when no explicit environment is passed", () => {
    const previousKey = process.env.RESEND_API_KEY;
    const previousFrom = process.env.EMAIL_FROM;

    try {
      process.env.RESEND_API_KEY = "resend-key";
      process.env.EMAIL_FROM = "noreply@example.com";

      expect(createEmailSender()).toBeInstanceOf(ResendEmailSender);
    } finally {
      process.env.RESEND_API_KEY = previousKey;
      process.env.EMAIL_FROM = previousFrom;
    }
  });
});
