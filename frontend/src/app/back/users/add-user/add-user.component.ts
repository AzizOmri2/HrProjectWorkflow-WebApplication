import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FlashMessageService } from '../../../flash-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit{
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  role = '';
  image = '';
  gender = '';
  birth_date = '';
  nationality = '';
  active = true;
  error = '';
  showAlert = false;
  typeAlert = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private flashMessageService: FlashMessageService
  ){}

  ngOnInit(): void {
    this.flashMessageService.getMessage();
    this.password = this.generateRandomPassword(10);
    this.passwordConfirmation = this.password;
  }

  generateRandomPassword(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  copyPassword() {
    navigator.clipboard.writeText(this.password).then(() => {
      alert("Password copied to clipboard");
    });
  }

  onSubmit(): void {
    this.error = '';
    this.showAlert = false;
    console.log('Submitting:', 
      { user: 
        { name: this.name, email: this.email, password: this.password, password_confirmation: this.passwordConfirmation, role: this.role, image: this.image, active: this.active  } 
      }
    );
    this.authService.register(this.name, this.email, this.password, this.role, this.image, this.active).subscribe({
      next: (response) => {
        this.typeAlert = 'success';
        this.showAlert = true;
        this.error = "The user account was successfully created."
      },
      error: (err) => {
        this.error = err.error.errors?.join(', ') || err.error.message || 'Registration failed';
        this.typeAlert = 'danger';
        this.showAlert = true;
      }
    });
  }

}
