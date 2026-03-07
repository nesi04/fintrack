export default function BudgetProgress({ budget }) {
  const percent = Math.min((budget.spent / budget.limit) * 100, 100);
  const tone = percent < 70 ? 'safe' : percent < 90 ? 'warn' : 'risk';
  return (
    <article className="budget-item">
      <div className="row">
        <strong>{budget.category}</strong>
        <span className="mono-small">${budget.spent} / ${budget.limit}</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${tone}`} style={{ width: `${percent}%` }} />
      </div>
      <small className="mono-small">{budget.month} | {percent.toFixed(0)}%</small>
    </article>
  );
}
