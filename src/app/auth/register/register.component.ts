import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading=false
  constructor(private authService:AuthService) { }
  onSubmit( loginForm:NgForm){
    this.authService.createUser(loginForm.value.email,loginForm.value.password)
  }

  ngOnInit(): void {
    
  }

}
