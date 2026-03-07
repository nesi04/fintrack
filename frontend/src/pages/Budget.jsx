import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import BudgetProgress from '../components/BudgetProgress';
import { EXPENSE_CATEGORIES } from '../constants/categories';

const now = new Date();
const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

export default function Budget() {
  const [form, setForm] = useState({ category: 'food', limit: '', month: defaultMonth });
  const queryClient = useQueryClient();

  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets', form.month],
    queryFn: async () => (await api.get(`/budgets?month=${form.month}`)).data
  });

  const createBudget = useMutation({
    mutationFn: async (payload) => (await api.post('/budgets', payload)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] })
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createBudget.mutate({ ...form, limit: Number(form.limit) });
  };

  return (
    <section>
      <form className="panel row gap fade-up" onSubmit={onSubmit}>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input type="number" placeholder="Limit" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} required />
        <input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
        <button type="submit">Set Budget</button>
      </form>
      <div className="chart-grid">
        {budgets.map((budget) => (
          <BudgetProgress key={budget._id} budget={budget} />
        ))}
      </div>
    </section>
  );
}
