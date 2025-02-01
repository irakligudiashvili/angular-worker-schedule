import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Job } from '../interfaces/job';
import { Schedule } from '../interfaces/schedule';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44330/api/user';
  private apiUrlAdmin = 'https://localhost:44330/api/admin';

  private jobTitles: { [key: number]: string} = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
    ) {
      translate.addLangs(['en', 'de', 'fr']);
      translate.setDefaultLang('en');
      translate.use('en');
    }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
    
  fetchJobTitles(): Observable<any>{
    return this.http.get(`${this.apiUrl}/jobs`);
  }

  getJobTitleById(jobId: number): string {
    return this.jobTitles[jobId] || 'Unknown Occupation';
  }

  loadJobTitles(): void {
    this.fetchJobTitles().subscribe({
      next: (data: any[]) => {
        this.jobTitles = data.reduce((acc, job) => {
          acc[job.id] = job.title;
          return acc;
        }, {});
      },
      error: (err) => {
        console.error('Error fetching job titles:', err);
      }
    });
  }

  decodeToken(token: string | null): any{
    if(!token) return null;
    try{
      return JSON.parse(atob(token.split('.')[1]));
    }catch(e){
      console.error('Error decoding JWT token', e);
      return null;
    }
   }

  isAdmin():boolean{
    const jwtToken = localStorage.getItem('token');
    const decodedToken = this.decodeToken(jwtToken);
    const role= decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    if(role === '1'){
      return true;
    }else{
      return false;
    }
  }

  getUserId(){
    const jwtToken = localStorage.getItem('token');
    const decodedToken = this.decodeToken(jwtToken);
    const uid= decodedToken?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    return uid;
  }

  getUsers(): Observable<any>{
    return this.http.get(`${this.apiUrl}/users`);
  }

  deleteUser(userId: any): Observable<void>{
    return this.http.delete<void>(`${this.apiUrlAdmin}/delete-user/${userId}`);
  }

  getJobOptions(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/dashboard`);
  }  

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logInUser(userData: any): Observable<any>{
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<string>(`${this.apiUrl}/login`, userData, 
    {headers, responseType: 'text' as 'json'});
    
  }

  changeUserRole(user:any,roleId:number): Observable<any> {
    return this.http.post(`${this.apiUrlAdmin}/change-user-role`, {userId:user.id,newRoleId:roleId});
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  goToWorker(){
    this.router.navigate(['/worker']);
  }

  goToAdmin(){
    this.router.navigate(['/admin']);
  }

  goToJobs(){
    this.router.navigate(['/jobs']);
  }
  
  goToLogin(){
    this.router.navigate(['/login']);
  }
  
  goToRegister(){
    this.router.navigate(['/register']);
  }

  goToSchedule(){
    this.router.navigate(['/schedule'])
  }
}
