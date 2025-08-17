import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { FlashMessageService } from '../../flash-message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  flashMessage: { type: string | null, text: string | null } = { type: null, text: null };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private flashMessageService: FlashMessageService
  ) {}

  ngOnInit() {
    this.flashMessage = this.flashMessageService.getMessage() || { type: null, text: null };

    const token = this.authService.getToken();
    if (token) {
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.flashMessage = { type: 'warning', text: '⚠️ Please enter both email and password.' };
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        const body = response.body || response;
        const token = body.token;
        const user = body.user;

        if (token && user) {
          // Store token and user info in AuthService / localStorage
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_id', user.id.toString());
          localStorage.setItem('user_name', user.name);
          localStorage.setItem('user_role', user.role.toString());
          localStorage.setItem('user_image', user.image);
          localStorage.removeItem('alert_shown');

          this.isLoggedIn = true;

          // Role-based navigation
          if (user.role === 'admin') {
            this.router.navigate([user.nbCnx === 1 ? '/update-password' : '/back']);
          } else if (user.role === 'rh') {
            this.router.navigate([user.nbCnx === 1 ? '/update-password' : '/back-hr']);
          } else {
            this.router.navigate(['/front']);
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
  }
}
