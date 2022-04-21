const jwt=require("jsonwebtoken");

module.exports=(req,resp,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1] ;
        jwt.verify(token,"secret_this_should_be_longer");
        next();

    }catch (error){
        resp.status(401).json({message:"u should be loged in to make changes !"});
    }
}