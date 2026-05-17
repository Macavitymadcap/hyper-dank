import { Button, Chip, HxForm } from "@macavitymadcap/hyper-dank-components";
import type { AuthUser } from "../../../auth";

interface AdminUsersListProps {
  selectedUserId?: string;
  users: AuthUser[];
}

export const AdminUsersList = ({ selectedUserId, users }: AdminUsersListProps) => {
  return (
    <div class="admin-list">
      {users.map((user) => (
        <article
          class="admin-list-row"
          data-selected={user.id === selectedUserId ? "true" : undefined}
        >
          <div>
            <a
              href={`/admin?userId=${user.id}`}
              hx-get={`/admin?userId=${user.id}`}
              hx-push-url="true"
              hx-swap="outerHTML"
              hx-target="#admin-panel"
            >
              {user.email}
            </a>
            <div class="muted-text">{user.name}</div>
          </div>
          <Chip>{user.role}</Chip>
          {user.banned ? <Chip>Banned</Chip> : null}
          <HxForm
            action={`/admin/users/${user.id}/role`}
            method="post"
            hx-post={`/admin/users/${user.id}/role`}
            hx-swap="none"
          >
            <input type="hidden" name="role" value={user.role === "admin" ? "user" : "admin"} />
            <Button type="submit" variant="text">
              {user.role === "admin" ? "Make user" : "Make admin"}
            </Button>
          </HxForm>
          <HxForm
            action={`/admin/users/${user.id}/${user.banned ? "unban" : "ban"}`}
            method="post"
            hx-post={`/admin/users/${user.id}/${user.banned ? "unban" : "ban"}`}
            hx-swap="none"
          >
            <Button type="submit" variant="text">
              {user.banned ? "Unban" : "Ban"}
            </Button>
          </HxForm>
        </article>
      ))}
    </div>
  );
};
