import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FlashMessageService } from '../../../flash-message.service';
import { CommonModule } from '@angular/common';

declare var $: any;


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


  typeAlert: 'success' | 'danger' | 'info' = 'success';
  error = '';

  constructor(
    private authService: AuthService, 
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
      this.typeAlert = 'info';
      this.error = "The password has been copied to your clipboard.";
      $('#alertModal').modal('show');
    });
  }

  onSubmit(): void {
    this.authService.createUserByAdmin(this.name, this.email, this.password, this.role, this.image, this.active, this.gender, this.birth_date, this.nationality).subscribe({
      next: (response) => {
        this.typeAlert = 'success';
        this.error = "The user account data has been submitted and recorded successfully.";
        $('#alertModal').modal('show');
      },
      error: (err) => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while creating the account. Please review your data or try again later.";
        $('#alertModal').modal('show');
      }
    });
  }

  ngAfterViewInit(): void {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }
}
