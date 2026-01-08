const jwt = require('jsonwebtoken');

const JWT_SECRET= process.env.JWT_SECRET;

const auth=(req,res,next)=>{
    const authHeader= req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({error:'Authorization header required'});
    }
    const [scheme,token]=authHeader.split(' ');
    if(scheme!=='Bearer'||!token){
        return res.status(401).json({error:'Use Authorization : Bearer <token>'});
    }
    try {
        const payload = jwt.verify(token,JWT_SECRET);
        req.user={id:payload.userId};
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Invalid or expired token'});
    }
};

module.exports=auth;