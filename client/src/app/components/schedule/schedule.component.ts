import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { Job } from 'src/app/interfaces/job';
import { Schedule } from 'src/app/interfaces/schedule';
import { ScheduleService } from 'src/app/services/schedule.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  faCheck = faCheck;
  faTrash = faTrash;

  weekDates: string[] = [];
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  jobs: Job[] = [];
  schedules: Schedule[] = [];
  requestForm!:FormGroup;
  shiftOptions=["Morning", "Evening"];
  datePipe:DatePipe=new DatePipe('en-US','+0400');

  organizedSchedules: { [date: string]: { [jobId: number]: { morning: Schedule[], night: Schedule[] } } } = {};
  currentWeek: moment.Moment = moment();

  ngOnInit(): void {
    this.generateCurrentWeek();
    this.getJobs();
    this.getSchedules();
    this.createForm();
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    protected userService: UserService,
    private scheduleService: ScheduleService,
    private toastr:ToastrService
  ){}

  generateCurrentWeek(): void {
    const startOfWeek = this.currentWeek.clone().startOf('isoWeek');
    const endOfWeek = this.currentWeek.clone().endOf('isoWeek');

    this.weekDates = [];
    for (let date = startOfWeek; date.isSameOrBefore(endOfWeek); date.add(1, 'day')) {
      this.weekDates.push(date.format('MMM D'));
    }
  }

  getJobs(): void{
    this.userService.getJobOptions().subscribe((jobs: Job[]) => {
      this.jobs = jobs;
    })
  }

  getSchedules(): void {
    this.userService.getSchedules().subscribe((schedules: Schedule[]) => {
      this.schedules = schedules;
      this.organizeSchedules();
    });
  }

  organizeSchedules(): void {
    this.organizedSchedules = {};
  
    this.schedules.forEach(schedule => {
      const date = moment(schedule.startTime).format('MMM D');
      const shiftType = (moment(schedule.startTime).hour() < 16 && moment(schedule.startTime).hour() >= 8) ? 'morning' : 'night';
  
      if (!this.organizedSchedules[date]) {
        this.organizedSchedules[date] = {};
      }
  
      if (!this.organizedSchedules[date][schedule.jobId]) {
        this.organizedSchedules[date][schedule.jobId] = { morning: [], night: [] };
      }
  
      this.organizedSchedules[date][schedule.jobId][shiftType].push(schedule);
    });
  }
  

  goToNextWeek(): void {
    this.currentWeek.add(1, 'week');
    this.generateCurrentWeek();
    this.getSchedules();
  }

  goToPreviousWeek(): void {
    this.currentWeek.subtract(1, 'week');
    this.generateCurrentWeek();
    this.getSchedules();
  }

  goToCurrentWeek(): void {
    this.currentWeek = moment();
    this.generateCurrentWeek();
    this.getSchedules();
  }

  approveScheduleRequest(schedule:Schedule){
    if(!schedule.isApproved&&this.userService.isAdmin()){
      this.scheduleService.approveScheduleRequest(schedule).subscribe({
        next: (response) => {
          console.log("Schedule approved: ",response);
          this.showApproveSuccess();
          this.getSchedules();
        },
        error: (error) => {
          console.log('Approval failed: ', error);
          this.showApproveFailure();
        }
      });
    }
  }

  createForm(): void {
    this.requestForm = this.fb.group({
      requestDate: [null,Validators.required],
      shift: ["",Validators.required]
    });
  }

  requestSchedule(): void {
    if (this.requestForm.valid) {
      const requestDate=this.requestForm.get("requestDate")?.value;
      const shift=this.requestForm.get("shift")?.value;
      let startTime:Date=new Date(requestDate);
      let endTime:Date=new Date(requestDate);
      if(shift=="Morning"){
        startTime.setHours(12);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        endTime.setHours(20);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);
      }else if(shift=="Evening"){
        startTime.setHours(20);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        endTime.setHours(24);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);
      }
      const uid = this.userService.getUserId();
      let requestData={startTime:startTime,endTime:endTime,userId:uid};
      this.scheduleService.addScheduleRequest(requestData).subscribe({
        next: (response) => {
          console.log("Schedule requested: ",response);
          this.getSchedules();
          this.showRequestSuccess();
        },
        error: (error) => {
          console.log('Request failed: ', error);
          this.showRequestFailure();
        }
      });
    }
  }

  deleteSchedule(scheduleId: any): void{
    this.scheduleService.deleteSchedule(scheduleId).subscribe({
      next: () => {
        console.log("Schedule Deleted");
        this.getSchedules();
        this.showDeleteSuccess();
      },
      error: (err) => {
        console.error('Error deleting schedule: ', err);
        this.showDeleteFailure();
      }
    })
  }

  showRequestSuccess(){
    this.toastr.success("Schedule successfully requested","Success");
  }

  showRequestFailure(){
    this.toastr.error("Failed to request schedule","Error");
  }

  showApproveSuccess(){
    this.toastr.success("Schedule successfully approved","Success");
  }

  showApproveFailure(){
    this.toastr.error("Failed to approve schedule","Error");
  }

  
  showDeleteSuccess(){
    this.toastr.success("Schedule successfully deleted","Success");
  }

  showDeleteFailure(){
    this.toastr.error("Failed to delete schedule","Error");
  }
}
