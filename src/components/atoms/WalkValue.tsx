import { styleRegistry } from "../templates/style-registry";

interface WalkValueProps { value: string | number }

const walkValueStyles = /* css */`
.walk-value {
  text-align: center;
}
`;

export const WalkValue = ({ value }: WalkValueProps) => {
  styleRegistry.register(walkValueStyles);

  return (
    <td className="walk-value">{value}</td>
  )
}
