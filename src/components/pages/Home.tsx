import type { WalkWithStats, Stats } from "../../db"
import { Layout } from "../templates/Layout";
import { Stats as StatsSection} from "../organisms/Stats";
import { WalkForm } from "../organisms/WalkForm";
import { WalksList } from "../organisms/WalksList";

interface HomeProps { walks: WalkWithStats[]; stats: Stats }

export const Home = ({walks, stats}: HomeProps) => {
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
