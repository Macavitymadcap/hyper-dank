import type { WalkWithStats } from "../../../db";
import { Button } from "../../atoms/Button";
import { Chip } from "../../atoms/Chip";
import { HxForm } from "../../molecules/HxForm";
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
  "minmax(0, 1.25fr)",
  "minmax(0, 0.58fr)",
  "minmax(0, 0.66fr)",
  "minmax(0, 0.66fr)",
  "minmax(0, 0.74fr)",
  "minmax(0, 0.9fr)",
  "minmax(4.35rem, 0.95fr)",
].join(" ");

interface WalksTableProps {
  walks: WalkWithStats[];
  canMutate?: boolean;
}

export const WalksTable = ({ walks, canMutate = true }: WalksTableProps) => {
  const countLabel = `${walks.length} ${walks.length === 1 ? "walk" : "walks"}`;

  if (walks.length === 0) {
    return (
      <div class="walks-history">
        <header class="history-header">
          <h3 id="history-heading" class="section-title">
            Walk history
          </h3>
          <Chip className="history-count">{countLabel}</Chip>
        </header>
        <div class="empty-state">No walks recorded yet. Add your first walk above!</div>
      </div>
    );
  }
  const isScrollable = walks.length > 3;

  return (
    <div class="walks-history">
      <header class="history-header">
        <h3 id="history-heading" class="section-title">
          Walk history
        </h3>
        <Chip className="history-count">{countLabel}</Chip>
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
              <HxForm action="/walks/delete" method="post">
                <Button
                  className="clear-walks-btn"
                  type="submit"
                  size="compact"
                  variant="outline"
                  hx-delete="/walks"
                  hx-target="#walks-list"
                  hx-swap="innerHTML"
                  hx-confirm="Clear all walks?"
                  hx-on="htmx:afterRequest: htmx.trigger('#stats', 'refresh')"
                >
                  Clear all
                </Button>
              </HxForm>
            ),
            isAction: true,
          },
        ].filter((column) => canMutate || column.key !== "actions")}
        columnsTemplate={columnsTemplate}
        isScrollable={isScrollable}
        mobileColumnsTemplate={mobileColumnsTemplate}
        mobileRowHeight="3.25rem"
        mobileScrollBodyRows={3}
        rowClassName="walks-row"
        scrollBodyRows={4}
      >
        {walks.map((walk) => (
          <WalksRow
            key={walk.id}
            id={walk.id}
            createdAt={walk.created_at}
            miles={walk.miles}
            minutes={walk.minutes}
            seconds={walk.seconds}
            speed={walk.speed}
            pace={walk.pace}
            canMutate={canMutate}
          />
        ))}
      </ScrollableTable>
    </div>
  );
};
