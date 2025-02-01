import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from '../interfaces/job';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://localhost:44330/api/Admin';

  constructor(
    private http:HttpClient,
    private router:Router
  ) {}

  addNewJob(job:Job):Observable<Job>{
    return this.http.post<Job>(`${this.apiUrl}/add-new-job`,job);
  }

  deleteJob(job:Job):Observable<Job>{
    return this.http.delete<Job>(`${this.apiUrl}/delete-job/${job.id}`);
  }
}
