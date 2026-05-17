import { Button } from "../../atoms/Button";
import { FormField } from "../../molecules/FormField";
import { HxForm } from "../../molecules/HxForm";

export interface AdminInviteFormProps {
  defaultEmail?: string;
  defaultRole?: "admin" | "user";
  submitLabel?: string;
}

export const AdminInviteForm = ({
  defaultEmail,
  defaultRole = "user",
  submitLabel = "Send invite",
}: AdminInviteFormProps = {}) => {
  return (
    <HxForm
      action="/admin/invites"
      className="admin-form"
      method="post"
      hx-post="/admin/invites"
      hx-swap="outerHTML"
      hx-target="#admin-panel"
    >
      <FormField htmlFor="admin-invite-email" label="Email">
        <input
          id="admin-invite-email"
          name="email"
          type="email"
          autocomplete="email"
          required
          value={defaultEmail}
        />
      </FormField>
      <FormField htmlFor="admin-invite-role" label="Role">
        <select id="admin-invite-role" name="role">
          <option value="user" selected={defaultRole === "user"}>
            User
          </option>
          <option value="admin" selected={defaultRole === "admin"}>
            Admin
          </option>
        </select>
      </FormField>
      <Button type="submit">{submitLabel}</Button>
    </HxForm>
  );
};
