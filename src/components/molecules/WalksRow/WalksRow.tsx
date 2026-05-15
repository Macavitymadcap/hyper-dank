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
  pace,
}: WalksRowProps) => {
  const createdDateTime = formatCreatedDateTime(createdAt);

  return (
    <tr className="scrollable-table-row walks-row">
      <td className="walks-cell">
        <time className="walk-created-at" dateTime={createdAt}>
          <span>{createdDateTime.date}</span>
          <span>{createdDateTime.time}</span>
        </time>
      </td>
      <WalksCell value={miles.toFixed(1)} />
      <WalksCell value={minutes} />
      <WalksCell value={seconds} />
      <WalksCell value={speed > 0 ? speed.toFixed(1) : "--"} />
      <WalksCell value={pace > 0 ? pace.toFixed(1) : "--"} />
      <td data-action-column="true">
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
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

function formatCreatedDateTime(createdAt: string) {
  const match = createdAt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!match) return { date: createdAt, time: "" };

  const [, , month, day, hour, minute] = match;
  const monthName = months[Number(month) - 1] ?? month;

  return {
    date: `${Number(day)} ${monthName}`,
    time: `${hour}:${minute}`,
  };
}
