//importing npm modules
    require('dotenv').config();

const express=require('express');
const bodyparser=require('body-parser');
const app=express();
const session=require('express-session');
const mongoose=require('mongoose');
const MongoStore=require('connect-mongo')(session);
const {mongourl}=require('./database/db');
const cookieparser=require('cookie-parser');
const cors=require('cors');
const axios=require('axios');

console.log(process.env.KEY)
//importing from developer made folder
const {auth_route}=require('./authentication/authenticate');
const {order_route}=require('./placing_order/order');
const sckt=require('./sockets/socket_fucn');
const {notify}=require('./fcm/Notify');
const {driver_backend}=require('./urls/links');

//mongoose connection
mongoose.connect(mongourl,{useNewUrlParser:true},(err,db)=>{
    if(err)
        console.log("server.js 15"+err);
})
//middlewares
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.set('view engine','ejs');
app.use(express.static('views'));
app.use(session({
    key:"user_sid",
    secret:"suab",
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({
        mongooseConnection:mongoose.connection
    }),
    cookie:{maxAge:null}
}))
app.use(cookieparser());


app.use('/authentication',auth_route);
app.use('/order',order_route);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/test.html');
})
app.get('/noti',(req,res)=>{
    // console.log(req)
    axios.get(`http://localhost:3003/authentication/get_driver`).then(res=>{
        if(res.status === 200)
            notify(res.data);
    }).catch(err=>{res.json(err)});
})


const port_connection=app.listen(process.env.PORT || 3002);
sckt.connection(port_connection);



