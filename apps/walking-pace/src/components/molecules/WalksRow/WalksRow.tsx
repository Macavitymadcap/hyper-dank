import { Button, HxForm, TableCell } from "@macavitymadcap/hyper-dank-ui";

interface WalksRowProps {
  id: number;
  createdAt: string;
  miles: number;
  minutes: number;
  seconds: number;
  speed: number;
  pace: number;
  canMutate?: boolean;
}

export const WalksRow = ({
  id,
  createdAt,
  miles,
  minutes,
  seconds,
  speed,
  pace,
  canMutate = true,
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
      <TableCell className="walks-cell" value={miles.toFixed(1)} />
      <TableCell className="walks-cell" value={minutes} />
      <TableCell className="walks-cell" value={seconds} />
      <TableCell className="walks-cell" value={speed > 0 ? speed.toFixed(1) : "--"} />
      <TableCell className="walks-cell" value={pace > 0 ? pace.toFixed(1) : "--"} />
      {canMutate ? (
        <td data-action-column="true">
          <HxForm action={`/walks/${id}/delete`} method="post">
            <Button
              className="clear-walk-btn"
              type="submit"
              size="compact"
              variant="danger"
              hx-delete={`/walks/${id}`}
              hx-target="#walks-list"
              hx-swap="innerHTML"
              hx-confirm="Clear this walk?"
            >
              Clear
            </Button>
          </HxForm>
        </td>
      ) : null}
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
