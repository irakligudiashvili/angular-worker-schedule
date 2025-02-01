import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-worker',
  standalone: false,
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent {

  constructor(
    protected userService: UserService,
    private router:Router
  ){}

  users: any[] =[];

  roleNames: any = {
    1: "Admin",
    2: "Worker"
  }

  ngOnInit(): void{
    this.getUsers();
    this.userService.loadJobTitles();
  }

  logOut(){
    this.userService.logOut();
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users: ', err);
      }
    });
  }

  deleteUser(userId: any): void{
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        console.log("User Deleted");
        location.reload();
      },
      error: (err) => {
        console.error('Error deleting user: ', err);
      }
    })
  }

  getOccupationName(jobId: number): string {
    return this.userService.getJobTitleById(jobId);
  }

  getRoleName(roleId: any): string{
    return this.roleNames[roleId];
  }

  giveAdmin(user:any){
    this.userService.changeUserRole(user,1).subscribe({
      next: (response)=>{
        console.log(`Admin given to user ID ${user.id}: `,response);
        location.reload();
      },
      error: (error) =>{
        console.error(`Failed to give admin to user ID ${user.id}: `,error);
      }
    })
  }

  revokeAdmin(user:any){
    this.userService.changeUserRole(user,2).subscribe({
      next: (response)=>{
        console.log(`Admin revoked from user ID ${user.id}: `,response);
        location.reload();
      },
      error: (error) =>{
        console.error(`Failed to revoke admin from user ID ${user.id}: `,error);
      }
    })
  }
}
