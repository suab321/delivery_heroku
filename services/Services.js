const router=require('express').Router();

//importing other things from other folders///
const {perma,temp_order,order,temp,price}=require('../database/db');
const {charge_detail}=require('../payment/Stripe')
//ended///

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


//route to get all charges//
router.get('/get_chargeId',(req,res)=>{
    price.find({}).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        console.log(err);
    })
})
//route ended///

//route to get details about charge//
router.post('/get_charge_detail',(req,res)=>{
    const detail=charge_detail(req.body.Charge_id);
    if(detail)
        res.status(200).json(detail);
    else
        res.status(400).json({msg:"error fetching details",response:"1"});
})
//route ended///

//route to get charge details

module.exports={
    service_route:router
}