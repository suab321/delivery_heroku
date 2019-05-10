


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
        if(res.data.code)
           window.location.replace('/successful_payment');
        else
            window.location.replace('/unsuccessful_payment')
        }).catch(err=>{
            console.log("error in payment")
            window.location.replace('/unsuccessful_payment')
        })
    }

})


console.log("yes");
console.log(charge*weight);
stripeHandler.open({
    amount
})
