import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';
import { FormsModule } from '@angular/forms';
import { UserShowComponent } from '../user-show/user-show.component';

declare var $: any;


@Component({
  selector: 'app-users-list',
  imports: [CommonModule,RouterModule,FilterPipe,FormsModule, UserShowComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})


export class UsersListComponent implements OnInit{
  connectedUserId: number | null = null;
  users:any;
  searchText: string = '';
  filterRole: string = '';
  filterStatus: string | boolean = '';
  showModal = false;
  selectedUserId: number | null = null;

  userIdToDelete: number | null = null;
  deleteMessage: string = 'Are you sure you want to delete this user?';
  typeAlert = '';
  alertMessage='';


  constructor(
    private userService: UserService, 
  ){}

  ngOnInit(){
    const storedId = localStorage.getItem("user_id");
    this.connectedUserId = storedId !== null ? Number(storedId) : null;
    
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
    window.location.reload();
  }

  UsersList() {
    this.userService.getAllUsers().subscribe(user => {
      this.users = user; // ✅ store the actual user list
      console.log(this.users);
    });
  }


  deleteUser(id: number): void {
    this.userIdToDelete = id;
    this.deleteMessage = 'Are you sure you want to delete this user?';
    $('#confirmDeleteModal').modal('show');
  }

  confirmDelete(): void {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe(
        () => {
          this.UsersList();
          this.userIdToDelete = null;

          this.typeAlert = 'success';
          this.alertMessage = "The selected user was deleted successfully. The list has been updated.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        },
        error => {
          this.typeAlert = 'danger';
          this.alertMessage = "An error occurred while trying to delete the user. Please try again.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        }
      );
    }
  }

  resetFilters(): void {
    this.filterRole = '';
    this.filterStatus = '';
    this.searchText = '';
  }

  ngAfterViewInit(): void {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }

}
