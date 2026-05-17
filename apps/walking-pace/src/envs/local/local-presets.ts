import type { Database } from "bun:sqlite";
import type { AuthProvider, AuthUser, CreateAuthUserInput } from "../../auth";
import type { WalkInput, WalkRepository } from "../../db";

export const LOCAL_DEV_PASSWORD = "password123";

export interface LocalDevPresetUser extends CreateAuthUserInput {
  profile: string;
  banned?: boolean;
  walks: WalkInput[];
}

export interface LocalDevSeedResult {
  user: AuthUser;
  profile: string;
  password: string;
  walkCount: number;
}

export interface LocalDevSeedOptions {
  authProvider: AuthProvider;
  walksRepository: WalkRepository;
  resetWalks?: boolean;
}

export const LOCAL_DEV_PRESET_USERS = [
  {
    email: "admin@example.com",
    name: "Admin",
    password: LOCAL_DEV_PASSWORD,
    role: "admin",
    profile: "admin account with access to account management and read-only user scores",
    walks: [
      { miles: 1.2, minutes: 18, seconds: 45 },
      { miles: 2.4, minutes: 38, seconds: 10 },
    ],
  },
  {
    email: "walker@example.com",
    name: "Everyday Walker",
    password: LOCAL_DEV_PASSWORD,
    role: "user",
    profile: "regular user with a few typical walks",
    walks: [
      { miles: 1, minutes: 19, seconds: 30 },
      { miles: 1.8, minutes: 33, seconds: 20 },
      { miles: 2.2, minutes: 43, seconds: 0 },
    ],
  },
  {
    email: "history@example.com",
    name: "Long History",
    password: LOCAL_DEV_PASSWORD,
    role: "user",
    profile: "regular user with enough walks to exercise table scrolling",
    walks: [
      { miles: 0.8, minutes: 14, seconds: 30 },
      { miles: 1, minutes: 18, seconds: 40 },
      { miles: 1.1, minutes: 20, seconds: 5 },
      { miles: 1.3, minutes: 24, seconds: 15 },
      { miles: 1.5, minutes: 28, seconds: 30 },
      { miles: 1.7, minutes: 32, seconds: 10 },
      { miles: 1.9, minutes: 36, seconds: 25 },
      { miles: 2.1, minutes: 40, seconds: 35 },
      { miles: 2.3, minutes: 44, seconds: 50 },
      { miles: 2.5, minutes: 49, seconds: 5 },
      { miles: 2.7, minutes: 53, seconds: 20 },
      { miles: 3, minutes: 59, seconds: 0 },
    ],
  },
  {
    email: "empty@example.com",
    name: "Empty Account",
    password: LOCAL_DEV_PASSWORD,
    role: "user",
    profile: "regular user with no walks yet",
    walks: [],
  },
  {
    email: "banned@example.com",
    name: "Banned User",
    password: LOCAL_DEV_PASSWORD,
    role: "user",
    banned: true,
    profile: "banned account for admin state review",
    walks: [{ miles: 1.4, minutes: 31, seconds: 15 }],
  },
] satisfies LocalDevPresetUser[];

export async function seedLocalDevPresets({
  authProvider,
  walksRepository,
  resetWalks = true,
}: LocalDevSeedOptions): Promise<LocalDevSeedResult[]> {
  const existingUsers = new Map(
    (await authProvider.listUsers()).map((user) => [user.email.toLowerCase(), user]),
  );
  const results: LocalDevSeedResult[] = [];

  for (const preset of LOCAL_DEV_PRESET_USERS) {
    const email = preset.email.toLowerCase();
    let user = existingUsers.get(email);

    if (!user) {
      user = await authProvider.createUser({
        email,
        name: preset.name,
        password: preset.password,
        role: preset.role,
      });
    }

    await authProvider.setUserRole(user.id, preset.role);
    await authProvider.setUserBanned(user.id, Boolean(preset.banned));

    if (resetWalks) {
      await walksRepository.clearWalks(user.id);
    }

    for (const walk of preset.walks) {
      await walksRepository.addWalk(user.id, walk);
    }

    results.push({
      user: {
        ...user,
        role: preset.role,
        banned: Boolean(preset.banned),
      },
      profile: preset.profile,
      password: preset.password,
      walkCount: preset.walks.length,
    });
  }

  return results;
}

export function resetSqliteLocalDevPresetUsers(
  db: Database,
  presets: LocalDevPresetUser[] = LOCAL_DEV_PRESET_USERS,
): void {
  const emails = presets.map((preset) => preset.email.toLowerCase());
  if (emails.length === 0) return;

  const emailPlaceholders = placeholders(emails);
  const existingUsers = db
    .query(`SELECT id FROM local_auth_users WHERE email IN (${emailPlaceholders})`)
    .all(...emails) as { id: string }[];
  const userIds = existingUsers.map((user) => user.id);

  db.transaction(() => {
    if (userIds.length > 0) {
      const userPlaceholders = placeholders(userIds);

      db.query(`DELETE FROM walks WHERE user_id IN (${userPlaceholders})`).run(...userIds);
      db.query(`DELETE FROM local_auth_sessions WHERE user_id IN (${userPlaceholders})`).run(
        ...userIds,
      );
      db.query(
        `DELETE FROM invitations
        WHERE invited_by_user_id IN (${userPlaceholders})
          OR accepted_by_user_id IN (${userPlaceholders})`,
      ).run(...userIds, ...userIds);
      db.query(`DELETE FROM local_auth_users WHERE id IN (${userPlaceholders})`).run(...userIds);
    }

    db.query(`DELETE FROM invitations WHERE email IN (${emailPlaceholders})`).run(...emails);
  })();
}

function placeholders(values: unknown[]): string {
  return values.map(() => "?").join(", ");
}
