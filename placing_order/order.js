const router=require('express').Router();
const jwt=require('jsonwebtoken');

//developer made modules import
const token=require('../jwt/jwt');
const {order,perma}=require('../database/db');


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
    if(userId){
           const db=new order
            db.User_id=req.body.User_id;
            db.Commodity=req.body.Commodity;
            db.Receving_Address=req.body.Receving_Address;
            db.Delivery_Address=req.body.Delivery_Address;
            db.Giver_Name=req.body.Giver_Name;
            db.Giver_Phone=req.body.Giver_Phone;
            db.Recevier_Phone=req.body.Recevier_Phone;
            db.Recevier_Name=req.body.Recevier_Name;
            db.Price=req.body.Price,
            db.Date=new Date();

            db.save().then(user=>{
                perma.findByIdAndUpdate({_id:user.User_id},{$addtoSet:{'History':{"Order_id":user._id}}}).then(user=>{
                    console.log(user);
                }).catch(err=>{
                    res.status(400).json("48"+err);
                })
            }).catch(err=>{
                res.status(400).json("51"+err);
            })
    }
    else
        res.status(401).json("Not authorised");
})

module.exports={
    order_route:router
}


