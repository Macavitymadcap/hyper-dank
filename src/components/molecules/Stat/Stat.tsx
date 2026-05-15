interface StatProps { label: string; value?: number }

export const Stat = ({ label, value }: StatProps) => {
  const formattedValue = value && value > 0 ? value.toFixed(1) : '--';
  return (
    <div className="stat">
      <output className="stat-label">{label}</output>
      <output className="stat-value">{formattedValue}</output>
    </div>
  )
}
