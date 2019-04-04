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
            perma.update({_id:data.data.User_id,'History.Order_id':data.data._id},
            {$set:{'History.$.CurrentStatus':1}},{new:true},(err,result)=>{
                if(result){
                    order.findByIdAndUpdate({_id:data.data._id},{CurrentStatus:1}).then(user=>{
                    }).catch(err=>console.log("26 socket_fucn"+err))
                }
                else if(err)
                    console.log("26 socket_fucn"+err);
            })
            authentication.sendOTP(data.data.Recevier_Email,data.recevier_unique);
            authentication.sendOTP(data.data.Giver_Email,data.sender_unique);
        });
        
        connected_socket.on("user_from_user_frontend",data=>{
            io.sockets.emit("user_to_driver_frontend",data);
        })
    })
}
function emit_order(data){
    io.sockets.emit('new_delivery_request',data);
}

module.exports={
    connection,
    emit_order
}