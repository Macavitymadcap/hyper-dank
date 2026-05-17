import type { AuthUser } from "../../../auth";
import type { Stats, WalkWithStats } from "../../../db";
import type { Invitation } from "../../../services/invitations";
import { AdminInvitationsList } from "../AdminInvitationsList";
import { AdminInviteForm } from "../AdminInviteForm";
import { AdminScoresPanel } from "../AdminScoresPanel";
import { AdminUsersList } from "../AdminUsersList";

interface AdminDashboardProps {
  error?: string;
  invitations: Invitation[];
  selectedStats: Stats;
  selectedUser?: AuthUser;
  selectedWalks: WalkWithStats[];
  users: AuthUser[];
}

export const AdminDashboard = ({
  error,
  invitations,
  selectedStats,
  selectedUser,
  selectedWalks,
  users,
}: AdminDashboardProps) => {
  return (
    <div id="admin-panel" class="admin-sections">
      {error ? <p class="form-error">{error}</p> : null}

      <AdminSection headingId="invite-heading" title="Invite user">
        <AdminInviteForm />
      </AdminSection>

      <AdminSection headingId="users-heading" title="Accounts">
        <AdminUsersList selectedUserId={selectedUser?.id} users={users} />
      </AdminSection>

      <AdminSection headingId="invites-heading" title="Invitations">
        <AdminInvitationsList invitations={invitations} />
      </AdminSection>

      <AdminSection headingId="scores-heading" title="Scores">
        <AdminScoresPanel
          selectedStats={selectedStats}
          selectedUser={selectedUser}
          selectedWalks={selectedWalks}
        />
      </AdminSection>
    </div>
  );
};

interface AdminSectionProps {
  children: unknown;
  headingId: string;
  title: string;
}

const AdminSection = ({ children, headingId, title }: AdminSectionProps) => {
  return (
    <section class="admin-section" aria-labelledby={headingId}>
      <h2 id={headingId} class="section-title">
        {title}
      </h2>
      {children}
    </section>
  );
};
