const jwt=require('jsonwebtoken');

const verifyTokenProvider=(req,res,next)=>{
    //get baarrer token from req
    let bearerToken=req.headers.authorization;
    
    //if token not present
    if(bearerToken===undefined){
        res.send({message:"Unautherised Req"})
    }
    //if token present
    else{
        const token=bearerToken.split(" ")[1]
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            res.locals.decode=decode
            next()
        }catch(err){
            console.log(err.message)
            res.send({message:err});
        }
    }
    
}
module.exports=verifyTokenProvider;