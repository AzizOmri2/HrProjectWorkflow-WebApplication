import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-application-front',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-application-front.component.html',
  styleUrl: './add-application-front.component.css'
})
export class AddApplicationFrontComponent implements OnInit{
  application: any = {
    job_offer_id: '',
    candidate_id: '',
    cv_file: '',
    status: '',
    applied_at: '',
    cover_letter: ''
  };
  selectedFile: File | null = null;
  showAlert = false;
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService, 
    private location: Location
  ) {}


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      alert('Please select a valid PDF file.');
    }
  }

  ngOnInit(): void {
    // Retrive the job offer ID from URL
    this.application.job_offer_id = Number(this.route.snapshot.paramMap.get('id'));

    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.application.candidate_id = userId;  // Assign to candidate_id
    } else {
      console.error('User ID not found in localStorage');
    }

    // The Application's Status is Pending At first
    this.application.status = 'Pending';

    // The Application's Applied At should take the systemDate as a default value
    this.application.applied_at = new Date().toISOString();
  }

  onSubmit() {
    this.showAlert = false;
    // Ensure application is valid before submission
    if (this.application.job_offer_id && this.application.candidate_id && this.selectedFile && 
        this.application.status && this.application.applied_at) {
      

      const formData = new FormData();
      formData.append('application[job_offer_id]', this.application.job_offer_id);
      formData.append('application[candidate_id]', this.application.candidate_id);
      formData.append('application[status]', this.application.status);
      formData.append('application[applied_at]', this.application.applied_at);
      
      // Append the file to FormData
      if (this.selectedFile) {
        formData.append('application[cv_file]', this.selectedFile, this.selectedFile.name);
      }

      formData.append('application[cover_letter]', this.application.cover_letter);
      
      this.applicationService.createApplication(formData).subscribe(
        response => {
          console.log('Application added successfully:', response);
          this.typeAlert = 'success';
          this.showAlert = true;
          this.error = "The Application was successfully added created."
          
          // Redirect back and reload the page
          setTimeout(() => {
            this.location.back(); // Go back to previous page
            setTimeout(() => window.location.reload(), 100); // Reload after going back
          }, 500); // Delay to show alert before redirect
        },
        error => {
          console.error('Error adding application:', error);
          this.typeAlert = 'danger';
          this.showAlert = true;
          this.error = error.error?.error || "There was an error with your application. Please try again.";
        }
      );
    } else {
      this.typeAlert = 'danger';
      this.showAlert = true;
      this.error = "Please fill all required fields."
    }
  }


  
  

}
