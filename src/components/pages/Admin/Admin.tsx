import type { AuthUser } from "../../../auth";
import type { Stats, WalkWithStats } from "../../../db";
import type { Invitation } from "../../../invitations";
import { Button } from "../../atoms/Button";
import { Card } from "../../atoms/Card";
import { Chip } from "../../atoms/Chip";
import { Stats as StatsSection } from "../../organisms/Stats";
import { WalksTable } from "../../organisms/WalksTable";
import { Layout } from "../../templates/Layout";

interface AdminPageProps {
  users: AuthUser[];
  invitations: Invitation[];
  selectedUser?: AuthUser;
  selectedWalks: WalkWithStats[];
  selectedStats: Stats;
  error?: string;
}

export const AdminPage = ({
  users,
  invitations,
  selectedUser,
  selectedWalks,
  selectedStats,
  error,
}: AdminPageProps) => {
  return (
    <Layout>
      <Card as="main" fill className="app-card admin-page">
        <header class="app-header">
          <h1 class="title">Admin</h1>
          <nav class="account-actions" aria-label="Admin navigation">
            <a class="admin-link" href="/">
              Tracker
            </a>
            <form method="post" action="/logout">
              <Button type="submit" size="compact" variant="outline">
                Sign out
              </Button>
            </form>
          </nav>
        </header>

        <div class="admin-sections">
          {error ? <p class="form-error">{error}</p> : null}

          <section class="admin-section" aria-labelledby="invite-heading">
            <h2 id="invite-heading" class="section-title">
              Invite user
            </h2>
            <form class="admin-form" method="post" action="/admin/invites">
              <label class="auth-field">
                <span>Email</span>
                <input name="email" type="email" autocomplete="email" required />
              </label>
              <label class="auth-field">
                <span>Role</span>
                <select name="role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <Button type="submit">Send invite</Button>
            </form>
          </section>

          <section class="admin-section" aria-labelledby="users-heading">
            <h2 id="users-heading" class="section-title">
              Accounts
            </h2>
            <div class="admin-list">
              {users.map((user) => (
                <article class="admin-list-row">
                  <div>
                    <a href={`/admin?userId=${user.id}`}>{user.email}</a>
                    <div class="muted-text">{user.name}</div>
                  </div>
                  <Chip>{user.role}</Chip>
                  {user.banned ? <Chip>Banned</Chip> : null}
                  <form method="post" action={`/admin/users/${user.id}/role`}>
                    <input
                      type="hidden"
                      name="role"
                      value={user.role === "admin" ? "user" : "admin"}
                    />
                    <button class="text-button" type="submit">
                      {user.role === "admin" ? "Make user" : "Make admin"}
                    </button>
                  </form>
                  <form
                    method="post"
                    action={`/admin/users/${user.id}/${user.banned ? "unban" : "ban"}`}
                  >
                    <button class="text-button" type="submit">
                      {user.banned ? "Unban" : "Ban"}
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </section>

          <section class="admin-section" aria-labelledby="invites-heading">
            <h2 id="invites-heading" class="section-title">
              Invitations
            </h2>
            <div class="admin-list">
              {invitations.length === 0 ? <p class="muted-text">No invitations yet.</p> : null}
              {invitations.map((invitation) => (
                <article class="admin-list-row">
                  <div>
                    <span>{invitation.email}</span>
                    <div class="muted-text">Expires {formatDate(invitation.expiresAt)}</div>
                  </div>
                  <Chip>{invitation.role}</Chip>
                  <Chip>{invitation.status}</Chip>
                  {invitation.status === "pending" ? (
                    <form method="post" action={`/admin/invites/${invitation.id}/revoke`}>
                      <button class="text-button" type="submit">
                        Revoke
                      </button>
                    </form>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section class="admin-section" aria-labelledby="scores-heading">
            <h2 id="scores-heading" class="section-title">
              Scores
            </h2>
            {selectedUser ? (
              <>
                <div class="score-summary">
                  <strong>{selectedUser.email}</strong>
                  <StatsSection
                    avgSpeed={selectedStats.avgSpeed}
                    medianPace={selectedStats.medianPace}
                  />
                </div>
                <WalksTable walks={selectedWalks} canMutate={false} />
              </>
            ) : (
              <p class="muted-text">No users available.</p>
            )}
          </section>
        </div>
      </Card>
    </Layout>
  );
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
