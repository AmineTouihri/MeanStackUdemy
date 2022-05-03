import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { PostModel } from '../shared/post-model';
import { PostsServiceService } from '../shared/posts-service.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
sub!:Subscription
isLoading=false
postss:PostModel[]=[]
postlength=10;
postPerPage=2;
pageSizeOption=[1,2,5,10];
currentPage=1;
isLogedIn=false;

authSubscription!:Subscription;
  constructor(private postsService:PostsServiceService,private authService:AuthService) { }


  ngOnInit(): void {
    this.isLogedIn=this.authService.getUserState();
    this.isLoading=true
    this.postsService.getPosts(this.postPerPage,this.currentPage);
    // this.isLoading=false
    this.sub=this.postsService.getPostUpdateListener().subscribe((posts:PostModel[])=>{this.postss=posts;
      this.isLoading=false;

    })

    this.authSubscription=this.authService.getAuthListener().subscribe(res=>{
      this.isLogedIn=res;
    })
  }
  ngOnDestroy(): void {
      this.sub.unsubscribe();
      this.authSubscription.unsubscribe();
  }
  postDelete(id:string,index:number){
     this.postsService.onDeletee(id,index)
    console.log(id);

  }
  onChangePage(event:PageEvent){
    this.isLoading=true
    this.postPerPage=event.pageSize;
    this.currentPage=event.pageIndex+1;
    const resp=this.postsService.getPosts(this.postPerPage,this.currentPage);
    console.log("resp="+resp);
    

  }
 

}
