import { Card } from "@macavitymadcap/hyper-dank-ui";
import { InviteForm } from "../../organisms/InviteForm";
import { Layout } from "../../templates/Layout";

interface InvitePageProps {
  token: string;
  error?: string;
}

export const InvitePage = ({ token, error }: InvitePageProps) => {
  return (
    <Layout>
      <Card as="main" className="app-card auth-card">
        <header class="auth-header">
          <h1 class="title">Walking Pace Tracker</h1>
        </header>

        <InviteForm token={token} error={error} />
      </Card>
    </Layout>
  );
};
