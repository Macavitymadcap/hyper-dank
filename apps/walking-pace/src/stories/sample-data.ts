import type { AuthUser } from "../auth";
import type { Stats, WalkWithStats } from "../db";
import type { Invitation } from "../services/invitations";

export const storyUser: AuthUser = {
  email: "runner@example.com",
  id: "runner@example.com",
  name: "Runner Example",
  role: "user",
};

export const storyAdmin: AuthUser = {
  email: "admin@example.com",
  id: "admin@example.com",
  name: "Admin Example",
  role: "admin",
};

export const storyWalks: WalkWithStats[] = [
  {
    created_at: "2026-05-17T08:15:00.000Z",
    id: 1,
    miles: 1.2,
    minutes: 18,
    pace: 15.8,
    seconds: 55,
    speed: 3.8,
    user_id: storyUser.id,
  },
  {
    created_at: "2026-05-16T09:30:00.000Z",
    id: 2,
    miles: 2,
    minutes: 30,
    pace: 15,
    seconds: 0,
    speed: 4,
    user_id: storyUser.id,
  },
  {
    created_at: "2026-05-15T17:20:00.000Z",
    id: 3,
    miles: 1.6,
    minutes: 24,
    pace: 15,
    seconds: 10,
    speed: 4,
    user_id: storyUser.id,
  },
];

export const storyStats: Stats = {
  avgSpeed: 3.9,
  count: storyWalks.length,
  medianPace: 15.0,
};

export const emptyStats: Stats = {
  avgSpeed: 0,
  count: 0,
};

export const storyInvitations: Invitation[] = [
  {
    createdAt: "2026-05-17T08:00:00.000Z",
    email: "new.walker@example.com",
    expiresAt: "2026-05-24T08:00:00.000Z",
    id: "invite-1",
    invitedByUserId: storyAdmin.id,
    role: "user",
    status: "pending",
  },
];
