import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import SpendingChart from '../components/Charts/SpendingChart';
import CategoryChart from '../components/Charts/CategoryChart';
import TransactionCard from '../components/TransactionCard';
import BudgetProgress from '../components/BudgetProgress';

export default function Dashboard() {
  const { data: summary } = useQuery({ queryKey: ['summary'], queryFn: async () => (await api.get('/analytics/summary')).data });
  const { data: monthly = [] } = useQuery({ queryKey: ['monthly'], queryFn: async () => (await api.get('/analytics/monthly')).data });
  const { data: byCategory = [] } = useQuery({ queryKey: ['by-category'], queryFn: async () => (await api.get('/analytics/by-category')).data });
  const { data: txData } = useQuery({ queryKey: ['recent'], queryFn: async () => (await api.get('/transactions?limit=5')).data });
  const { data: budgets = [] } = useQuery({ queryKey: ['budgets-dashboard'], queryFn: async () => (await api.get('/budgets')).data });

  return (
    <section>
      <div className="stat-grid">
        <div className="stat-card fade-up"><p>Income</p><h3 className="mono">${summary?.income || 0}</h3></div>
        <div className="stat-card fade-up" style={{ animationDelay: '90ms' }}><p>Expense</p><h3 className="mono">${summary?.expense || 0}</h3></div>
        <div className="stat-card fade-up" style={{ animationDelay: '180ms' }}><p>Balance</p><h3 className="mono">${summary?.balance || 0}</h3></div>
        <div className="stat-card fade-up" style={{ animationDelay: '270ms' }}><p>Savings Rate</p><h3 className="mono">{summary?.savingsRate || 0}%</h3></div>
      </div>
      <div className="chart-grid">
        <SpendingChart data={monthly} />
        <CategoryChart data={byCategory} />
      </div>
      <div className="chart-grid">
        <div className="panel fade-up" style={{ animationDelay: '120ms' }}>
          <h3>Recent Transactions</h3>
          {(txData?.transactions || []).map((tx) => (
            <TransactionCard key={tx._id} item={tx} />
          ))}
        </div>
        <div className="panel fade-up" style={{ animationDelay: '200ms' }}>
          <h3>Budget Progress</h3>
          {budgets.slice(0, 5).map((budget) => (
            <BudgetProgress key={budget._id} budget={budget} />
          ))}
        </div>
      </div>
    </section>
  );
}
