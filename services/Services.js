const router=require('express').Router();

//importing other things from other folders///
const {perma,temp_order,price,order,temp}=require('../database/db');

//route to get unpaid orders///
router.get('/get_pending_orders',(req,res)=>{
    temp_order.find().then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route to get unpaid orders ended///

//route to get all users//
router.get('/get_users',(req,res)=>{
    perma.find({}).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route ended///

//route to unverified users///
router.get('/get_pending_users',(req,res)=>{
    temp.find({}).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route ended///

//route to get placed Order list//
router.get('/get_orders',(req,res)=>{
    order.find({}).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route ended///

module.exports={
    service_route:router
}