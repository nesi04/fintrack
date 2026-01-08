const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const  JWT_SECRET= process.env.JWT_SECRET;
const ACCESS_EXPIRES='15m';
const REFRESH_EXPIRES='7d';


router.post('/register',async (req,res)=>{
    const {name,email,password}= req.body;
    if(!email||!password){
        res.status(400).json({error:"Email and password are requires"});
    }
    try {
        const hashed = await bcrypt.hash(password,10);
        const result = await pool.query(
            'INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3) RETURNING id,name,email',[name||email.split('@')[0],email,hashed]
        );
        res.status(201).json({user:result.rows[0]});
        
    } catch (err) {
        if(err.code==='23505') {
            return res.status(409).json({error:'Email already exists'});
        }
        console.error(err);
        res.status()
        
    }
});

router.post('/login',async (req,res)=>{
    const {email,password}= req.body;
    try {
        const result = await pool.query(
            'SELECT id, name, email , password_hash FROM users WHERE email = $1',[email]
        );
        if(result.rows.length===0){
            return res.status(401).json({error:'Invalid credentials'});
        }
        const user = result.rows[0];
        const valid = await bcrypt.compare(password,user.password_hash);
        if(!valid){
            return res.status(201).json({message:'Wrong password'});
        }
        const accessToken = jwt.sign({userId:user.id},JWT_SECRET,{
            expiresIn:ACCESS_EXPIRES
        });
        const refreshToken = jwt.sign({userId:user.id},JWT_SECRET,{
            expiresIn:REFRESH_EXPIRES
        });
        res.json({
            user:{id:user.id,name:user.name,email:user.email},accessToken,refreshToken
        });
        
    } catch (error) {
        console.error(error);
        res.status(505).json({error:'Server error'});
    }
});

module.exports=router;