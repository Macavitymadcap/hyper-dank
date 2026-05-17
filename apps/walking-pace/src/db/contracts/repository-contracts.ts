import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { describeDatabaseLifecycleContract } from "@macavitymadcap/hyper-dank-database/testing";
import type { InviteRepository } from "../../services/invitations";
import type { DatabaseKind, DatabaseProvider, WalkRepository } from "../model";

type MaybePromise<T> = T | Promise<T>;

interface RepositoryHarness<TRepository> {
  cleanup?: () => MaybePromise<void>;
  repository: TRepository;
}

interface ProviderHarness {
  cleanup?: () => MaybePromise<void>;
  provider: DatabaseProvider;
}

export function describeWalkRepositoryContract(
  name: string,
  setup: () => MaybePromise<RepositoryHarness<WalkRepository>>,
) {
  describe(name, () => {
    let cleanup: (() => MaybePromise<void>) | undefined;
    let repository: WalkRepository;
    const userId = "contract-user@example.com";
    const otherUserId = "contract-other@example.com";

    beforeEach(async () => {
      const harness = await setup();
      repository = harness.repository;
      cleanup = harness.cleanup;
      await repository.clearWalks(userId);
      await repository.clearWalks(otherUserId);
    });

    afterEach(async () => {
      await repository?.clearWalks(userId).catch(() => {});
      await repository?.clearWalks(otherUserId).catch(() => {});
      await cleanup?.();
    });

    test("adds walks and returns calculated stats newest first", async () => {
      await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
      await repository.addWalk(userId, { miles: 2, minutes: 30, seconds: 0 });

      const walks = await repository.getAllWalks(userId);

      expect(walks).toHaveLength(2);
      expect(walks[0]?.miles).toBe(2);
      expect(walks[0]?.speed).toBeCloseTo(4);
      expect(walks[0]?.pace).toBeCloseTo(15);
    });

    test("deletes walks and reports whether a row changed", async () => {
      await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });

      const [walk] = await repository.getAllWalks(userId);
      if (!walk) throw new Error("Expected inserted walk");

      expect(await repository.deleteWalk(userId, walk.id)).toBe(true);
      expect(await repository.deleteWalk(userId, walk.id)).toBe(false);
      expect(await repository.getAllWalks(userId)).toHaveLength(0);
    });

    test("clears all walks and reports how many rows changed", async () => {
      await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
      await repository.addWalk(userId, { miles: 2, minutes: 30, seconds: 0 });

      expect(await repository.clearWalks(userId)).toBe(2);
      expect(await repository.clearWalks(userId)).toBe(0);
      expect(await repository.getAllWalks(userId)).toHaveLength(0);
    });

    test("calculates aggregate stats from persisted walks", async () => {
      await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
      await repository.addWalk(userId, { miles: 2, minutes: 30, seconds: 0 });

      const stats = await repository.getStats(userId);

      expect(stats.count).toBe(2);
      expect(stats.avgSpeed).toBeCloseTo(3.5);
      expect(stats.medianPace).toBeCloseTo(17.5);
    });

    test("returns empty stats for users without walks", async () => {
      expect(await repository.getStats("contract-empty@example.com")).toEqual({
        avgSpeed: 0,
        count: 0,
        medianPace: 0,
      });
    });

    test("enforces database constraints", async () => {
      await expect(
        repository.addWalk(userId, { miles: -1, minutes: 20, seconds: 0 }),
      ).rejects.toThrow();
      await expect(
        repository.addWalk(userId, { miles: 1, minutes: 0, seconds: 60 }),
      ).rejects.toThrow();
      await expect(
        repository.addWalk(userId, { miles: 1, minutes: 0, seconds: 0 }),
      ).rejects.toThrow();
    });

    test("scopes walks to the requested user", async () => {
      await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
      await repository.addWalk(otherUserId, { miles: 2, minutes: 30, seconds: 0 });

      expect(await repository.getAllWalks(userId)).toHaveLength(1);
      expect(await repository.getAllWalks(otherUserId)).toHaveLength(1);

      const [otherWalk] = await repository.getAllWalks(otherUserId);
      if (!otherWalk) throw new Error("Expected other user's walk");

      expect(await repository.deleteWalk(userId, otherWalk.id)).toBe(false);
      expect(await repository.clearWalks(userId)).toBe(1);
      expect(await repository.getAllWalks(otherUserId)).toHaveLength(1);
    });
  });
}

