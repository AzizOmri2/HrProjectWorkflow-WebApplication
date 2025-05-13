import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.None
})



export class RegisterComponent implements AfterViewInit{

  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  role = '';
  image = 'uploads/aa.png';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    $('input').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%'
    });
  }

  register(): void {
    if (this.password !== this.passwordConfirmation) {
      this.error = 'Passwords do not match';
      alert('Sign Up Failed : Passwords do not match');
      return;
    }
    this.error = '';
    console.log('Submitting:', 
      { user: 
        { name: this.name, email: this.email, password: this.password, password_confirmation: this.passwordConfirmation, role: this.role } 
      }
    );
    this.authService.register(this.name, this.email, this.password, this.role, this.image).subscribe({
      next: (response) => {
        window.location.href = '/login';
      },
      error: (err) => {
        this.error = err.error.errors?.join(', ') || err.error.message || 'Registration failed';
      }
    });
  }

}
