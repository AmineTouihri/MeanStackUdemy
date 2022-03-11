import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {  Subject } from 'rxjs';
import { PostModel } from './post-model';
import {map}from 'rxjs/operators'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {
  private posts:PostModel[]=[]
  private postsemit=new Subject<PostModel[]>()

  constructor(private http:HttpClient,private router:Router) { }

onUpdatePost(id:string,title:string,content:string,imagePath:File| string){
  let postData:FormData|PostModel;
console.log("id:",title)

  if (typeof(imagePath)==="object"){
    postData=new FormData();
    postData.append("title",title)
    postData.append("_id",id)
    postData.append("content",content)
    postData.append("image",imagePath,title)


  }else{
     postData={
      _id:id,
      title:title,
      content:content,
      imagePath:imagePath
    }

  }

  this.http.put<{message:string,imagePath:string}>('http://localhost:3000/api/posts/'+id,postData)
  .subscribe((response)=>{

    const updatedPosts=[...this.posts];
    const index=updatedPosts.findIndex(po=>po._id===id)
    const post:PostModel={
      _id:id,
      title:title,
      content:content,
      imagePath:response.imagePath
    }


    updatedPosts[index]=post
    this.posts=[...updatedPosts]
    console.log("post",this.posts);
    this.postsemit.next([...this.posts])
    this.router.navigate(['/'])

  })

}

  onAddPost(title:string,content:string,image:File){
    const postData=new FormData();
    postData.append("content",content);
    postData.append("title",title);
    postData.append("image",image);

    this.http.post<{message:string,post:PostModel}>('http://localhost:3000/api/posts',postData).subscribe(
      resonse=>
      {
        console.log(resonse)
        const post:PostModel=
        {
          _id:resonse.post._id,
          title:title,
          content:content,
          imagePath:resonse.post.imagePath
        }


        this.posts.push(post);
        this.postsemit.next([...this.posts]);
        this.router.navigate(['/'])


      },
    )





  }
  getPostUpdateListener(){
    return this.postsemit.asObservable()

  }

  getPosts(postPerPage:number,currentPage:number){
    const queryParams=`?pageSize=${postPerPage}&CurrentPage=${currentPage}`
    this.http.get<{message:string, posts:any}>
    ('http://localhost:3000/api/posts'+queryParams).
    pipe(//zeyda juste 3al fahm nte3ha (_id)
      map((postData)=>{

          return postData.posts.map( (post:any)=> {
          return {
          title:post.title,
          content:post.content,
          _id:post._id,
          imagePath:post.imagePath
                };

      });}
    ))
    .
    subscribe((response)=>{
      this.posts=response
      this.postsemit.next(this.posts)

    })

  }

  getPost(_id:string){
    return this.http.get<{post:PostModel}>("http://localhost:3000/api/posts/"+_id);

    // return {...this.posts.find(post=> post._id===_id)}
  }

  onDeletee(postId:string,index:number){



    this.http.delete("http://localhost:3000/api/posts/"+postId).subscribe(()=>{
    //  this.posts.splice(index,1);

    const updatedPosts=this.posts.filter(post=>

      post._id!==postId
    );
    console.log(updatedPosts);
    this.posts=updatedPosts




    this.postsemit.next(updatedPosts)

    })

  }
}
