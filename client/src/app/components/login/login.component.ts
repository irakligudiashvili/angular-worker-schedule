import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected userService: UserService,
    private router: Router,
    private toastr:ToastrService,
  ){}

  ngOnInit(): void {
    this.createForm();
  }
  
  createForm(){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
  });
  }

  Login(){
    if(this.loginForm.valid){
      const userData = this.loginForm.value;
      this.userService.logInUser(userData).subscribe({
        next:(response: any) => {
          console.log('logged in successfully: ',response);
          const jwtToken = response;
          localStorage.setItem('token', jwtToken);

          const decodedToken= this.decodeToken(jwtToken);
          const role= decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          // this.router.navigate(['/worker']);

          if(role==='1'){
            this.showSuccessAdmin();
            this.router.navigate(['/admin']);
          }else if(role=== '2'){
            this.showSuccessWorker();
            this.router.navigate(['/worker']);
          }
          else{
            console.log('Login failed. Please check your credentials', 'Error');
          }
        },
        error:(error) =>{
          console.log('login failed: ',error);
        }
      })
    }
  }

  private decodeToken(token: string): any{
    try{
      return JSON.parse(atob(token.split('.')[1]));
    }catch(e){
      console.error('Error decoding JWT token', e);
      return null;
    }
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }

  showSuccessWorker(){
    this.toastr.info("Logged in as a <b>worker</b>","Success",{enableHtml:true});
  }

  showSuccessAdmin(){
    this.toastr.info("Logged in as an <b>admin</b>","Success",{enableHtml:true});
  }

  showFailure(){
    this.toastr.error("Failed to log in","Warning");
  }

}
