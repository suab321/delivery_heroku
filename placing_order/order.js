const router=require('express').Router();
const jwt=require('jsonwebtoken');

//developer made modules import
const token=require('../jwt/jwt');
const {order,perma,temp_order}=require('../database/db');
const sockets=require('../sockets/socket_fucn');
const {notify}=require('../fcm/Notify');


router.use(function check(req,res,next){
   next();
})

const verify=(req,res,next)=>{
    const token=req.headers['authorization']
    if(token !== undefined){
    req.token=token.split(' ')[1];
    next();
    }
    else{
        res.status(401).json({err:"1"});
    }
}

//route for temp order
router.post('/temp_place_order',verify,(req,res)=>{
    console.log(req.token);
    const userId=token.decodeToken(req.token).user;
    console.log(userId);
     if(userId){
            const db=new temp_order
             db.User_id=userId;
             db.Commodity=req.body.Commodity;
             db.Receving_Address=req.body.Receving_Address;
             db.Delivery_Address=req.body.Delivery_Address;
             db.Giver_Name=req.body.Giver_Name;
             db.Giver_Email=req.body.Giver_Email;
             db.Giver_Phone=req.body.Giver_Phone;
             db.Recevier_Phone=req.body.Recevier_Phone;
             db.Recevier_Name=req.body.Recevier_Name;
             db.Recevier_Email=req.body.Recevier_Email;
             db.Price=req.body.Price;
             db.Weight=req.body.Weight;
             db.Date=new Date();
             db.Preferred_time=req.body.time;
             db.save().then(user=>{
                res.redirect(`pay_for_service1?weight=${user.Weight}&order_id=${user._id}`);
             }).catch(err=>{
                 console.log("order.js 55 "+err);
             })
     }
     else
         res.status(401).json({err:"2"});
 })
////route ended//////




//route for permanant order route
router.post('/place_order',verify,(req,res)=>{
   console.log(req.token);
   const userId=token.decodeToken(req.token).user;
   console.log(userId);
    if(userId){
           const db=new order
            db.User_id=userId;
            db.Commodity=req.body.Commodity;
            db.Receving_Address=req.body.Receving_Address;
            db.Delivery_Address=req.body.Delivery_Address;
            db.Giver_Name=req.body.Giver_Name;
            db.Giver_Email=req.body.Giver_Email;
            db.Giver_Phone=req.body.Giver_Phone;
            db.Recevier_Phone=req.body.Recevier_Phone;
            db.Recevier_Name=req.body.Recevier_Name;
            db.Recevier_Email=req.body.Recevier_Email;
            db.Price=req.body.Price;
            db.Weight=req.body.Weight;
            db.Date=new Date();
            db.Preferred_time=req.body.time;
            db.save().then(user=>{
                perma.findByIdAndUpdate({_id:userId},{$addToSet:{'History':{"Order_id":user._id}}}).then(res1=>{
                    notify(user);
                    sockets.emit_order(user);
                    console.log(user);
                }).catch(err=>{
                    console.log("order.js 52 "+err);
                })
            }).catch(err=>{
                console.log("order.js 55 "+err);
            })
    }
    else
        res.status(401).json({err:"2"});
})
//// route ended ////


module.exports={
    order_route:router,
    //new_order
}


