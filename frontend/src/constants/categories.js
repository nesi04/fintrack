export const TRANSACTION_CATEGORIES = [
  'food',
  'rent',
  'transport',
  'utilities',
  'entertainment',
  'health',
  'shopping',
  'salary',
  'other'
];

export const EXPENSE_CATEGORIES = TRANSACTION_CATEGORIES.filter((category) => category !== 'salary');
