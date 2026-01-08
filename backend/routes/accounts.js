const express = require('express');
const pool= require('../db');
const router = express.Router();

router.get('/',async(req,res)=>{
    const{user_id=1}=req.query;
    try {
        const result=await pool.query(
            'SELECT id,name,type,created_at FROM accounts WHERE user_id=$1 ORDER BY created_at DESC ',[user_id]
        );
        res.json(result.rows);
        
    } catch (error) {
       console.error(error);
       res.status(500).json({error:error.message}) ;
    }
});
router.post('/',async (req,res)=>{
    const {name,type,user_id=1}=req.body;
    if(!name||!type){
        return res.status(400).json({error:"Name and type required"});
    }
    try {
        const result = await pool.query(
            'INSERT INTO accounts (user_id,name ,type) VALUES ($1 , $2 , $3) RETURNING id,name,type,created_at',[user_id,name,type]
        );
        res.status(200).json(result.rows[0]);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:error.message});
    }
});

router.delete('/:id',async (req,res)=>{
  const accoundId = req.params.id;
  const {user_id=1}=req.query;

  try {
    await pool.query('DELETE FROM transactions WHERE account_id=$1 AND user_id=$2',[accoundId,user_id]);
    const result = await pool.query('DELETE from ACCOUNTS WHERE id=$1 AND user_id=$2 RETURNING id',[accoundId,user_id]);
    if(result.rows.length===0){
      return res.status(404).json({error:'Account not found'});
    }
    res.json({message:'Account deleted',deleted_id:result.rows[0].id})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({error:error.message})
  }
});

router.post('/seed-user', async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) 
       VALUES ('Test User', 'test@example.com', 'hashed_password_123') 
       RETURNING id`
    );
     if (result.rows.length === 0) {
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1', 
        ['test@example.com']
      );
      return res.json({ user_id: existing.rows[0].id });
    }
    
    
    res.json({ user_id: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM accounts WHERE user_id = 1');
    await pool.query('DELETE FROM transactions WHERE user_id = 1'); 
    res.json({ message: 'Test data reset', accounts_deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports=router;