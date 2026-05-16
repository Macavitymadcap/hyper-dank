import { Button } from "../../atoms/Button";
import { FormField } from "../../molecules/FormField";
import { HxForm } from "../../molecules/HxForm";

interface InviteFormProps {
  error?: string;
  token: string;
}

export const InviteForm = ({ error, token }: InviteFormProps) => {
  const action = `/invite/${token}`;

  return (
    <HxForm
      action={action}
      className="auth-form"
      method="post"
      hx-post={action}
      hx-swap="outerHTML"
      hx-target="this"
    >
      <h2 class="auth-title">Accept invite</h2>
      {error ? <p class="form-error">{error}</p> : null}
      <FormField htmlFor="invite-name" label="Name">
        <input id="invite-name" name="name" type="text" autocomplete="name" required />
      </FormField>
      <FormField htmlFor="invite-password" label="Password">
        <input
          id="invite-password"
          name="password"
          type="password"
          autocomplete="new-password"
          minlength={8}
          required
        />
      </FormField>
      <Button type="submit">Create account</Button>
    </HxForm>
  );
};
