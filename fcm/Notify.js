var FCM=require('fcm-push');
var serverkey="AIzaSyCgJqVv7yZ97gcOoADX8uaCTFEeuiqbK2Y";
var fcm = new FCM(serverkey);

function notify(users){
    console.log(users)
    var message={
        to:"device_id",
        collapse_key:"e1wOospPHEU:APA91bGBJ99mYTkpWwDRPsiyEojSZVyASyw_MI-zygf9N-A5_EIbp-W9zlu-iFubosWmhvvUZrLiBwzFUU69PANhDja7j8zUZ1XK5mwe17R-Gd3b4Ah4Q01izyPd698NFicG7izIdJXG",
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