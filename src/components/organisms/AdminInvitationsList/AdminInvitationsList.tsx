import type { Invitation } from "../../../services/invitations";
import { Button } from "../../atoms/Button";
import { Chip } from "../../atoms/Chip";
import { HxForm } from "../../molecules/HxForm";

interface AdminInvitationsListProps {
  invitations: Invitation[];
}

export const AdminInvitationsList = ({ invitations }: AdminInvitationsListProps) => {
  return (
    <div class="admin-list">
      {invitations.length === 0 ? (
        <p class="muted-text admin-list-empty">No invitations yet.</p>
      ) : null}
      {invitations.map((invitation) => (
        <article class="admin-list-row">
          <div>
            <span>{invitation.email}</span>
            <div class="muted-text">Expires {formatDate(invitation.expiresAt)}</div>
          </div>
          <Chip>{invitation.role}</Chip>
          <Chip>{invitation.status}</Chip>
          {invitation.status === "pending" ? (
            <HxForm
              action={`/admin/invites/${invitation.id}/revoke`}
              method="post"
              hx-post={`/admin/invites/${invitation.id}/revoke`}
              hx-swap="none"
            >
              <Button type="submit" variant="text">
                Revoke
              </Button>
            </HxForm>
          ) : null}
        </article>
      ))}
    </div>
  );
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
