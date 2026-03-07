const COLORS = ['#c8f54a', '#93d335', '#668d24', '#f59e0b', '#ef4444', '#22d3ee', '#f97316'];

const polarToCartesian = (cx, cy, radius, angle) => ({
  x: cx + radius * Math.cos((angle - 90) * (Math.PI / 180)),
  y: cy + radius * Math.sin((angle - 90) * (Math.PI / 180))
});

const describeArc = (cx, cy, radius, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

export default function CategoryChart({ data }) {
  const points = data.length ? data : [
    { category: 'food', total: 480 },
    { category: 'transport', total: 220 },
    { category: 'utilities', total: 290 },
    { category: 'health', total: 170 },
    { category: 'shopping', total: 320 }
  ];
  const total = points.reduce((sum, item) => sum + item.total, 0) || 1;
  let start = 0;

  return (
    <div className="panel chart fade-up" style={{ animationDelay: '120ms' }}>
      <h3>By Category</h3>
      <svg className="chart-svg" viewBox="0 0 260 260" role="img" aria-label="Spending by category">
        {points.map((entry, index) => {
          const slice = (entry.total / total) * 360;
          const path = describeArc(130, 130, 86, start, start + slice);
          start += slice;
          return <path key={entry.category} d={path} stroke={COLORS[index % COLORS.length]} strokeWidth="26" fill="none" />;
        })}
      </svg>
      <div className="category-list">
        {points.map((entry, index) => (
          <p key={entry.category} className="mono-small">
            <i className="legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
            {entry.category} ${entry.total}
          </p>
        ))}
      </div>
    </div>
  );
}
