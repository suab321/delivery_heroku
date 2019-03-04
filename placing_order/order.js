const router=require('express').Router();
const jwt=require('jsonwebtoken');


const token=require('../jwt/jwt');

const {order}=require('../database/db');


router.use(function check(req,res,next){
    if(req.session.user)
        next();
    else
        res.status(401).json("Session is required to access it");
})

const verify=(req,res,next)=>{
    const token=req.headers['authorization']
    if(token !== undefined){
    req.token=token.split(' ')[1];
    next();
    }
    else{
        res.status(401).json("not authorized");
    }
}


router.post('/place_order',verify,(req,res)=>{
    console.log(req.token);
   const userId=token.decodeToken(req.token).user;
    if(userId)
        console.log(userId);
    else
        res.status(401).json("Not authorised");
})

module.exports={
    order_route:router
}


