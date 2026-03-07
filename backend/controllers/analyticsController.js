const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

exports.getSummary = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const income = result.find((r) => r._id === 'income')?.total || 0;
    const expense = result.find((r) => r._id === 'expense')?.total || 0;

    res.json({
      income,
      expense,
      balance: income - expense,
      savingsRate: income > 0 ? Number((((income - expense) / income) * 100).toFixed(2)) : 0
    });
  } catch (error) {
    next(error);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: 'expense'
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(result.map((item) => ({ category: item._id, total: item.total })));
  } catch (error) {
    next(error);
  }
};

exports.getMonthly = async (req, res, next) => {
  try {
    const now = new Date();
    const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

    const result = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: from }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: { year: '$_id.year', month: '$_id.month' },
          totals: {
            $push: {
              k: '$_id.type',
              v: '$total'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          values: { $arrayToObject: '$totals' }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    const formatted = result.map((row) => {
      const label = `${row.year}-${String(row.month).padStart(2, '0')}`;
      return {
        month: label,
        income: row.values.income || 0,
        expense: row.values.expense || 0
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};
