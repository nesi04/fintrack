export default function TransactionCard({ item }) {
  const income = item.type === 'income';
  return (
    <article className="tx-item">
      <div className="row">
        <strong>{income ? '↑' : '↓'} {item.title}</strong>
        <span className={income ? 'ok mono' : 'danger mono'}>
          {income ? '+' : '-'}${Number(item.amount).toFixed(2)}
        </span>
      </div>
      <p className="mono-small">{item.category} | {new Date(item.date).toLocaleDateString()}</p>
      {item.description ? <small className="dim">{item.description}</small> : null}
    </article>
  );
}
