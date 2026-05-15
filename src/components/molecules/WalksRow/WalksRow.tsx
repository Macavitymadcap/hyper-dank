import { Button } from "../../atoms/Button";
import { WalksCell } from "../../atoms/WalksCell";

interface WalksRowProps {
  id: number;
  miles: number;
  minutes: number;
  seconds: number;
  speed: number;
  pace: number;
}

export const WalksRow = ({
  id, 
  miles, 
  minutes, 
  seconds, 
  speed, 
  pace 
}: WalksRowProps) => {
  return (
    <tr className="walks-row">
      <WalksCell value={miles.toFixed(1)} />
      <WalksCell value={minutes} />
      <WalksCell value={seconds} />
      <WalksCell value={speed > 0 ? speed.toFixed(1) : '--'} />
      <WalksCell value={pace > 0 ? pace.toFixed(1) : '--'} />
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
