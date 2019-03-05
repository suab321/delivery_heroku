const socket=require('socket.io');

const {perma_order,temp_order,perma}=require('../database/db');

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
            console.log(data);
            perma.findById({_id:data.User_id},{$pull:{'temp_History':{'Order_id':data._id}}},{$addToSet:{'perma_History':{'Order_id':data._id}}},{new:true}).then(user=>{
                temp_order.findByIdAndDelete({_id:data._id}).then(user=>{
                    const db=new perma_order
                    db.User_id=user.User_id;
                    db.Commodity=user.Commodity;
                    db.Receving_Address=user.Receving_Address;
                    db.Delivery_Address=user.Delivery_Address;
                    db.Giver_Name=user.Giver_Name;
                    db.Giver_Phone=user.Giver_Phone;
                    db.Recevier_Phone=user.Recevier_Phone;
                    db.Recevier_Name=user.Recevier_Name;
                    db.Recevier_Email=user.Recevier_Email;
                    db.Price=req.body.Price,
                    db.Date=new Date();
                    db.save().then(user=>{
                        console.log(user);
                    }).catch(err=>{console.log(err)});
                })
            })
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