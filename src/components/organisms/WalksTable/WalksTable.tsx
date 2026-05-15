import type { WalkWithStats } from "../../../db";
import { Button } from "../../atoms/Button";
import { WalksRow } from "../../molecules/WalksRow";

export const WalksTable = ({ walks }: { walks: WalkWithStats[] }) => {
  const countLabel = `${walks.length} ${walks.length === 1 ? "walk" : "walks"}`;

  if (walks.length === 0) {
    return (
      <div class="walks-history">
        <header class="history-header">
          <h3 id="history-heading" class="section-title">Walk history</h3>
          <span class="history-count">{countLabel}</span>
        </header>
        <div class="empty-state">
          No walks recorded yet. Add your first walk above!
        </div>
      </div>
    );
  }
  const isScrollable = walks.length > 3;

  return (
    <div class="walks-history">
      <header class="history-header">
        <h3 id="history-heading" class="section-title">Walk history</h3>
        <span class="history-count">{countLabel}</span>
      </header>
      <div class="table-container" data-scrollable={isScrollable ? "true" : undefined}>
        <table class="walks-table">
          <thead>
            <tr class="walks-row">
              <th>Time</th>
              <th>Mi</th>
              <th>Min</th>
              <th>Sec</th>
              <th>mph</th>
              <th>min/mi</th>
              <th>
                <Button
                  className="clear-walks-btn"
                  type="button"
                  size="compact"
                  variant="outline"
                  hxDelete="/walks"
                  hxTarget="#walks-list"
                  hxSwap="innerHTML"
                  hxConfirm="Clear all walks?"
                  hxOn="htmx:afterRequest: htmx.trigger('#stats', 'refresh')"
                >
                  Clear all
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {walks.map(walk => (
              <WalksRow
                key={walk.id}
                id={walk.id}
                createdAt={walk.created_at}
                miles={walk.miles}
                minutes={walk.minutes}
                seconds={walk.seconds}
                speed={walk.speed}
                pace={walk.pace}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
