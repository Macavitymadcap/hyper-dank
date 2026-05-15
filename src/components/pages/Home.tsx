import type { WalkWithStats, Stats } from "../../db"
import { Layout } from "../templates/Layout";
import { Stats as StatsSection} from "../organisms/Stats";
import { WalkForm } from "../organisms/WalkForm";
import { WalksList } from "../organisms/WalksList";
import { styleRegistry } from "../style-registry";

interface HomeProps { walks: WalkWithStats[]; stats: Stats }

const homeStyles = /* css */`
.container {
  background: var(--gray-0);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-3);
  overflow: visible;
}

.app-header {
  background: var(--gray-0);
  padding: var(--size-4);
  border-bottom: var(--border-size-2) solid var(--blue-6);
  position: sticky;
  top: 0;
  z-index: var(--layer-5);
  border-start-start-radius: var(--radius-3);
  border-start-end-radius: var(--radius-3);
  box-shadow: var(--shadow-2);
}

.title {
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-7);
  margin: 0;
  color: var(--gray-9);
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: var(--size-5);
  padding: var(--size-5) var(--size-2);
}

.page-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
}

.section-title {
  color: var(--gray-8);
  font-size: var(--font-size-2);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-1);
  margin: 0;
}

.form-section {
  background: var(--blue-6);
  padding: var(--size-4);
  color: var(--gray-0);
  border-radius: var(--radius-2);
}
`;

export const Home = ({walks, stats}: HomeProps) => {
  styleRegistry.register(homeStyles);

  return(
    <Layout>
      <main class="container">
        <header class="app-header">
          <h1 class="title">Walking Pace Tracker</h1>
        </header>

        <div class="content-sections">
          <section class="page-section" aria-labelledby="summary-heading">
            <h3 id="summary-heading" class="section-title">Summary</h3>
            <div id="stats" hx-get="/stats" hx-trigger="refresh from:body">
              <StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />
            </div>
          </section>

          <section class="page-section" aria-labelledby="entry-heading">
            <h3 id="entry-heading" class="section-title">Add walk</h3>
            <div class="form-section">
              <WalkForm />
            </div>
          </section>

          <section class="page-section" aria-labelledby="history-heading">
            <h3 id="history-heading" class="section-title">Walk history</h3>
            <div id="walks-list">
              <WalksList walks={walks} />
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
