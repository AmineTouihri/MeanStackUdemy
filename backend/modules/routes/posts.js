const express=require("express");
const route=express.Router();
const Post=require('../post');
const multer=require('multer');
const MimeType=
{
  "image/png":"png",
  "image/jpeg":"jpg",
  "image/jpg":"jpg"
}


const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const isValid=MimeType[file.mimetype]
     error=new Error('invalid image');
    if (isValid){error=null}

    cb(error,"backend/images")
  },
  filename:(req,file,cb)=>{
     const ext=MimeType[file.mimetype];
     const name=file.originalname.toLowerCase().split(' ').join('-');
     cb(null,name+'-'+Date.now()+'.'+ext)

  }
})



route.post('',multer({storage:storage}).single("image"),(req,resp,next)=>{
  const url=req.protocol+"://"+req.get("host");
  const post=new Post(
    {
      title:req.body.title,
      content:req.body.content,
      imagePath:url+"/images/"+req.file.filename
    }
  );
   post.save().then( createdPost=>{
     resp.status(201).json({message:"successfuly",post:{...createdPost}})
     }



   )});
   //* ***************Get one************************************************************


      route.get("/:id",(req,resp,next)=>{
        Post.findById(req.params.id).then(
          post=>{
            if (post){
              resp.status(201).json({post:post})
            }else{
              console.log("post not found");
              resp.status(404).json({message:"post not found"})
            }
          }
        )
      })


    //* ******************************Update One******************************************

route.put('/:id',multer({storage:storage}).single("image"),(req,res,next)=>{
  let imagePath=req.body.imagePath
  if (req.file){
    const url=req.protocol+"://"+req.get("host");
    imagePath=url+"/images/"+req.file.filename
  }

  const post=new Post({
    _id:req.body._id,
    title:req.body.title,
    content:req.body.title,
    imagePath:imagePath
  });
  Post.updateOne({_id:req.params.id},post)
  .then(
    resp=>
    {console.log(resp);
      res.status(200).json({message:"update successful!",imagePath:imagePath})})
})

//* ******************************************Get All***********************************************


route.get("",(req,resp,next)=>{
  const pageSize =+req.query.pageSize;
  const CurrentPage=+req.query.CurrentPage;
  const postQuery=Post.find();
  if (pageSize && CurrentPage){
    postQuery.skip(pageSize*(CurrentPage-1)).limit(pageSize)
  }

  postQuery.then(
    documents=>{console.log(documents)
      resp.status(200).json({
        message:"response sent succesfully!",
        posts:documents
      })
      ;}

    ).catch(error=>{console.log(error);});})

//* ********************************************Delete**********************************************

route.delete("/:id",(req,resp,next)=>{
  Post.deleteOne({_id:req.params.id}).then(response=>console.log(response)).catch(err=>{console.log(err);})
  resp.status(200).json({message:"deleted"})

})
module.exports=route;
