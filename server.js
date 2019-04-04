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

//importing from developer made folder
const {auth_route}=require('./authentication/authenticate');
const {order_route}=require('./placing_order/order');
const sckt=require('./sockets/socket_fucn');
const {payment_route}=require('./payment/Stripe');
const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";


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
app.use(express.static('public'));
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
app.use('/payment',payment_route);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/test.html');
})


app.get('/pay_for_service',(req,res)=>{
    res.render('payment',{order:{name:"abhinav",age:"23",weight:"12"},charge:"23",stripePublicKey:publicKey})
})


const port_connection=app.listen(process.env.PORT || 3002);
sckt.connection(port_connection);



