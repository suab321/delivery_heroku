const socket=require('socket.io');

const {order,perma}=require('../database/db');
const authentication=require('../authentication/authenticate');

var io;
var connected_socket;

function connection(port){
    io=socket(port);
    io.on('connection',socket=>{
        connected_socket=socket;
        console.log("made a connection");
        connected_socket.on("request",(req)=>{
            //console.log(req)
            io.sockets.emit("new_delivery_request",req);
        });
        connected_socket.on("request_accepted_bydriver",(data)=>{
            console.log("19 socket_fucn"+data);
            console.log(data.data);
            perma.update({_id:data.User_id,'History.Order_id':data._id},
            {$set:{'History.$.CurrentStatus':1}},{new:true},(err,result)=>{
                if(result){
                    console.log("23 socket_fucn"+result);
                }
                else if(err)
                    console.log("26 socket_fucn"+err);
            })
            var unique_no=Math.floor(Math.random()*10000);
            authentication.sendOTP(data.Recevier_Email,unique_no);
        });
    })
}
function emit_order(data){
    io.sockets.emit('new_delivery_request',data);
}

module.exports={
    connection,
    emit_order
}