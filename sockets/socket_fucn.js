const socket=require('socket.io');

const {order,perma}=require('../database/db');
const authentication=require('../authentication/authenticate');
const router=require('express').Router();

var io;
var connected_socket;
var users=[{user_id:"",socket_id:""}];
function connection(port){
    // users=[{users_id:"",socket_id:""}];
    io=socket(port);
    io.on('connection',socket=>{
        connected_socket=socket;
        console.log("made a connection");
        connected_socket.on("request",(req)=>{
            //console.log(req)
            io.sockets.emit("new_delivery_request",req);
        });
        connected_socket.on("new_join",function(data){
            var new_user={user:data.user_id,socket_id:connected_socket.id};
            users.push(new_user);
        });
        connected_socket.on("disconnect",function(){
            var new_user=users.filter(i=>{
                if(i.socket_id !== connected_socket.id)
                    return i;
            });
            console.log(new_user);
            users=new_user;
            console.log(users);
        })
        connected_socket.on("request_accepted_bydriver",(data)=>{
            console.log("19 socket_fucn"+data);
            console.log(data);
            perma.update({_id:data.User_id,'History.Order_id':data._id},
            {$set:{'History.$.CurrentStatus':1}},{new:true},(err,result)=>{
                if(result){
                    order.findByIdAndUpdate({_id:data.Order_id},{CurrentStatus:1,Driver_id:data.Driver_id,Giver_Otp:data.sender_unique,Recevier_Otp:data.recevier_unique}).then(user=>{
                    }).catch(err=>console.log("26 socket_fucn"+err))
                }
                else if(err)
                    console.log("26 socket_fucn"+err);
            })
            authentication.sendOTP(data.Recevier_Email,data.recevier_unique);
            authentication.sendOTP(data.Giver_Email,data.sender_unique);
        });
        
        connected_socket.on("user_from_user_frontend",data=>{
            io.sockets.emit("user_to_driver_frontend",data);
        })
    })
}
function emit_order(data){
    io.sockets.emit('new_delivery_request',data);
}

router.get('/connected_users_list',(req,res)=>{
    res.status(200).json(users);
})



module.exports={
    connection,
    emit_order,
    socket_route:router
}