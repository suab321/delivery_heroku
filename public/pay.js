


var stripeHandler=StripeCheckout.configure({
    key:stripekey,
    locale:"en",
    token:function(token){
        fetch('/payment/pay',{
            method:'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body:JSON.stringify({
                stripeTokenId:token.id,
                order_id:order_id,
                amount:amount
            })
        }).then(res=>{
            return res.json({response:1});
        }).then(data=>{
           alert("order is completed");
        })
    }

})


console.log("yes");
console.log(charge*weight);
stripeHandler.open({
    amount
})
