const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: {
      type: String,
      enum: [
        'food',
        'rent',
        'transport',
        'utilities',
        'entertainment',
        'health',
        'shopping',
        'salary',
        'other'
      ],
      required: true
    },
    date: { type: Date, default: Date.now },
    description: { type: String, trim: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);

