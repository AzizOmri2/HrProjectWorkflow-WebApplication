import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-lock-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './lock-screen.component.html',
  styleUrl: './lock-screen.component.css'
})
export class LockScreenComponent implements OnInit{
  isLoggedIn: boolean = true;

  userName: string = '';
  image: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService
  ) {}


  

  ngOnInit(): void {
    const storedName = localStorage.getItem('user_name');
    const storedImage = localStorage.getItem('user_image');
    
    if (storedName && storedImage) {
      this.userName = storedName;
      this.image = storedImage || '';
    }  
  }

  verifyPassword(): void {
    this.authService.verifyPassword(this.password).subscribe(
      (response) => {
        if (response.success) {
          this.errorMessage = '';
          // Redirect to the appropriate page
          const role = localStorage.getItem('user_role');
          if (role === 'admin') {
            window.location.href = '/back';
          } else if (role === 'rh') {
            window.location.href = '/back-hr';
          } else if (role === 'candidate') {
            window.location.href = '/front';
          } else {
            window.location.href = '/lock';
          }
        } else {
          this.errorMessage = 'Incorrect password. Please try again.';
        }
      },
      (error) => {
        this.errorMessage = 'Error verifying password.';
        console.error(error);
      }
    );
  }


  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logged out successfully', response);
        localStorage.clear();
        this.isLoggedIn = false;
        window.location.href = '/login'; // Redirect to visiteur page after logout
      },
      (error) => {
        console.error('Error during logout', error);
      }
    );
  }


}
