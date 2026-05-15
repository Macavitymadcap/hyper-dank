import { Button } from "../atoms/Button";
import { WalkValue } from "../atoms/WalkValue";

interface WalkItemProps {
  id: number;
  miles: number;
  minutes: number;
  seconds: number;
  speed: number;
  pace: number;
}

export const WalkItem = ({
  id, 
  miles, 
  minutes, 
  seconds, 
  speed, 
  pace 
}: WalkItemProps) => {
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
