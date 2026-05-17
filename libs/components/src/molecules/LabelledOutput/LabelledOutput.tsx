export interface LabelledOutputProps {
  label: string;
  value?: number;
}

export const LabelledOutput = ({ label, value }: LabelledOutputProps) => {
  const formattedValue = value && value > 0 ? value.toFixed(1) : "--";

  return (
    <div className="labelled-output">
      <output className="labelled-output-label">{label}</output>
      <output className="labelled-output-value">{formattedValue}</output>
    </div>
  );
};
