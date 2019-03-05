const socket=require('socket.io');

const {}=require('../database/db');

var io;
var connected_socket;
function connection(port){
    //console.log(port);
    io=socket(port);
    io.on('connection',socket=>{
        connected_socket=socket;
        console.log("made a connection");
        connected_socket.on("request",(req)=>{
            console.log(req)
            io.sockets.emit("new_delivery_request",req);
        });
        connected_socket.on("request_accepted_bydriver",(data)=>{

        });
    })
}
function emit_order(data){
    console.log(data);
    io.sockets.emit('new_delivery_request',data);
}

module.exports={
    connection,
    emit_order
}