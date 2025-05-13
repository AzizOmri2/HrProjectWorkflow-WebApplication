import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlashMessageService } from '../../flash-message.service';
declare var $: any;

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.None
})



export class RegisterComponent{

  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  role = '';
  image = '';
  error = '';

  constructor(private authService: AuthService, private router: Router,private flashMessageService: FlashMessageService) {}

  register(): void {
    this.error = '';
    console.log('Submitting:', 
      { user: 
        { name: this.name, email: this.email, password: this.password, password_confirmation: this.passwordConfirmation, role: this.role, image: this.image  } 
      }
    );
    this.authService.register(this.name, this.email, this.password, this.role, this.image).subscribe({
      next: (response) => {
        this.flashMessageService.setMessage('success', 'Registration successful! You can now log in.');
        window.location.href = '/login';
      },
      error: (err) => {
        this.error = err.error.errors?.join(', ') || err.error.message || 'Registration failed';
        this.flashMessageService.setMessage('error', 'Registration failed!');
        window.location.href = '/login';
      }
    });
  }

}
