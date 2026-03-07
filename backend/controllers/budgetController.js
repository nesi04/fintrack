const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const calcSpent = async (userId, category, month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));

  const result = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: 'expense',
        category,
        date: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  return result[0]?.total || 0;
};

exports.getBudgets = async (req, res, next) => {
  try {
    const month = req.query.month;
    const filter = { user: req.user._id };

    if (month) filter.month = month;

    const budgets = await Budget.find(filter).sort({ category: 1 });

    const withSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calcSpent(req.user._id, budget.category, budget.month);
        if (budget.spent !== spent) {
          budget.spent = spent;
          await budget.save();
        }
        return budget;
      })
    );

    res.json(withSpent);
  } catch (error) {
    next(error);
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const { category, limit, month } = req.body;

    const exists = await Budget.findOne({ user: req.user._id, category, month });
    if (exists) {
      return res.status(400).json({ message: 'Budget already exists for category and month' });
    }

    const spent = await calcSpent(req.user._id, category, month);

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      month,
      spent
    });

    return res.status(201).json(budget);
  } catch (error) {
    return next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(budget, req.body);
    budget.spent = await calcSpent(req.user._id, budget.category, budget.month);

    const updated = await budget.save();
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};
