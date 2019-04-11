var FCM=require('fcm-push');
var serverkey="AIzaSyCgJqVv7yZ97gcOoADX8uaCTFEeuiqbK2Y";
var fcm = new FCM(serverkey);

const axios=require('axios');

function notify(order){

    axios.get(`https://fast-reef-53121.herokuapp.com/authentication/get_driver`).then(res=>{
        if(res.status === 200){
            console.log(res.data)
            var users=res.data;
            users.map(i=>{
                var message={
                    to:i.device_id,
                    notification:{
                        title:"Stowaway",
                        body:`name is ${order.Giver_Name} Pickup-Address is ${order.Receving_Address} Delivery-Address is ${Delivery_Address}`
                    }
                }
                fcm.send(message,(err,response)=>{
                    if(err)
                        console.log(err);
                    else
                        console.log(response);
                })
            })
        }
    }).catch(err=>{console.log(err)});
}

module.exports={
    notify
}