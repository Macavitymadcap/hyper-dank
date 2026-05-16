import { Card } from "../../atoms/Card";
import { LoginForm } from "../../organisms/LoginForm";
import { Layout } from "../../templates/Layout";

interface LoginPageProps {
  error?: string;
}

export const LoginPage = ({ error }: LoginPageProps) => {
  return (
    <Layout>
      <Card as="main" className="app-card auth-card">
        <header class="auth-header">
          <h1 class="title">Walking Pace Tracker</h1>
        </header>

        <LoginForm error={error} />
      </Card>
    </Layout>
  );
};
