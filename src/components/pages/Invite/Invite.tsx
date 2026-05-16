import { Button } from "../../atoms/Button";
import { Card } from "../../atoms/Card";
import { Layout } from "../../templates/Layout";

interface InvitePageProps {
  token: string;
  error?: string;
}

export const InvitePage = ({ token, error }: InvitePageProps) => {
  return (
    <Layout>
      <Card as="main" fill className="app-card auth-card">
        <header class="auth-header">
          <h1 class="title">Walking Pace Tracker</h1>
        </header>

        <form class="auth-form" method="post" action={`/invite/${token}`}>
          <h2 class="auth-title">Accept invite</h2>
          {error ? <p class="form-error">{error}</p> : null}
          <label class="auth-field">
            <span>Name</span>
            <input name="name" type="text" autocomplete="name" required />
          </label>
          <label class="auth-field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autocomplete="new-password"
              minlength={8}
              required
            />
          </label>
          <Button type="submit">Create account</Button>
        </form>
      </Card>
    </Layout>
  );
};
