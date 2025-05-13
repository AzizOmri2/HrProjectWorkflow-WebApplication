import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule,RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit{

  users:any;

  constructor(private userService: UserService, private router : Router){

  }

  ngOnInit(){
    this.UsersList()
  }

  UsersList(){
    this.users = this.userService.getAllUsers().subscribe(
      user => {
        this.users = user
        console.log(this.users);
      }
    )
  }


  toggleActive(id: number) {
    this.userService.toggleUserActive(id).subscribe(() => {
      this.ngOnInit();
    });
  }


  // Delete user
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          // Refresh the user list after deletion
          this.ngOnInit();
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

}
