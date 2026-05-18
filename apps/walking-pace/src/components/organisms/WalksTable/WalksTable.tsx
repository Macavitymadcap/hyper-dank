import { Button, Chip, HxForm, ScrollableTable } from "@macavitymadcap/hyper-dank-ui";
import type { WalkWithStats } from "../../../db";
import {
  WALK_HISTORY_MOBILE_ROW_HEIGHT,
  WALK_HISTORY_ROW_HEIGHT,
  walkHistoryTableColumns,
} from "../../../shared/walk-history-table";
import { WalksRow } from "../../molecules/WalksRow";

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
          <h2 id="history-heading" class="section-title">
            Walk history
          </h2>
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
        <h2 id="history-heading" class="section-title">
          Walk history
        </h2>
        <Chip className="history-count">{countLabel}</Chip>
      </header>
      <ScrollableTable
        className="walks-table"
        columns={[
          { ...walkHistoryTableColumns.createdAt, header: "Date time" },
          { ...walkHistoryTableColumns.miles, header: "Mi" },
          { ...walkHistoryTableColumns.minutes, header: "Min" },
          { ...walkHistoryTableColumns.seconds, header: "Sec" },
          { ...walkHistoryTableColumns.speed, header: "mph" },
          { ...walkHistoryTableColumns.pace, header: "min/mi" },
          {
            ...walkHistoryTableColumns.actions,
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
                >
                  Clear all
                </Button>
              </HxForm>
            ),
            isAction: true,
          },
        ].filter((column) => canMutate || column.key !== "actions")}
        isScrollable={isScrollable}
        mobileRowHeight={WALK_HISTORY_MOBILE_ROW_HEIGHT}
        mobileScrollBodyRows={3}
        rowClassName="walks-row"
        rowHeight={WALK_HISTORY_ROW_HEIGHT}
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
