//module imports
const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const {temp,perma,order,temp_order}=require('../database/db');
const {local_link}=require('../urls/links');
const nodemailer=require('nodemailer');
const ejs=require('ejs');

//developer made function import
const token=require('../jwt/jwt');




//middleware to extract token from req headers
const get_token=(req,res,next)=>{
    const token=req.headers.authorization;
    if(token !== undefined){
        req.token=token.split(' ')[1];
        next();
    }
    else
        res.status(401).json({err:"0"});
}

const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
    type:"OAuth2",
    user:"stowawaysuab123@gmail.com",
    clientId:"197901312379-he0vh5jq4r76if10ahv30ag8ged6f0in.apps.googleusercontent.com",
    clientSecret:"bdZnQ154LMlm-cNxsDVj0NF-",
    refreshToken:"1/XXO2jO_xcSG-TFTc3cToXvC5DlSVJr9mgqE4KroSbms"
    }
})


//services outside this authentication
const sendOTP=(email,number,who)=>{
    if(who){
    const mailoption={
        from:"stowawaysuab123@gmail.com",
        to:email,
        subject:"Stowaway:Start your trip with this OTP",
        html:`<p>Dear Customar</p><br><p>Thank you for orddering from Stowaway This is the OTP you would share with your driver to start the Trip <h3>${number}</h3> *Do not share the OTP with anyone</p>`
    }
    transporter.sendMail(mailoption,(err,res)=>{
        if(err)
            console.log(err);
        else
            console.log(res);
    })
  }
  else{
    const mailoption={
        from:"stowawaysuab123@gmail.com",
        to:email,
        subject:"Stowaway:Recevie your package with this OTP",
        html:`<p>Dear Customar</p><br><p>Thank you for orddering from Stowaway This is the OTP you would share with your service provider when they come to deliver the package to deliver the package.Without this OTP you wouldn't be able to complete the delvery.<h3>${number}</h3>*Do not share the OTP with anyone</p>`
    }
    transporter.sendMail(mailoption,(err,res)=>{
        if(err)
            console.log(err);
        else
            console.log(res);
    })
  }
}


//verification link after registration
const verfiy=(email,token)=>{
    const mailoption={
        from:"stowawaysuab123@gmail.com",
        to:email,
        subject:"Activate your Stowaway Account by verifying this link",
        text:"Click the below link for verification",
        html:'<p>To activate your Stowaway account,please click on the following link or copy and paste the url into your browser window:<a href="https://floating-brushlands-52313.herokuapp.com/authentication/verification/'+token+'">'+token+'</a> After you activate your account,you will be able to access your account in the Stowaway Application and enjoy the experience first hand!</p>'
    }

    transporter.sendMail(mailoption,(err,res)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(res);
        }
    })
}

//verification link sending for resetting password
const resetpass=(email,token)=>{
    const mailoption={
        from:'test29051571833@gmail.com',
        to:email,
        subject:"Reset your Stowaway account password by verifying this link",
        text:"Click the link for restting password",
        html:'<p>To reset your Stowaway Account please click on the following link or copy and paste the URL into yourbrowser window <a href="https://floating-brushlands-52313.herokuapp.com/authentication/reseting/'+token+'">'+token+'</a> After you change the accounts password you will be able to change your password and log in to your account</p>'
    }

    transporter.sendMail(mailoption,(err,res)=>{
        if(err)
            console.log(err)
        else
            console.log(res)
    })
}



