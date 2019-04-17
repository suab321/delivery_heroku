const router=require('express').Router();

const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";

const stripe=require('stripe')(secretKey);

const {save,cancel_order}=require("../placing_order/order");
const {emit_transaction_complete}=require('../sockets/socket_fucn')



const verify=(req,res,next)=>{
  if(req.headers['authorization'] !== undefined){
    var token=req.headers['authorization'].split(' ')[1];
    req.token=token;
    next();
  }
  else
    res.status(400).json({response:"0"});
}

//route for paying//
router.post('/pay',(req,res)=>{
    console.log(req.body);
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(res=>{
        save(req.body.order_id,res.id);
        console.log("payment was successful")
      }).catch(err=> {
        console.log(err)
        res.json({msg:"Your transaction failed..Try again after sometime"});
      })
})
//route for paying ended

//route for cancelling order//
router.post('/cancel_order',verify,(req,res)=>{
  const charge_id=cancel_order(req.body.Order_id);
  if(charge_id){
    stripe.refunds.create({
      charge:charge_id
    }).then(refund=>{
      console.log(refund);
      return 1;
    }).catch(err=>{
      console.log(err);
      return 0;
    })
  }
  else
    res.status(400).json({response:"2"});
})
//route for cancelling order ended//
  

module.exports={
    payment_route:router,
}