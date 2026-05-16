interface WalksCellProps {
  value: string | number;
}

export const WalksCell = ({ value }: WalksCellProps) => <td className="walks-cell">{value}</td>;
