import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FlashMessageService } from '../../flash-message.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  user = { password: '', password_confirmation: '' };
  token = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private flashMessageService: FlashMessageService
  ) {
    this.token = this.route.snapshot.queryParamMap.get('reset_password_token') || '';
  }

  onSubmit() {
    console.log('Token:', this.token);
    console.log('Password:', this.user.password);
    console.log('Password confirmation:', this.user.password_confirmation);

    const payload = {
      user: {
        reset_password_token: this.token,
        password: this.user.password,
        password_confirmation: this.user.password_confirmation
      }
    };

    this.authService.resetPassword(this.token, this.user.password, this.user.password_confirmation)
      .subscribe({
        next: () => {
          this.flashMessageService.setMessage('success', 'Password Reset successful! You can now log in with your new password.');
          window.location.href = '/login';
        },
        error: (err) => {
          console.error('Full error:', err);
          alert(err.error?.error || err.error?.message || 'Password reset failed');
        }
      });
  }
}
