import type { WalkWithStats } from "../../../db";
import { Button } from "../../atoms/Button";
import { ScrollableTable } from "../../molecules/ScrollableTable";
import { WalksRow } from "../../molecules/WalksRow";

const columnsTemplate = [
  "minmax(5.5rem, 1fr)",
  "minmax(3.25rem, 0.62fr)",
  "minmax(3.4rem, 0.65fr)",
  "minmax(3.4rem, 0.65fr)",
  "minmax(4rem, 0.76fr)",
  "minmax(5rem, 0.95fr)",
  "minmax(5.5rem, 0.95fr)",
].join(" ");

const mobileColumnsTemplate = [
  "minmax(3.65rem, 1.05fr)",
  "minmax(1.8rem, 0.52fr)",
  "minmax(2.05rem, 0.58fr)",
  "minmax(2.05rem, 0.58fr)",
  "minmax(2.35rem, 0.66fr)",
  "minmax(2.85rem, 0.78fr)",
  "minmax(3.55rem, 0.9fr)",
].join(" ");

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
      <ScrollableTable
        className="walks-table"
        columns={[
          { key: "created-at", header: "Date time" },
          { key: "miles", header: "Mi" },
          { key: "minutes", header: "Min" },
          { key: "seconds", header: "Sec" },
          { key: "speed", header: "mph" },
          { key: "pace", header: "min/mi" },
          {
            key: "actions",
            header: (
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
            ),
            isAction: true,
          },
        ]}
        columnsTemplate={columnsTemplate}
        isScrollable={isScrollable}
        minBodyRows={2}
        mobileColumnsTemplate={mobileColumnsTemplate}
        mobileRowHeight="3.25rem"
        rowClassName="walks-row"
      >
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
      </ScrollableTable>
    </div>
  );
};
