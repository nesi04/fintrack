export default function SpendingChart({ data }) {
  const points = data.length ? data : [
    { month: '2025-10', income: 4200, expense: 2900 },
    { month: '2025-11', income: 4100, expense: 3100 },
    { month: '2025-12', income: 5000, expense: 3500 },
    { month: '2026-01', income: 4700, expense: 3300 },
    { month: '2026-02', income: 5300, expense: 3900 },
    { month: '2026-03', income: 5600, expense: 3600 }
  ];
  const width = 560;
  const height = 240;
  const padding = 22;
  const maxValue = Math.max(...points.map((p) => Math.max(p.income, p.expense)), 1);
  const stepX = (width - padding * 2) / Math.max(points.length - 1, 1);

  const makePath = (key) => points.map((point, index) => {
    const x = padding + (index * stepX);
    const y = height - padding - ((point[key] / maxValue) * (height - padding * 2));
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  return (
    <div className="panel chart fade-up" style={{ animationDelay: '60ms' }}>
      <h3>Monthly Trend</h3>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Income vs expense line chart">
        <path d={makePath('income')} className="chart-line income-line" />
        <path d={makePath('expense')} className="chart-line expense-line" />
      </svg>
      <div className="legend-row">
        <span><i className="legend-dot income-dot" />Income</span>
        <span><i className="legend-dot expense-dot" />Expense</span>
      </div>
      <div className="mono-small chart-labels">
        {points.map((p) => <span key={p.month}>{p.month.slice(5)}</span>)}
      </div>
    </div>
  );
}
