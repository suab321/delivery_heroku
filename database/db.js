
//modules imports
const mongoose=require('mongoose');



const mongourl="mongodb://suab:Suab123@cluster0-shard-00-00-ynffd.mongodb.net:27017,cluster0-shard-00-01-ynffd.mongodb.net:27017,cluster0-shard-00-02-ynffd.mongodb.net:27017/delivery_user?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(mongourl,{useNewUrlParser:true},(err,db)=>{
    if(err)
        console.log("db.js 11"+err);
    else
       console.log("database connected");
})

const temp_Order_Schema=new mongoose.Schema({
    User_id:String,
    Driver_id:String,
    Commodity:String,
    Receving_Address:String,
    Delivery_Address:String,
    Giver_Name:String,
    Giver_Phone:String,
    Recevier_Phone:String,
    Recevier_Name:String,
    Receving_Email:String,
    Price:String,
    Date:String
})

const perma_Order_Schema=new mongoose.Schema({
    User_id:String,
    Driver_id:String,
    Commodity:String,
    Receving_Address:String,
    Delivery_Address:String,
    Giver_Name:String,
    Giver_Phone:String,
    Recevier_Phone:String,
    Recevier_Name:String,
    Receving_Email:String,
    Price:String,
    Date:String
})

const temp_schema=new mongoose.Schema({
    device_id:String,
    Name:String,
    Password:String,
    MobileNo:{type:String},
    Email:{type:String,unique:true},
    IMEI:{type:String},
    Flag:{type:Number,default:0},
    Date:{type:Date},
    response:{type:String},
})
const perma_schema=new mongoose.Schema({
    device_id:String,
    Name:String,
    Password:String,
    MobileNo:{type:String},
    Email:{type:String,unique:true},
    IMEI:{type:String},
    Flag:{type:Number,default:0},
    Date:{type:Date},
    response:{type:String},
    My_Address:[{Place_Type:String,Value:[{value:String}]}],
    Delivery_Address:[{Value:String}],
    temp_History:[{Order_id:String}],
    perma_History:[{Order_id:String}]
})

const temp_model=mongoose.model('temp',temp_schema);
const perma_model=mongoose.model('perma',perma_schema);
const temp_order_model=mongoose.model('temp_order',temp_Order_Schema);
const perma_order_model=mongoose.model('perma_model',perma_Order_Schema);


module.exports={
    temp:temp_model,
    perma:perma_model,
    temp_order:temp_order_model,
    perma_order:perma_order_model,
    mongourl
}
