const express = require('express');
const { body, param } = require('express-validator');
const { getBudgets, createBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBudgets)
  .post(
    [
      body('category').trim().notEmpty().withMessage('Category is required'),
      body('limit').isFloat({ gt: 0 }).withMessage('Limit must be greater than 0'),
      body('month').matches(/^\d{4}-\d{2}$/).withMessage('Month must be YYYY-MM')
    ],
    validate,
    createBudget
  );

router
  .route('/:id')
  .put(
    [
      param('id').isMongoId().withMessage('Invalid budget id'),
      body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
      body('limit').optional().isFloat({ gt: 0 }).withMessage('Limit must be greater than 0'),
      body('month').optional().matches(/^\d{4}-\d{2}$/).withMessage('Month must be YYYY-MM')
    ],
    validate,
    updateBudget
  );

module.exports = router;
