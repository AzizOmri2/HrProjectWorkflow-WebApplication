import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlashMessageService } from '../../../flash-message.service';

@Component({
  selector: 'app-update-profile-front',
  imports: [CommonModule, FormsModule],
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
      currentPassword: '' // Store current password (don't display)
    };
  selectedFile: File | null = null;
  userId: number = Number(localStorage.getItem("user_id") || 0);
  flashMessage: { type: string | null, text: string | null } = { type: null, text: null };
    
  
    constructor(
      private userService: UserService, 
      private route: ActivatedRoute,
      private flashMessageService: FlashMessageService
    ) {}
  
    // OnInit lifecycle hook to fetch user data by ID
    ngOnInit(): void {
      if (this.userId) {
        this.getUserDetails(this.userId);
      }

      // Display any flash message if present
      this.flashMessage = this.flashMessageService.getMessage() || { type: null, text: null };
    }
  
    // Method to fetch user data from the backend
    getUserDetails(id: number): void {
      this.userService.getUserById(id).subscribe({
        next: (userData) => {
          this.user = userData;
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
    
      this.userService.updateUser(this.userId, formData).subscribe({
        next: (res) => {
          console.log('User updated:', res);
    
          // After successful user update, update the user data in localStorage
          const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
          updatedUser.name = this.user.name;
    
          // If no new image was selected, retain the old image value
          if (this.selectedFile) {
            updatedUser.image = `uploads/${this.selectedFile.name}`; // Update image path
          } else {
            // Keep the existing image in localStorage
            updatedUser.image = updatedUser.image || this.user.image;
          }
    
          // Update the user data in localStorage with the new or existing values
          localStorage.setItem('user_image', updatedUser.image);
          localStorage.setItem('user_name', updatedUser.name);
  
          // Set success flash message
          this.flashMessageService.setMessage('success', 'Profile updated successfully.');
          // Reload to reflect changes and show message
          window.location.reload();
        },
        error: (err) => {
          console.error('Error updating user:', err);
          // Set error message without reload
          this.flashMessageService.setMessage('error', 'Profile update failed.');
        }
      });
    }

}
