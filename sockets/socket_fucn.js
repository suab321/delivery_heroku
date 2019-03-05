const socket=require('socket.io');

var io;
var connected_socket;
function connection(port){
    //console.log(port);
    var io=socket(port);
    io.on('connection',socket=>{
        connected_socket=socket;
        console.log("made a connection");
        connected_socket.on("request",(req)=>{
            console.log(req)
            io.sockets.emit("request_from_user",req);
        });
        connected_socket.on("request_accepted_driver",(data)=>console.log(data));
    })
}
function emit_order(data){
    connected_socket.emit('new_delivery_request',(data));
}

module.exports={
    connection,
    emit_order
}