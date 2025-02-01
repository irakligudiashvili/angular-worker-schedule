import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Job } from 'src/app/interfaces/job';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent {
  jobOptions: Job[] = [];
  jobForm!:FormGroup;

  constructor(
    private fb: FormBuilder,
    protected userService: UserService,
    private router: Router,
    private jobService: JobService,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchJobOptions();
    this.createForm();
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

  createForm():void{
    this.jobForm=this.fb.group({
      title:["",[Validators.required,Validators.minLength(1)]]
    });
  }

  addNewJob(){
    const job:Job=this.jobForm.value;
    this.jobService.addNewJob(job).subscribe({
      next: (response)=>{
        console.log("Job added successfully: ",response);
        this.showAddSuccess();
        this.fetchJobOptions();
      },
      error: (error) => {
        this.showAddFailure();
        console.log("Failed to add job: ",error);
      }
    })
  }

  deleteJob(job:Job){
    this.jobService.deleteJob(job).subscribe({
      next: (response) => {
        console.log("Job deleted successfully: ",response);
        this.showDeleteSuccess();
        this.fetchJobOptions();
      },
      error: (error) => {
        this.showDeleteFailure();
        console.log("Failed to delete job: ",error);
      }
    })
  }

  showAddSuccess(){
    this.toastr.success("Job successfully added","Success");
  }

  showAddFailure(){
    this.toastr.error("Failed to add job","Warning");
  }

  showDeleteSuccess(){
    this.toastr.warning("Job successfully deleted","Success");
  }

  showDeleteFailure(){
    this.toastr.error("Failed to delete job","Warning");
  }
}
