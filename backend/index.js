const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message:'Fintech is working'});
});

app.get('/health/db',async(req,res)=>{
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(
            {
            status:'ok',
            time:result.rows[0].now,
            }
        );

        
    } catch (err) {
       console.error(err);
       res.status(500).json({status:'error',error:err.message}) 
    }
});

app.use('/auth',require('./routes/auth'));
app.use('/api/accounts',auth,require('./routes/accounts'));
app.use('/api/transactions',auth,require('./routes/transactions'));
app.use('/analytics', require('./routes/analytics'));


const PORT =process.env.port;
app.listen(PORT,()=>{
    console.log(`Started listening on port ${PORT}`);
});