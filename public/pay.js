


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
                order:order,
                amount:amount
            })
        }).then(res=>{
            console.log("success");
        })
    }

})


console.log("yes");
console.log(charge*weight);
stripeHandler.open({
    amount
})
