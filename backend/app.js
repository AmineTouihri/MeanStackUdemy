const express=require("express");
const path=require('path')
const app=express();
const bodyParser=require('body-parser');
const Postroute=require("./modules/routes/posts")
const UserRoute=require("./modules/routes/user")

const mongoose=require("mongoose");
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended:false}))
app.use("/images",express.static(path.join("backend/images")))

mongoose.connect("mongodb+srv://amine:opcAXh6n3jeSgVdb@cluster0.twhiu.mongodb.net/node-angular")
.then(()=>{console.log("connected to mangoDb");}).catch((error)=>{console.log(error)})

app.use((req,resp,next)=>{
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","Origin , X-Requested-With , Content-Type , Accept,authorization");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS")
  next()
})
app.use("/api/posts",Postroute);
app.use("/api/user",UserRoute);
//* *********************************

//* *******************************************************************************************



module.exports=app
