const jwt=require('jsonwebtoken');


module.exports={
    generateToken,
    decodeToken
}

function generateToken(data){
    console.log(data);
    return (jwt.sign({user:data},"suab"));
}

function decodeToken(token){
    try{
        const authdata=jwt.verify(token,"suab");
        return authdata;
    } catch(err){
        return 0;
    }
}
