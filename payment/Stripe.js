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
      }).then(function(res) {
        save(req.body.order_id);
        console.log(res);
      }).catch(function() {
        console.log('Charge Fail')
        res.send("Your transaction failed..Try again after sometime");
      })
})

module.exports={
    payment_route:router
}