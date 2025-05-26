import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';
import { FormsModule } from '@angular/forms';
import { UserShowComponent } from '../user-show/user-show.component';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule,RouterModule,FilterPipe,FormsModule, UserShowComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit{
  users:any;
  searchText: string = '';
  filterRole: string = '';
  filterStatus: string | boolean = '';
  showModal = false;
  selectedUserId: number | null = null;

  


  constructor(
    private userService: UserService, 
    private router : Router){

  }

  ngOnInit(){
    this.UsersList()
  }
  
  openUserInfo(userId: number) {
    this.selectedUserId = userId;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeModal() {
    this.selectedUserId = null;
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  UsersList(){
    this.users = this.userService.getAllUsers().subscribe(
      user => {
        this.users = user
        console.log(this.users);
      }
    )
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

  resetFilters(): void {
    this.filterRole = '';
    this.filterStatus = '';
    this.searchText = '';
  }

}
