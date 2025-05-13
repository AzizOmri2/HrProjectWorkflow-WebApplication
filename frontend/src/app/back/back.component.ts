import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back',
  imports: [CommonModule],
  templateUrl: './back.component.html',
  styleUrl: './back.component.css'
})
export class BackComponent implements OnInit{
  isLoggedIn: boolean = true;
  userName: string = '';
  createdAt: string = '';
  role: string = '';
  image: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  

  ngOnInit(): void {
    const storedName = localStorage.getItem('user_name');
    const storedDate = localStorage.getItem('created_at');
    const storedRole = localStorage.getItem('user_role');
    const storedImage = localStorage.getItem('user_image');
    if (storedName && storedDate && storedRole) {
      this.userName = storedName;
      const date = new Date(storedDate);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      this.createdAt = `${day}-${month}-${year}`;
      this.role = storedRole;
      if(storedImage == 'null' || storedImage == ''){
        this.image = 'uploads/default.jpg';
      } else{
        this.image = storedImage || '';
      }
    }
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logged out successfully', response);
        localStorage.removeItem('user_token'); // Remove the token
        localStorage.removeItem('user_name');
        localStorage.removeItem('created_at');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_image');
        this.isLoggedIn = false;
        window.location.href = '/login'; // Redirect to login page after logout
      },
      (error) => {
        console.error('Error during logout', error);
      }
    );
  }

}
