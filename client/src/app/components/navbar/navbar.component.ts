import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    protected userService:UserService,
    private toastr:ToastrService
  ){}
  
  loggedIn!:boolean;
  ngOnInit(){
    const jwtToken=localStorage.getItem('token');
      if(jwtToken){
        this.loggedIn=true;
      }else{
        this.loggedIn=false;
      }
      this.ngOnInit();
  }
  
  logOut(){
    this.userService.logOut();
    this.showLogOut();
    this.ngOnInit();
  }

  showLogOut(){
    this.toastr.warning("You are now logged out");
  }
}
