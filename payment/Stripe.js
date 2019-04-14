const router=require('express').Router();

const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";

const stripe=require('stripe')(secretKey);


const {save}=require('../placing_order/order');
const {emit_transaction_complete}=require('../sockets/socket_fucn')


router.post('/pay',(req,res)=>{
    console.log(req.body);
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(res=>{
        save(req.body.order_id,res.id);
        //console.log(res.id)
        //console.log(res);
        res.json({msg:"Payment was successful"});
      }).catch(err=> {
        console.log('Charge Fail')
        res.json({msg:"Your transaction failed..Try again after sometime"});
      })
})

router.get('/refund/:charge_id',(req,res)=>{
  stripe.refunds.create({
    charge:req.params.charge_id
  }).then(refund=>{
    console.log(refund)
    res.status(200).json({response:"1"});
  }).catch(err=>{
    console.log(err);
    res.status(400).json({response:"0"});    
  })
})

module.exports={
    payment_route:router
}