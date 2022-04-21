import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  constructor(private authService :AuthService) { }
  private authListenerSub!:Subscription;
  public  isLogedIn=false;
  ngOnInit(): void {
this.authService.getAuthListener().subscribe((isLogedIn)=>{
  this.isLogedIn=isLogedIn;
})
  }


  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

}
