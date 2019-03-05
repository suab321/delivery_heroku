const socket=require('socket.io');


function connection(port){
    //console.log(port);
    var io=socket(port);
    io.on('connection',socket=>{
        console.log("made a connection");
        socket.on("request",(req)=>{
            console.log(req)
            io.sockets.emit("request_from_user",req);
        });
        socket.on("request_accepted_driver",(data)=>console.log(data));
    })
}

module.exports={
    connection
}