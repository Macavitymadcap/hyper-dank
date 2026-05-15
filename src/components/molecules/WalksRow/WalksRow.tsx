import { Button } from "../../atoms/Button";
import { WalksCell } from "../../atoms/WalksCell";

interface WalksRowProps {
  id: number;
  createdAt: string;
  miles: number;
  minutes: number;
  seconds: number;
  speed: number;
  pace: number;
}

export const WalksRow = ({
  id,
  createdAt,
  miles,
  minutes,
  seconds,
  speed,
  pace
}: WalksRowProps) => {
  return (
    <tr className="walks-row">
      <td className="walks-cell">
        <time dateTime={createdAt}>{formatCreatedTime(createdAt)}</time>
      </td>
      <WalksCell value={miles.toFixed(1)} />
      <WalksCell value={minutes} />
      <WalksCell value={seconds} />
      <WalksCell value={speed > 0 ? speed.toFixed(1) : '--'} />
      <WalksCell value={pace > 0 ? pace.toFixed(1) : '--'} />
      <td>
        <Button
          className="clear-walk-btn"
          type="button"
          size="compact"
          variant="danger"
          hxDelete={`/walks/${id}`}
          hxTarget="#walks-list"
          hxSwap="innerHTML"
          hxConfirm="Clear this walk?"
          hxOn="htmx:afterRequest: htmx.trigger('#stats', 'refresh')"
        >
          Clear
        </Button>
      </td>
    </tr>
  );
}

function formatCreatedTime(createdAt: string) {
  const match = createdAt.match(/\b(\d{2}):(\d{2})/);
  if (!match) return createdAt;

  return `${match[1]}:${match[2]}`;
}
