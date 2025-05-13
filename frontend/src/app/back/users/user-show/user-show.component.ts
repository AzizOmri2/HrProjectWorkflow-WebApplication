import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})
export class UserShowComponent implements OnInit{

  userId!: number;
  user: any = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    image: '', 
    currentPassword: ''
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
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

  toggleActive(id: number) {
    this.userService.toggleUserActive(id).subscribe(() => {
      this.ngOnInit();
    });
  }


}
