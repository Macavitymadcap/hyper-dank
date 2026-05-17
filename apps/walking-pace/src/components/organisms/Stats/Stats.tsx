import { LabelledOutput } from "@macavitymadcap/hyper-dank-components";

interface StatsProps {
  avgSpeed: number;
  medianPace?: number;
}

export const Stats = ({ avgSpeed, medianPace }: StatsProps) => {
  return (
    <div class="stats">
      <LabelledOutput label="Avg mph" value={avgSpeed} />
      <LabelledOutput label="Med min/mi" value={medianPace} />
    </div>
  );
};
