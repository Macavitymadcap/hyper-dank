import { Button } from "../atoms/Button";
import { WalkValue } from "../atoms/WalkValue";
import { styleRegistry } from "../style-registry";

interface WalkItemProps {
  id: number;
  miles: number;
  minutes: number;
  seconds: number;
  speed: number;
  pace: number;
}

const walkItemStyles = /* css */`
.delete-btn {
  padding: var(--size-1) var(--size-2);
  background: var(--red-6);
  color: var(--gray-0);
  border: none;
  border-radius: var(--radius-2);
  cursor: pointer;
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
  transition: background var(--speed-2);
}

.delete-btn:hover {
  background: var(--red-7);
}
`;

export const WalkItem = ({
  id, 
  miles, 
  minutes, 
  seconds, 
  speed, 
  pace 
}: WalkItemProps) => {
  styleRegistry.register(walkItemStyles);

  return (
    <tr className="walk-item">
      <WalkValue value={miles.toFixed(1)} />
      <WalkValue value={minutes} />
      <WalkValue value={seconds} />
      <WalkValue value={speed > 0 ? speed.toFixed(1) : '--'} />
      <WalkValue value={pace > 0 ? pace.toFixed(1) : '--'} />
      <td>
        <Button 
          className="delete-btn"
          type="button"
          hxDelete={`/walks/${id}`}
          hxTarget="#walks-list"
          hxSwap="innerHTML"
          hxOn="htmx:afterRequest: htmx.trigger('#stats', 'refresh')"
        >
          Del
        </Button>
      </td>
    </tr>
  );
}