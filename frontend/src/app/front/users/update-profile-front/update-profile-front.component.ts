import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-update-profile-front',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-profile-front.component.html',
  styleUrl: './update-profile-front.component.css'
})
export class UpdateProfileFrontComponent implements OnInit{
  user: any = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      image: '', // Adding image field in case it's needed
      currentPassword: '', // Store current password (don't display)
      gender: '',
      birth_date: '',
      nationality: ''
    };
  selectedFile: File | null = null;
  userId: number = Number(localStorage.getItem("user_id") || 0);
  showAlert = false;
  typeAlert = '';
  error='';
  isLoggedIn: boolean = true;
    
  
    constructor(
      private userService: UserService, 
      private authService: AuthService
    ) {}
  
    // OnInit lifecycle hook to fetch user data by ID
    ngOnInit(): void {
      this.isLoggedIn = true;
      if (this.userId) {
        this.getUserDetails(this.userId);
      }
    }
  
    // Method to fetch user data from the backend
    getUserDetails(id: number): void {
      this.userService.getUserById(id).subscribe({
        next: (userData) => {
          this.user = userData;
          console.log(this.user);
          // Optionally, store the current password to prevent it from being shown
          this.user.currentPassword = userData.password;
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    }
  
    // Handling file selection for profile image
    onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0];
    }
  
    // Form submission to update user data
    onSubmit(): void {
      const formData = new FormData();
      formData.append('user[name]', this.user.name);
      formData.append('user[email]', this.user.email);
    
      // Only append the password if it has been modified
      if (this.user.password) {
        formData.append('user[password]', this.user.password);
        formData.append('user[password_confirmation]', this.user.password_confirmation);
      }
  
      // Handle the image: If a new file is selected, send the file itself
      if (this.selectedFile) {
        formData.append('user[image]', this.selectedFile, this.selectedFile.name); // Append the file
      }

      formData.append('user[gender]', this.user.gender);
      formData.append('user[birth_date]', this.user.birth_date);
      formData.append('user[nationality]', this.user.nationality);
    
      this.userService.updateUser(this.userId, formData).subscribe({
        next: (res) => {
          console.log('User updated:', res);          

          // After successful update, reload the image from DB (res.image)
          const updatedImage = res.image
            ? `${res.image}?t=${Date.now()}` // Add timestamp to bypass browser cache
            : this.user.image;
    
          // Update the user data in localStorage with the new or existing values
          localStorage.setItem('user_image', updatedImage);
          localStorage.setItem('user_name', res.name);

          // Update current image shown
          this.user.image = updatedImage;
  
          this.typeAlert = 'success';
          this.showAlert = true;
          this.error = "Your Profile's Data was Successfully Updated."
          
          // Optional: Delay reload to allow image changes to propagate
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.typeAlert = 'danger';
          this.showAlert = true;
          this.error = "Your Profile's Update was Failed."
        }
      });
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
          localStorage.removeItem('alert_shown');
          this.isLoggedIn = false;
          window.location.href = '/frontvisiteur'; // Redirect to visiteur page after logout
        },
        (error) => {
          console.error('Error during logout', error);
        }
      );
    }

    deleteAccount() {
      if (confirm('Are you sure you want to delete your account?')) {
        const idStr = localStorage.getItem('user_id');
        const id = idStr ? +idStr : null; // Convert to number

        if (id !== null) {
          this.userService.deleteUser(id).subscribe(
            () => {
              this.logout();
            },
            error => {
              console.error('Error deleting User:', error);
            }
          );
        } else {
          console.error('User ID not found in localStorage.');
        }
      }
    }



}
