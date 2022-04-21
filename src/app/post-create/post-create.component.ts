import { Component, OnInit } from '@angular/core';
import { AbstractControlDirective, FormControl, FormGroup, NgForm, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostModel } from '../shared/post-model';

import { PostsServiceService } from '../shared/posts-service.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode="create"
  form!:FormGroup
  private postId!:string|null;
  public post!:PostModel;
  isLoading=false
  imagePreview!:string

  constructor(private postService:PostsServiceService,private ActiviteRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.form=new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
    })

    this.ActiviteRoute.paramMap.subscribe((parmaMap:ParamMap)=>{
      if (parmaMap.has("postId")){
        this.isLoading=true;
        this.mode="edit";
        this.postId=<string>parmaMap.get('postId');

        this.postService.getPost(this.postId).subscribe((postData)=>{this.post=postData.post;
        this.form.setValue({

          title:postData.post.title,
          content:postData.post.content,
          image:postData.post.imagePath
        })
      })
        this.isLoading=false


      }else{

        this.mode="create";
        this.postId=null;

      }
    })


  }

  onPickImage(event:Event)
  {
    const file= (event.target as HTMLInputElement).files![0]
    this.form.patchValue({image:file})
    this.form.get('image')?.updateValueAndValidity()
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=()=>
    {
      this.imagePreview=<string>reader.result
    }



  }

  onSubmitForm(){
    this.isLoading=true

    if (this.mode==="create"){

      this.postService.onAddPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }else {
      this.postService.onUpdatePost(
        <string>this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        )





    }
    this.postId=null;

    this.form.reset();





  }

}
