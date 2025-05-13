import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FlashMessageService } from '../flash-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-front',
  imports: [CommonModule,RouterModule],
  templateUrl: './front.component.html',
  styleUrl: './front.component.css'
})
export class FrontComponent implements OnInit{

  isLoggedIn: boolean = true;
    userName: string = '';
    createdAt: string = '';
    role: string = '';
    image: string = '';
    flashMessage: { type: string | null, text: string | null } = { type: null, text: null };
  
    constructor(private authService: AuthService, private router: Router, private flashMessageService: FlashMessageService) {}
  
    
  
    ngOnInit(): void {
      this.flashMessage = this.flashMessageService.getMessage() || { type: null, text: null };
      const storedName = localStorage.getItem('user_name');
      const storedDate = localStorage.getItem('created_at');
      const storedRole = localStorage.getItem('user_role');
      const storedImage = localStorage.getItem('user_image');
      if (storedName && storedDate && storedRole) {
        this.userName = storedName;
        const date = new Date(storedDate);
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        this.createdAt = `${day}-${month}-${year}`;
        this.role = storedRole;
        if(storedImage == 'null' || storedImage == ''){
          this.image = 'uploads/default.jpg';
        } else{
          this.image = storedImage || '';
        }
  
        const modalMessage = localStorage.getItem('modal_message');
      }
    }
  
    logout() {
      this.authService.logout().subscribe(
        (response) => {
          console.log('Logged out successfully', response);
          localStorage.removeItem('auth_token'); // Remove the token
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_name');
          localStorage.removeItem('created_at');
          localStorage.removeItem('user_role');
          localStorage.removeItem('user_image');
          localStorage.removeItem('modal_message');
          this.isLoggedIn = false;
          window.location.href = '/login'; // Redirect to login page after logout
        },
        (error) => {
          console.error('Error during logout', error);
        }
      );
    }

}
