import { create } from 'zustand';
import api from '../api/axios';

const useFinanceStore = create((set) => ({
  transactions: [],
  budgets: [],
  summary: null,
  error: '',
  fetchDashboard: async () => {
    try {
      const [summary, transactions, budgets] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/transactions?limit=20'),
        api.get('/budgets')
      ]);

      set({
        summary: summary.data,
        transactions: transactions.data.transactions,
        budgets: budgets.data,
        error: ''
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch dashboard data'
      });
    }
  }
}));

export default useFinanceStore;
