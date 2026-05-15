import { Stat } from "../molecules/Stat";
import { styleRegistry } from "../templates/style-registry";

interface StatsProps { avgSpeed: number; medianPace?: number }

const statsStyles = /* css */`
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-2);
}
`;

export const Stats = ({ avgSpeed, medianPace }: StatsProps ) => {
  styleRegistry.register(statsStyles);

  return (
    <div class="stats">
      <Stat label="Avg mph" value={avgSpeed} />
      <Stat label="Med min/mi" value={medianPace} />
    </div>
  );
};