import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    this.userService.toggleUserActive(id).subscribe(() => {
      this.ngOnChanges();
    });
  }


}
