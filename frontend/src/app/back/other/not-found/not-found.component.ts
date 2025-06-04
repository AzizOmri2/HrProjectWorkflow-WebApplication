import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit{
  currentUserId: number = 0;
  userRole: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Retrieve the user Role from localStorage
    const role = localStorage.getItem('user_role');
    if(role){
      this.userRole = role;
      if (role === 'admin') {
        this.router.navigate(['/back/404-not-found']);
      } else if (role === 'rh') {
        this.router.navigate(['/back-hr/404-not-found']);
      } else if (role === 'candidate') {
        this.router.navigate(['/front/404-not-found']);
      }else{
        // fallback if user is not identified
        this.router.navigate(['/access-denied']);
      }
    }else{
      // User Not Autheniticated
      console.error('User Role not found in localStorage');
      this.userRole = 'empty';
    }
  }
}
