import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { FlashMessageService } from '../../flash-message.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  flashMessage: { type: string | null, text: string | null } = { type: null, text: null };

  constructor(private authService: AuthService, private router: Router,private flashMessageService: FlashMessageService) {}

  ngOnInit() {
    this.flashMessage = this.flashMessageService.getMessage() || { type: null, text: null }; // Default values
    // Check if a token is already saved in localStorage to maintain the logged-in state
    const token = localStorage.getItem('user_token');
    if (token) {
      this.isLoggedIn = true;
    }
  }
  

  onSubmit() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(
        (response: any) => {
          const token = response.token;
          const user = response.user;
          const role = user.role;
  
          if (token && user && role) {
            // Store user info in localStorage
            localStorage.setItem('user_token', token);
            localStorage.setItem('user_name', user.name);
            localStorage.setItem('created_at', user.created_at);
            localStorage.setItem('user_role', user.role);
            localStorage.setItem('user_image', user.image);
            
            this.isLoggedIn = true;
  
            // ✅ Detailed success alert
            alert(
              `✅ Login Successful !\n\nWelcome, ${user.name} !\nYour account was created on: ${new Date(user.created_at).toLocaleDateString('en-GB')}\n\nYou are : ${user.role === 'admin' ? 'Admin' : user.role === 'rh' ? 'RH' : 'Candidate'}`
            );
  
            // Redirect based on user role
            if (user.role === 'admin') {
              window.location.href = '/back'; // Admin
            } else {
              window.location.href = '/front'; // RH or Candidate
            }
          } else {
            this.errorMessage = 'Failed to retrieve token';
            alert('❌ Login failed: Missing token or user info from server.');
          }
        },
        (error) => {
          console.error('Login failed:', error);
          let errorMsg = 'Unknown error';
          if (error.error?.errors?.length > 0) {
            errorMsg = error.error.errors.join('\n');
          } else if (typeof error.error === 'string') {
            errorMsg = error.error;
          } else if (error.message) {
            errorMsg = error.message;
          }
          this.errorMessage = errorMsg;
          alert(`❌ Login Failed:\n\n${errorMsg}`);
        }
      );
    } else {
      alert('⚠️ Please enter both email and password.');
    }
  }
}
