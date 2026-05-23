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
const GRAPH_LABEL_AREA = 28;
const GRAPH_VALUE_GAP = 8;

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
  const chartHeight = Math.max(height - GRAPH_PADDING * 2 - GRAPH_LABEL_AREA, 1);
  const chartBottom = height - GRAPH_PADDING - GRAPH_LABEL_AREA;
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
        {renderFrame(chartWidth, chartHeight, chartBottom, width)}
        {kind === "line"
          ? renderLine(data, chartMax, chartWidth, chartHeight, width, chartBottom, valueFormatter)
          : renderBars(data, chartMax, chartWidth, chartHeight, chartBottom, valueFormatter)}
      </svg>
      <figcaption className="basic-graph-caption">
        <span>{title}</span>
        <span>{accessibleSummary}</span>
      </figcaption>
    </figure>
  );
};

function renderFrame(width: number, height: number, chartBottom: number, svgWidth: number) {
  const chartTop = chartBottom - height;
  const midline = chartTop + height / 2;

  return (
    <g className="basic-graph-frame">
      <line
        className="basic-graph-grid"
        x1={GRAPH_PADDING}
        x2={formatNumber(svgWidth - GRAPH_PADDING)}
        y1={formatNumber(midline)}
        y2={formatNumber(midline)}
      />
      <line
        className="basic-graph-axis"
        x1={GRAPH_PADDING}
        x2={formatNumber(GRAPH_PADDING + width)}
        y1={formatNumber(chartBottom)}
        y2={formatNumber(chartBottom)}
      />
    </g>
  );
}

function renderBars(
  data: BasicGraphDatum[],
  max: number,
  width: number,
  height: number,
  chartBottom: number,
  valueFormatter: (value: number) => string,
) {
  if (data.length === 0) return <g className="basic-graph-empty" />;

  const gap = 8;
  const barWidth = Math.max((width - gap * (data.length - 1)) / data.length, 1);

  return (
    <g className="basic-graph-bars">
      {data.map((item, index) => {
        const barHeight = Math.max((item.value / max) * height, 0);
        const x = GRAPH_PADDING + index * (barWidth + gap);
        const y = chartBottom - barHeight;
        const labelX = x + barWidth / 2;

        return (
          <g className="basic-graph-bar-group">
            <rect
              className="basic-graph-bar"
              x={formatNumber(x)}
              y={formatNumber(y)}
              width={formatNumber(barWidth)}
              height={formatNumber(barHeight)}
            />
            <text
              className="basic-graph-value"
              x={formatNumber(labelX)}
              y={formatNumber(Math.max(y - GRAPH_VALUE_GAP, GRAPH_PADDING / 2))}
            >
              {valueFormatter(item.value)}
            </text>
            <text
              className="basic-graph-label"
              x={formatNumber(labelX)}
              y={formatNumber(chartBottom + 18)}
            >
              {item.label}
            </text>
          </g>
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
  chartBottom: number,
  valueFormatter: (value: number) => string,
) {
  if (data.length === 0) return <g className="basic-graph-empty" />;

  const step = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data.map((item, index) => ({
    item,
    x: data.length > 1 ? GRAPH_PADDING + index * step : svgWidth / 2,
    y: chartBottom - Math.max((item.value / max) * height, 0),
  }));
  const pointList = points
    .map((point) => `${formatNumber(point.x)},${formatNumber(point.y)}`)
    .join(" ");

  return (
    <g className="basic-graph-line-series">
      <polyline className="basic-graph-line" points={pointList} fill="none" />
      {points.map((point) => (
        <g className="basic-graph-point-group">
          <circle
            className="basic-graph-point"
            cx={formatNumber(point.x)}
            cy={formatNumber(point.y)}
            r="3.5"
          />
          <text
            className="basic-graph-value"
            x={formatNumber(point.x)}
            y={formatNumber(Math.max(point.y - GRAPH_VALUE_GAP, GRAPH_PADDING / 2))}
          >
            {valueFormatter(point.item.value)}
          </text>
          <text
            className="basic-graph-label"
            x={formatNumber(point.x)}
            y={formatNumber(chartBottom + 18)}
          >
            {point.item.label}
          </text>
        </g>
      ))}
    </g>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
