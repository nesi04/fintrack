import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import TransactionCard from '../components/TransactionCard';
import { TRANSACTION_CATEGORIES } from '../constants/categories';

const initial = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'food',
  date: new Date().toISOString().slice(0, 10),
  description: ''
};

export default function Transactions() {
  const [form, setForm] = useState(initial);
  const [filters, setFilters] = useState({ type: '', category: '' });
  const queryClient = useQueryClient();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    return params.toString();
  }, [filters]);

  const { data } = useQuery({
    queryKey: ['transactions', queryString],
    queryFn: async () => (await api.get(`/transactions${queryString ? `?${queryString}` : ''}`)).data
  });

  const createTx = useMutation({
    mutationFn: async (payload) => (await api.post('/transactions', payload)).data,
    onSuccess: () => {
      setForm(initial);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['recent'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['monthly'] });
      queryClient.invalidateQueries({ queryKey: ['by-category'] });
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createTx.mutate({ ...form, amount: Number(form.amount) });
  };

  return (
    <section className="chart-grid">
      <form className="panel fade-up" onSubmit={onSubmit}>
        <h3>Add Transaction</h3>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="expense">expense</option>
          <option value="income">income</option>
        </select>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {TRANSACTION_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit" disabled={createTx.isPending}>{createTx.isPending ? 'Saving...' : 'Save'}</button>
      </form>

      <div>
        <div className="panel row gap fade-up" style={{ animationDelay: '90ms' }}>
          <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
            <option value="">All types</option>
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
            <option value="">All categories</option>
            {TRANSACTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {(data?.transactions || []).map((item) => (
          <TransactionCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
