import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Job } from '../interfaces/job';
import { Schedule } from '../interfaces/schedule';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
private apiUrl = 'https://localhost:44330/api/user';
private apiUrlAdmin = 'https://localhost:44330/api/Admin';
private apiUrlWorker = 'https://localhost:44330/api/Worker';

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }

  getScheduleOptions(): Observable<Schedule[]> {
      return this.http.get<Schedule[]>(`${this.apiUrl}/dashboard`);
    }

  approveScheduleRequest(schedule:Schedule):Observable<Schedule>{
    let params=new HttpParams().append("scheduleId",schedule.id);
    return this.http.post<Schedule>(`${this.apiUrlAdmin}/approve-schedule-request`,null,{params:params});
  }
  
  addScheduleRequest(requestData:any):Observable<Schedule>{
    return this.http.post<Schedule>(`${this.apiUrlWorker}/add-schedule-request`,requestData);
  }

  deleteSchedule(scheduleId: any): Observable<void>{
    return this.http.delete<void>(`${this.apiUrlAdmin}/delete-schedule/${scheduleId}`);
  }
}
