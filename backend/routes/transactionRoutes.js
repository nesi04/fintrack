const express = require('express');
const { body, param } = require('express-validator');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

const allowedCategories = [
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

router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
      body('type').isIn(['income', 'expense']).withMessage('Invalid type'),
      body('category').isIn(allowedCategories).withMessage('Invalid category'),
      body('date').optional().isISO8601().withMessage('Invalid date')
    ],
    validate,
    createTransaction
  );

router
  .route('/:id')
  .put(
    [
      param('id').isMongoId().withMessage('Invalid transaction id'),
      body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
      body('type').optional().isIn(['income', 'expense']).withMessage('Invalid type'),
      body('category').optional().isIn(allowedCategories).withMessage('Invalid category'),
      body('date').optional().isISO8601().withMessage('Invalid date')
    ],
    validate,
    updateTransaction
  )
  .delete([param('id').isMongoId().withMessage('Invalid transaction id')], validate, deleteTransaction);

module.exports = router;
