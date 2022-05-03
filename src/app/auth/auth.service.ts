import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { authModel } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authListener=new Subject<boolean>();
  private isLogedIn=false;
  public getUserState(){
    return this.isLogedIn;
  }
  public getAuthListener(){
    return this.authListener.asObservable();
  }
  
  private token!:string;
  public getToken(){
    return this.token;
  }

  constructor(private http:HttpClient,private router:Router) { }
  createUser(email:string,password:string){
    const auth:authModel ={email:email,password:password}
    this.http.post('http://localhost:3000/api/user/signup',auth).subscribe(result=>{console.log(result);
    })
  }

  loginUser(email:string,password:string){
    const auth:authModel={email:email,password:password};
    this.http.post<{token:string}>('http://localhost:3000/api/user/login',auth)
    .subscribe(result=>{
      console.log(result.token);
      if (result.token){

        this.token=result.token;
        this.authListener.next(true);
        this.isLogedIn=true
        this.router.navigate(["/"]);
        
      }

    })
  }

  logOut(){
    this.isLogedIn=false;
    this.authListener.next(false);
    this.token="";
    this.router.navigate(["/"]);
    
  }
}