//registering user route
router.post('/register',(req,res)=>{
    perma.findOne({Email:req.body.Email}).then(user=>{
        if(user){
        res.status(200).json({response:"1"});
        }
        else{
        const db=new temp
        db.device_id=req.body.device_id
        db.Name=req.body.Name
        db.Password=req.body.Password
        db.MobileNo=req.body.MobileNo
        db.Email=req.body.Email
        db.IMEI=req.body.IMEI
        db.Flag=0
        db.Date=new Date()
        db.response="0"
        db.save().then(user=>{
            if(user){
                    const enc=token.generateToken(user.Email);
                    verfiy(user.Email,enc);
                    res.status(200).json({response:"0"});
            }
        }).catch(err=>{
        res.status(200).json({response:"1"});  
    })
        }
    }).catch(err=>{
        console.log(err);
        const db=new temp
        db.device_id=req.body.device_id
        db.Name=req.body.Name
        db.Password=req.body.Password
        db.MobileNo=req.body.MobileNo
        db.Email=req.body.Email
        db.IMEI=req.body.IMEI
        db.Flag=0
        db.Date=new Date()
        db.response="0"
        db.save().then(user=>{
            if(user){
                jwt.sign({user:user.Email},"suab",(err,token)=>{
                    verfiy(user.Email,token);
                    res.status(200).json({response:"0"});
                })
            }
        }).catch(err=>{
        res.status(200).json({response:"1"});  
    })
    })
})

//verifying when user clicks on link on gmail
router.get('/verification/:token',(req,res)=>{
        console.log("yes");
        const authdata=token.decodeToken(req.params.token);
        if(!authdata){
            res.status(401).json("Not authorised to acces this link");
        }
         perma.findOne({Email:authdata.user}).then(user=>{
            if(user)
                res.status(200).json({response:"1"})
            else{
                temp.findOneAndDelete({Email:authdata.user}).then(user=>{
                    const db=new perma
                    console.log("64"+user.IMEI)
                    db.device_id=user.device_id
                    db.Name=user.Name
                    db.Password=user.Password
                    db.MobileNo=user.MobileNo
                    db.Email=user.Email
                    db.IMEI=user.IMEI
                    db.Flag=user.Flag
                    db.Date=new Date()
                    db.response="1"
                    db.save().then(user=>{
                        res.render('verified',{name:user.Name});
                    })
                })
            }
        }).catch(err=>{res.status(200).json({response:"2"})})
})

//logging in user
router.post('/login',(req,res)=>{
    perma.findOne({Email:req.body.Email}).then(user=>{
        if(req.body.Password === user.Password)
            {
                perma.findById({_id:user.id},{Password:false}).then(user=>{
                    req.session.user=user._id;
                    const enct=token.generateToken(user._id);
                   res.status(200).json({key:enct,response:"1"});
                   perma.findByIdAndUpdate({_id:user._id},{device_id:req.body.device_id}).then(user=>{}).catch(err=>{console.log(err)});
                })
            }
        else
            res.status(400).json({response:"2"});
    }).catch(err=>{
    temp.findOne({Email:req.body.Email}).then(user=>{
        if(user){
            res.status(400).json({response:"3"})
        }
        else{
            res.status(400).json({response:"4"});
        }
    }).catch(err=>{
        res.status(400).json({response:"4"})
    })
})
})
//logging in usersroute ended

//updating users profile
router.post('/update/:what/:value',get_token,(req,res)=>{
    const user_id=token.decodeToken(req.token).user;
    if(user_id){
        switch(req.params.what){
            case 1:
            perma.findByIdAndUpdate({_id:user_id},{Name:req.params.value},{new:true}).then(user=>{
                res.status(200).res({response:"1"});
            }).catch(err=>{
                res.status(400).json({response:"2"});
            })
                break;
            case 2:
            perma.findByIdAndUpdate({_id:user_id},{MobileNo:req.params.value},{new:true}).then(user=>{
                res.status(200).res({response:"1"});
            }).catch(err=>{
                res.status(400).json({response:"2"});
            })
                break;
        }
    }
})
//updating users profile ended


