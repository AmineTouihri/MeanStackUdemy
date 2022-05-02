const express=require("express");
const route=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/user");
//---------------------------------------------------------------------------------------
route.post("/signup",(req,resp,next)=>{
    bcrypt.hash(req.body.password,10).then(hash=>{
        const user=new User({
            email:req.body.email,
            password:hash
        });
        user.save()
        .then(result=>{resp.status(201).json({
            message:'user added succesfully!',
            result:result
        })
    }).catch(err=>{resp.status(500)
            .json({error:err})})
    })

})
//---------------------------------------------------------------------------------------



route.post("/login",(req,resp,next)=>{
    let fetchedUser;
User.findOne({email:req.body.email}).then(user=>{
    console.log(user);
    fetchedUser=user
    if(!user){
        return resp.status(404).json({message:'user not found'});
    }
    return bcrypt.compare(req.body.password,user.password);
}).then(res=>{
    console.log(res);
    if (!res){
        resp.status(401).json({message:'auth faild'})
    }
    const token=jwt.sign(
        {email:fetchedUser.email,userId:fetchedUser._id},
        "secret_this_should_be_longer",
        {expiresIn:"1h"}
        );
        console.log(token);
        resp.status(201).json({token:token});
}).catch(err=>resp.status(401).json({message:'auth faildsss'}))
})

//---------------------------------------------------------------------------------------

module.exports=route;
