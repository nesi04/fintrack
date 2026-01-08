const express = require('express');
const pool = require('../db')
const router = express.Router();

router.get('/',async (req,res)=>{
    const {user_id=1}=req.query;
    try {
        const result = await pool.query(
            'SELECT t.id,t.amount,t.type,t.date,t.note,t.account_id,t.category_id,t.created_at,a.name as account_name , c.name as category_name FROM transactions t LEFT JOIN  accounts a ON t.account_id=a.id LEFT JOIN categories c ON t.category_id=c.id WHERE t.user_id=$1 AND t.is_deleted=FALSE ORDER BY t.date DESC ,t.created_at DESC',[user_id]
        );
        res.json(result.rows);
        
    } catch (error) {   
     console.error(error);
     res.status(500).json({error:error.message});   
    }
});

router.post('/',async (req,res)=>{
    const {amount , type,date,account_id,category_id,note,user_id=1}=req.body;
    if(!amount||!type||!date||!account_id||!category_id){
       return  res.status(400).json({error:'amount , type , date , account_id , category_id is required'});
    }
    try {
        const result = await pool.query(
            'INSERT INTO transactions (user_id,account_id,category_id,amount,type,date,note) VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING id , amount , type , date, note, account_id, category_id, created_at ',[user_id,account_id,category_id,amount,type,date,note]
        );
        res.status(201).json(result.rows[0]);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:error.message});
    }

});

module.exports=router;