interface WalkValueProps { value: string | number }

export const WalkValue = ({ value }: WalkValueProps) => (
  <td className="walk-value">{value}</td>
)
