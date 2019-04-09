const router=require('express').Router();

const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";

const stripe=require('stripe')(secretKey);


const {new_order}=require('../placing_order/order');



router.post('/pay',(req,res)=>{
    console.log(req.body);
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(function() {
        //new_order(req.body.order);
        res.json({response:1});
      }).catch(function() {
        console.log('Charge Fail')
        res.send("Your transaction failed..Try again after sometime");
      })
})

module.exports={
    payment_route:router
}