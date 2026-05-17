import { Card, Switch } from "@macavitymadcap/hyper-dank-components";
import type { AuthUser } from "../../../auth";
import type { Stats, WalkWithStats } from "../../../db";
import { LogoutForm } from "../../molecules/LogoutForm";
import { Stats as StatsSection } from "../../organisms/Stats";
import { WalkForm } from "../../organisms/WalkForm";
import { WalksTable } from "../../organisms/WalksTable";
import { Layout } from "../../templates/Layout";

interface HomeProps {
  walks: WalkWithStats[];
  stats: Stats;
  user: AuthUser;
}

export const Home = ({ walks, stats, user }: HomeProps) => {
  return (
    <Layout>
      <Card as="main" fill className="app-card">
        <header class="app-header">
          <h1 class="title">Walking Pace Tracker</h1>
          <div class="account-actions">
            <span class="account-email">{user.email}</span>
            {user.role === "admin" ? (
              <a class="admin-link" href="/admin">
                Admin
              </a>
            ) : null}
            <a class="admin-link" href="/storybook/?path=/story/guides-about--about">
              About
            </a>
            <LogoutForm />
            <Switch id="theme-toggle" label="Color mode" dataThemeToggle />
          </div>
        </header>

        <div class="content-sections">
          <section class="page-section" aria-labelledby="summary-heading">
            <h2 id="summary-heading" class="section-title">
              Summary
            </h2>
            <Card className="section-card summary-card" radius="var(--radius-2)" shadow="none">
              <div id="stats" hx-get="/stats" hx-trigger="refresh from:body">
                <StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />
              </div>
            </Card>
          </section>

          <section class="page-section" aria-labelledby="entry-heading">
            <h2 id="entry-heading" class="section-title">
              Add walk
            </h2>
            <Card className="section-card form-section" radius="var(--radius-2)" shadow="none">
              <WalkForm />
            </Card>
          </section>

          <section class="page-section" aria-labelledby="history-heading">
            <div id="walks-list">
              <WalksTable walks={walks} />
            </div>
          </section>
        </div>
      </Card>
    </Layout>
  );
};
