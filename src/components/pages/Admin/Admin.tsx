import type { AuthUser } from "../../../auth";
import type { Stats, WalkWithStats } from "../../../db";
import type { Invitation } from "../../../services/invitations";
import { Card } from "../../atoms/Card";
import { LogoutForm } from "../../molecules/LogoutForm";
import { AdminDashboard } from "../../organisms/AdminDashboard";
import { Layout } from "../../templates/Layout";

interface AdminPageProps {
  users: AuthUser[];
  invitations: Invitation[];
  selectedUser?: AuthUser;
  selectedWalks: WalkWithStats[];
  selectedStats: Stats;
  error?: string;
}

export const AdminPage = ({
  users,
  invitations,
  selectedUser,
  selectedWalks,
  selectedStats,
  error,
}: AdminPageProps) => {
  return (
    <Layout>
      <Card as="main" fill className="app-card admin-page">
        <header class="app-header">
          <h1 class="title">Admin</h1>
          <nav class="account-actions" aria-label="Admin navigation">
            <a class="admin-link" href="/">
              Tracker
            </a>
            <LogoutForm />
          </nav>
        </header>

        <AdminDashboard
          error={error}
          users={users}
          invitations={invitations}
          selectedUser={selectedUser}
          selectedWalks={selectedWalks}
          selectedStats={selectedStats}
        />
      </Card>
    </Layout>
  );
};
