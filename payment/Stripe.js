const router=require('express').Router();

const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";

const stripe=require('stripe')(secretKey);


const {save,Refund}=require('../placing_order/order');
const {emit_transaction_complete}=require('../sockets/socket_fucn')


router.post('/pay',(req,res)=>{
    console.log(req.body);
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(res=>{
        console.log("payment successful");
        save(req.body.order_id,res.id);
        //res.json({msg:"Payment was successful"});
      }).catch(err=> {
        console.log(err)
        res.json({msg:"Your transaction failed..Try again after sometime"});
      })
})

function refund(charge_id){
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

module.exports={
    payment_route:router,
    refund
}