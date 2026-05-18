import { Button, FormField, HxForm } from "@macavitymadcap/hyper-dank-ui";

interface LoginFormProps {
  error?: string;
}

export const LoginForm = ({ error }: LoginFormProps) => {
  return (
    <HxForm
      action="/login"
      className="auth-form"
      method="post"
      hx-post="/login"
      hx-swap="outerHTML"
      hx-target="this"
    >
      <h2 class="auth-title">Sign in</h2>
      {error ? <p class="form-error">{error}</p> : null}
      <FormField htmlFor="login-email" label="Email">
        <input id="login-email" name="email" type="email" autocomplete="email" required />
      </FormField>
      <FormField htmlFor="login-password" label="Password">
        <input
          id="login-password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </FormField>
      <Button type="submit">Sign in</Button>
    </HxForm>
  );
};
