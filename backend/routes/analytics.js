const express = require("express");
const pool=require('../db')
const router = express.Router();
const auth = require('../middleware/auth')

//get summary by month 
router.get('/summary', auth, async (req, res) => {
  const { year, month } = req.query;
  const userId = req.user.id;
  
  const monthNum = parseInt(month);
  if (!year || !month || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({ error: 'year=YYYY&month=1-12 required' });
  }
  
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) as net
      FROM transactions
      WHERE user_id = $1 
        AND EXTRACT(YEAR FROM date) = $2 
        AND EXTRACT(MONTH FROM date) = $3
    `, [userId, parseInt(year), monthNum]);
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/categories?year=2026&month=1
router.get('/categories', auth, async (req, res) => {
  const { year, month } = req.query;
  const userId = req.user.id;
  
  const monthNum = parseInt(month);
  if (!year || !month || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({ error: 'year=YYYY&month=1-12 required' });
  }
  
  try {
    const result = await pool.query(`
      SELECT 
        c.name as category,
        SUM(t.amount) as spent,
        COUNT(*) as transaction_count
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1 
        AND t.type = 'expense'
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      GROUP BY c.id, c.name
      ORDER BY spent DESC
    `, [userId, parseInt(year), monthNum]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;
