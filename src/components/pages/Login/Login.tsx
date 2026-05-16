import { Button } from "../../atoms/Button";
import { Card } from "../../atoms/Card";
import { Layout } from "../../templates/Layout";

interface LoginPageProps {
  error?: string;
}

export const LoginPage = ({ error }: LoginPageProps) => {
  return (
    <Layout>
      <Card as="main" fill className="app-card auth-card">
        <header class="auth-header">
          <h1 class="title">Walking Pace Tracker</h1>
        </header>

        <form class="auth-form" method="post" action="/login">
          <h2 class="auth-title">Sign in</h2>
          {error ? <p class="form-error">{error}</p> : null}
          <label class="auth-field">
            <span>Email</span>
            <input name="email" type="email" autocomplete="email" required />
          </label>
          <label class="auth-field">
            <span>Password</span>
            <input name="password" type="password" autocomplete="current-password" required />
          </label>
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </Layout>
  );
};
