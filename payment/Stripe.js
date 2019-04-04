const router=require('express').Router();

const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";

const stripe=require('stripe')(secretKey);


router.get('/pay_for_service',(req,res)=>{
    res.render('payment',{order:{name:"abhinav",age:"23",weight:"12"},charge:"23",stripePublicKey:publicKey})
})

router.post('/pay',(req,res)=>{
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.stripeTokenId,
        currency: 'INR'
      }).then(function() {
        console.log('Charge Successful')
        res.json({ message: 'Successfully purchased items' })
      }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
      })
})

module.exports={
    payment_route:router
}