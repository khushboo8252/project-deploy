const jwt = require("jsonwebtoken");

const auth = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token)
    if(token){
        jwt.verify(token,'masai',function(err,decoded){
            if(err){
                res.send("token is wrong or expired")
            }else{
                console.log("middleware",decoded,req.body);
                req.body.userID=decoded.userID
                req.body.user = decoded.user
                next()
            }
          
        });
    }else{
       res.send({"msg":"please login, token is missing"})
    }
}


module.exports={
    auth
}
