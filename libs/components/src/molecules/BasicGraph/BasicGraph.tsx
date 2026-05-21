export interface BasicGraphDatum {
  label: string;
  value: number;
}

export interface BasicGraphProps {
  className?: string;
  data: BasicGraphDatum[];
  height?: number;
  id: string;
  kind?: "bar" | "line";
  max?: number;
  summary?: string;
  title: string;
  valueFormatter?: (value: number) => string;
  width?: number;
}

const GRAPH_PADDING = 24;

export const BasicGraph = ({
  className,
  data,
  height = 160,
  id,
  kind = "bar",
  max,
  summary,
  title,
  valueFormatter = String,
  width = 320,
}: BasicGraphProps) => {
  const classes = ["basic-graph", className].filter(Boolean).join(" ");
  const titleId = `${id}-title`;
  const summaryId = `${id}-summary`;
  const chartMax = Math.max(max ?? 0, ...data.map((item) => item.value), 1);
  const chartWidth = Math.max(width - GRAPH_PADDING * 2, 1);
  const chartHeight = Math.max(height - GRAPH_PADDING * 2, 1);
  const accessibleSummary =
    summary ?? data.map((item) => `${item.label}: ${valueFormatter(item.value)}`).join("; ");

  return (
    <figure className={classes}>
      <svg
        className="basic-graph-svg"
        role="img"
        aria-labelledby={`${titleId} ${summaryId}`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <title id={titleId}>{title}</title>
        <desc id={summaryId}>{accessibleSummary}</desc>
        {kind === "line"
          ? renderLine(data, chartMax, chartWidth, chartHeight, width, height)
          : renderBars(data, chartMax, chartWidth, chartHeight, height)}
      </svg>
      <figcaption className="basic-graph-caption">
        <span>{title}</span>
        <span>{accessibleSummary}</span>
      </figcaption>
    </figure>
  );
};

function renderBars(
  data: BasicGraphDatum[],
  max: number,
  width: number,
  height: number,
  svgHeight: number,
) {
  if (data.length === 0) return <g className="basic-graph-empty" />;

  const gap = 8;
  const barWidth = Math.max((width - gap * (data.length - 1)) / data.length, 1);

  return (
    <g className="basic-graph-bars">
      {data.map((item, index) => {
        const barHeight = Math.max((item.value / max) * height, 0);
        const x = GRAPH_PADDING + index * (barWidth + gap);
        const y = svgHeight - GRAPH_PADDING - barHeight;

        return (
          <rect
            className="basic-graph-bar"
            x={formatNumber(x)}
            y={formatNumber(y)}
            width={formatNumber(barWidth)}
            height={formatNumber(barHeight)}
          />
        );
      })}
    </g>
  );
}

function renderLine(
  data: BasicGraphDatum[],
  max: number,
  width: number,
  height: number,
  svgWidth: number,
  svgHeight: number,
) {
  if (data.length === 0) return <g className="basic-graph-empty" />;

  const step = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data.map((item, index) => ({
    x: data.length > 1 ? GRAPH_PADDING + index * step : svgWidth / 2,
    y: svgHeight - GRAPH_PADDING - Math.max((item.value / max) * height, 0),
  }));
  const pointList = points
    .map((point) => `${formatNumber(point.x)},${formatNumber(point.y)}`)
    .join(" ");

  return (
    <g className="basic-graph-line-series">
      <polyline className="basic-graph-line" points={pointList} fill="none" />
      {points.map((point) => (
        <circle
          className="basic-graph-point"
          cx={formatNumber(point.x)}
          cy={formatNumber(point.y)}
          r="3"
        />
      ))}
    </g>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
