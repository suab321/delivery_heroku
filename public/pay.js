


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
           fetch('/successful_payment',{
               method:"GET",
               headers:{
                   "Content-Type":"application/json",
                   "Accept":"application/json"
               }
           })
        }).then(data=>{
            fetch('/successful_payment',{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                }
            })
        })
    }

})


console.log("yes");
console.log(charge*weight);
stripeHandler.open({
    amount
})
