import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-password-login.component.html',
  styleUrl: './update-password-login.component.css'
})
export class UpdatePasswordLoginComponent {
  user: any = {
    password: '',
    password_confirmation: '',
  };

  userId: number = 0;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      this.userId = parseInt(storedId);
    } else {
      this.router.navigate(['/login']); // redirect if not logged in
    }
  }

  onSubmit() {
    if (this.user.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.authService.updatePassword(this.userId, this.user.password).subscribe(
      () => {
        this.successMessage = '✅ Password updated successfully!';
        setTimeout(() => {
          const role = localStorage.getItem('user_role');
          this.router.navigate([role === 'admin' || role === 'rh' ? '/back' : '/front']);
        }, 1500);
      },
      (error) => {
        this.errorMessage = error.error?.errors?.join('\n') || 'Password update failed.';
      }
    );
  }

}
