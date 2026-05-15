import type { WalkWithStats, Stats } from "../../db"
import { Layout } from "../templates/Layout";
import { Stats as StatsSection} from "../organisms/Stats";
import { WalkForm } from "../organisms/WalkForm";
import { WalksList } from "../organisms/WalksList";
import { styleRegistry } from "../templates/style-registry";

interface HomeProps { walks: WalkWithStats[]; stats: Stats }

const homeStyles = /* css */`
.container {
  background: var(--gray-0);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-3);
  overflow: hidden;
}

header {
  background: var(--gray-0);
  padding: var(--size-4);
  border-bottom: var(--border-size-2) solid var(--blue-6);
  position: sticky;
  top: 0;
  z-index: var(--layer-1);
}

.title {
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-7);
  margin-bottom: var(--size-3);
  color: var(--gray-9);
}

.form-section {
  background: var(--blue-6);
  padding: var(--size-4);
  color: var(--gray-0);
}
`;

export const Home = ({walks, stats}: HomeProps) => {
  styleRegistry.register(homeStyles);

  return(
    <Layout>
      <main class="container">
        <header class="header">
          <h1 class="title">Walking Pace Tracker</h1>
          <div id="stats" hx-get="/stats" hx-trigger="refresh from:body">
            <StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />
          </div>
        </header>
        
        <div class="form-section">
          <WalkForm />
        </div>
        
        <div id="walks-list">
          <WalksList walks={walks} />
        </div>
      </main>
    </Layout>
  );
}