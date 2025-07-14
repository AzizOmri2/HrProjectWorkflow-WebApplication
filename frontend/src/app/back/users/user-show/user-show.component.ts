import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Input, OnChanges } from '@angular/core';


@Component({
  selector: 'app-user-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})


export class UserShowComponent{

  user: any = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    image: '', 
    currentPassword: ''
  };
  typeAlert = '';
  error='';

  @Input() userId!: number;

  ngOnChanges() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: data => {
          this.user = data;
        },
        error: err => {
          console.error('Error fetching user', err);
        }
      });
    }
  }

  constructor(
    private userService: UserService,
  ) {}

  toggleActive(id: number) {
    this.userService.toggleUserActive(id).subscribe(
      response => {
        this.typeAlert = 'success';
        this.error = 'User status has been successfully updated.';
        this.ngOnChanges(); // Refresh the view if needed
      },
      error => {
        this.typeAlert = 'danger';
        this.error = 'The system encountered an issue while updating the user status. Please try again later.';
      }
    );
  }

}
