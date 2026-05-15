import { Stat } from "../../molecules/Stat";

interface StatsProps { avgSpeed: number; medianPace?: number }

export const Stats = ({ avgSpeed, medianPace }: StatsProps ) => {
  return (
    <div class="stats">
      <Stat label="Avg mph" value={avgSpeed} />
      <Stat label="Med min/mi" value={medianPace} />
    </div>
  );
};
