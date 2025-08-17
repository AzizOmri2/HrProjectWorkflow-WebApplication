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
    this.flashMessage = this.flashMessageService.getMessage() || { type: null, text: null };
    // Check if a token is already saved in localStorage to maintain the logged-in state
    const token = localStorage.getItem('auth_token');
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
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_id', user.id);
            localStorage.setItem('user_name', user.name);
            localStorage.setItem('created_at', user.created_at);
            localStorage.setItem('user_role', user.role);
            localStorage.setItem('user_image', user.image);
            localStorage.removeItem('alert_shown');
            
            this.isLoggedIn = true;
              
            // Redirect based on user role
            if (user.role === 'admin') {
              if(user.nbCnx === 1){
                this.router.navigate(['/update-password']);
                //window.location.href = '/update-password';
              }else{
                this.router.navigate(['/back']); // Admin
                //window.location.href = '/back';
              }
            } else if(user.role === 'rh'){
              if(user.nbCnx === 1){
                //this.router.navigate(['/update-password']);
                window.location.href = '/update-password';
              }else{
                //this.router.navigate(['/back-hr']); // RH
                window.location.href = '/back-hr';
              }
            }else {
              this.router.navigate(['/front']); // Candidate
              //window.location.href = '/front';
            }
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
          // Specific error handling based on the error message
          if (errorMsg.includes('password')) {
            this.flashMessage = { type: 'error', text: '❌ The password is incorrect.<br>Need help? You can reset your password.' };
          } else if (errorMsg.includes('inactive')) {
            this.flashMessage = { type: 'error', text: '❌ Your account is inactive.<br>Please contact Administration.' };
          } else if (errorMsg.includes('not found')) {
            this.flashMessage = { type: 'error', text: '❌ Email not found.<br>Please verify your email and try again.' };
          } else {
            this.flashMessage = { type: 'error', text: `❌ Login Failed: ${errorMsg}` };
          }
        }
      );
    } else {
      // Case where email or password is missing
      this.flashMessage = { type: 'warning', text: '⚠️ Please enter both email and password.' };
    }
  }
}
