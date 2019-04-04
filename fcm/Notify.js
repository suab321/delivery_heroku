var FCM=require('fcm-push');
var serverkey=process.env.SERVER_KEY;
var fcm = new FCM(serverkey);

function notify(users){
    console.log(users)
    console.log(process.env.SERVER_KEY)
    var message={
        to:"device_id",
        collapse_key:process.env.COLLAPSE_KEY,
        notification:{
            title:"Title of notification",
            body:"Body of notification"
        }
    }
    fcm.send(message,(err,response)=>{
        if(err)
            console.log(err);
        else
            console.log(response);
    })
}

module.exports={
    notify
}