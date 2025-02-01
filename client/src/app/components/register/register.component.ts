import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../validators/passwordMatch.Validator';
import { Job } from 'src/app/interfaces/job';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm!: FormGroup;
  jobOptions: Job[] = [];

  constructor(
    private fb: FormBuilder,
    protected userService: UserService,
    private router: Router,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchJobOptions;
    this.createForm();
    this.fetchJobOptions();
  }

  createForm(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      jobId: [null, Validators.required]
    }, { validators: passwordMatchValidator });
  }

  Register(): void {
    if (this.registrationForm.valid) {
      const { confirmPassword, jobId, ...userData } = this.registrationForm.value;
      const job = jobId as Job;

      this.userService.registerUser({ ...userData, jobId: job.id }).subscribe({
        next: (response) => {
          console.log("Registration successful: ",response);
          this.showSuccess();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Registration failed: ', error);
          this.showFailure();
        }
      });
    }
  }

  fetchJobOptions(): void {
    this.userService.getJobOptions().subscribe({
      next: (response) => {
        console.log('Job options:', response);
        this.jobOptions = response;
      },
      error: (error) => {
        console.error('Error fetching job options:', error);
      }
    });
  }  

  showSuccess(){
    this.toastr.success("Successfully registered","Success");
  }

  showFailure(){
    this.toastr.error("Failed to register","Warning");
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
