import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-find-email',
  imports: [FormsModule, CommonModule],
  templateUrl: './find-email.component.html',
  styleUrl: './find-email.component.css'
})
export class FindEmailComponent implements OnInit{

  email: string = '';
  message: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.message = '';
    this.error = '';

    if (!this.email) {
      this.error = 'Please enter your email.';
      return;
    }

    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        this.message = 'You will receive reset instructions shortly.';
      },
      error: (err) => {
        this.error = 'Failed to send reset instructions. Please try again later.';
        console.error('Password reset request error:', err);
      }
    });
  }

}
