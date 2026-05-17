import type { AuthUser } from "../../../auth";
import type { Stats, WalkWithStats } from "../../../db";
import { Stats as StatsSection } from "../Stats";
import { WalksTable } from "../WalksTable";

interface AdminScoresPanelProps {
  selectedStats: Stats;
  selectedUser?: AuthUser;
  selectedWalks: WalkWithStats[];
}

export const AdminScoresPanel = ({
  selectedStats,
  selectedUser,
  selectedWalks,
}: AdminScoresPanelProps) => {
  if (!selectedUser) {
    return <p class="muted-text">No users available.</p>;
  }

  return (
    <>
      <div class="score-summary">
        <strong>{selectedUser.email}</strong>
        <StatsSection avgSpeed={selectedStats.avgSpeed} medianPace={selectedStats.medianPace} />
      </div>
      <WalksTable walks={selectedWalks} canMutate={false} />
    </>
  );
};