export function describeInviteRepositoryContract(
  name: string,
  setup: () => MaybePromise<RepositoryHarness<InviteRepository>>,
) {
  describe(name, () => {
    let cleanup: (() => MaybePromise<void>) | undefined;
    let repository: InviteRepository;
    let suffix: string;

    beforeEach(async () => {
      const harness = await setup();
      repository = harness.repository;
      cleanup = harness.cleanup;
      suffix = randomUUID();
    });

    afterEach(async () => {
      await cleanup?.();
    });

    test("handles pending, accepted, revoked, and missing invitations", async () => {
      const pendingBefore = await repository.countPendingInvitations();
      const firstInvitationId = `contract-invite-${suffix}-1`;
      const secondInvitationId = `contract-invite-${suffix}-2`;

      const invitation = await repository.createInvitation({
        email: "Contract.Invited@Example.com",
        expiresAt: new Date("2026-01-08T00:00:00.000Z"),
        id: firstInvitationId,
        invitedByUserId: "contract-admin@example.com",
        role: "user",
        tokenHash: `contract-token-${suffix}-1`,
      });

      expect(invitation).toMatchObject({
        email: "contract.invited@example.com",
        status: "pending",
      });
      expect(await repository.countPendingInvitations()).toBe(pendingBefore + 1);
      expect(await repository.findPendingByTokenHash(`contract-missing-${suffix}`)).toBeNull();
      expect(await repository.findPendingByTokenHash(`contract-token-${suffix}-1`)).toMatchObject({
        id: firstInvitationId,
      });

      await repository.acceptInvitation(firstInvitationId, "contract-user@example.com");
      expect(
        (await repository.listInvitations()).find(({ id }) => id === firstInvitationId),
      ).toMatchObject({
        acceptedByUserId: "contract-user@example.com",
        status: "accepted",
      });
      expect(await repository.countPendingInvitations()).toBe(pendingBefore);
      expect(await repository.revokeInvitation(firstInvitationId)).toBe(false);

      await repository.createInvitation({
        email: "Second.Contract@Example.com",
        expiresAt: new Date("2026-01-08T00:00:00.000Z"),
        id: secondInvitationId,
        invitedByUserId: "contract-admin@example.com",
        role: "admin",
        tokenHash: `contract-token-${suffix}-2`,
      });

      expect(await repository.countPendingInvitations()).toBe(pendingBefore + 1);
      expect(await repository.revokeInvitation(secondInvitationId)).toBe(true);
      const revoked = (await repository.listInvitations()).find(
        (candidate) => candidate.id === secondInvitationId,
      );

      expect(await repository.countPendingInvitations()).toBe(pendingBefore);
      expect(revoked).toMatchObject({
        revokedAt: expect.any(String),
        status: "revoked",
      });
    });
  });
}

export function describeDatabaseProviderContract(
  name: string,
  expectedKind: DatabaseKind,
  setup: () => MaybePromise<ProviderHarness>,
) {
  describeDatabaseLifecycleContract(`${name} lifecycle`, expectedKind, setup);

  describe(name, () => {
    let cleanup: (() => MaybePromise<void>) | undefined;
    let provider: DatabaseProvider;

    beforeEach(async () => {
      const harness = await setup();
      provider = harness.provider;
      cleanup = harness.cleanup;
    });

    afterEach(async () => {
      await Promise.resolve(provider?.close()).catch(() => {});
      await cleanup?.();
    });

    test("exposes kind, idempotent migrations, and repository factories", async () => {
      expect(provider.kind).toBe(expectedKind);

      await provider.migrate();
      await provider.migrate();

      const repositories = provider.createRepositories();
      expect(provider.createWalkRepository()).toBeTruthy();
      expect(provider.createInviteRepository()).toBeTruthy();
      expect(repositories.walks).toBeTruthy();
      expect(repositories.invites).toBeTruthy();
    });
  });
}