//reseting password email sending
router.get('/resetpass/:email',(req,res)=>{
    //console.log("209 authenticate.js"+req.params.email);
    perma.findOne({Email:req.params.email}).then(user=>{
        console.log(user);
        if(user){
            jwt.sign({user:user.Email},"suab",(err,token)=>{
                resetpass(user.Email,token);
                res.status(200).json({response:"1"});
            })
        }
        else{
            res.status(200).json({response:"4"});
        }
    }).catch(err=>{
        console.log(err);
        res.status(200).json({response:"4"});
    })
})
//route email sending ended


//link for new password req coming here from frontend ejs
router.post('/ressetingdone/:token',(req,res)=>{
    jwt.verify(req.params.token,"suab",(err,authdata)=>{
        perma.findOneAndUpdate({Email:authdata.user},{Password:req.body.password},{new:true}).then(user=>{
            res.status(200).json({msg:"1"});
        }).catch(err=>{res.send(req.params.email)})
    })
})

//new password frontend after clicking on link on gmail
router.get('/reseting/:token',(req,res)=>{
    res.render('pass',{email:req.params.token})
})

//loggingOut from mongo session
router.get('/logout',(req,res)=>{
    if(req.session.user && req.cookies.user_sid){
        res.clearCookie('user_sid').json({res:"1"});
    }
    else
        res.status(401).json({err:"0"})
})


//getting_users data based on token recevied in request
router.get('/user_details',get_token,(req,res)=>{
    const user_id=token.decodeToken(req.token).user
    if(user_id){
        perma.findById({_id:user_id},{Password:false}).then(user=>{
            if(user)
                res.status(200).json(user);
            else
                res.status(200).json({err:"0"});
        }).catch(err=>{
            res.status(400).json({err:"0"});
        })
    }
    else
        res.status(401).json({err:"0"});
})

//getting user's  permanant order history//
router.get('/order_history',get_token,(req,res)=>{
    const user_id=token.decodeToken(req.token).user;
    if(user_id){
        var perma_orders=[];
        var temp_orders=[];
        order.find({User_id:user_id}).then(user=>{
            perma_orders=user;
        temp_order.find({User_id:user_id}).then(user=>{
            temp_orders=user;
            var orders=perma_orders.concat(temp_orders);
            res.status(200).json(orders);
        })
        }).catch(err=>{res.status(400).json({err:"1"})});
    }
    else
        res.status(401).json({err:"2"});
})
//getting order history route ended//


//route for getting temporary orders//
router.get('/temp_order_history',get_token,(req,res)=>{
    const user_id=token.decodeToken(req.token).user;
    if(user_id){
        temp_order.find({User_id:user_id}).then(user=>{
            res.status(200).json(user);
        }).catch(err=>{res.status(400).json({err:"1"})})
    }
    else
        res.status(400).json({err:"2"});
})
//route for getting temporary orders ended//




//updating order status when it is completed
router.get("/order_status_update/:Order_id/:status",(req,res)=>{
    order.findByIdAndUpdate({_id:req.params.Order_id},{CurrentStatus:req.params.status}).then(user=>{
        if(user)
            res.status(200).json("Updated");
    }).catch(err=>{
        res.status(400).json(err);
    })
})

//route to get orders which are not accepted by driver//
router.get('/pending_order',(req,res)=>{
    order.find({CurrentStatus:0}).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        console.log(err);
    })
})
//route ended//

//route to get query paramneter result//
router.get('/get_order_parameter',get_token,(req,res)=>{
    const userId=token.decodeToken(req.token).user;
    if(userId){
    perma.findById({_id:userId}).then(user=>{
        res.status(200).json({height:req.query.height,weight:req.query.weight,length:req.query.length,width:req.query.width});
    }).catch(err=>{
        res.status(400).json({msg:"You are not a valid user",reponse:"1"});
    })
}
else
    res.status(400).json({msg:"You are not authenticated",response:"2"});
})
//route ended//

//route to get user_details when _id is given//
router.post('/get_user',(req,res)=>{
    perma.findById({_id:req.body.id}).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        console.log(err);
    })
})
//route ended///


module.exports={
    auth_route:router,
    sendOTP
}