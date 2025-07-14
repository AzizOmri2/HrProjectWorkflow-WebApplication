import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';


declare var $: any;


@Component({
  selector: 'app-add-application',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.css'
})


export class AddApplicationComponent implements OnInit {
  application: any = {
    job_offer_id: null,
    candidate_id: '',
    cv_file: '',
    status: '',
    applied_at: ''
  };
  selectedFile: File | null = null;
  typeAlert = '';
  error='';
  

  constructor(
    private applicationService: ApplicationService, 
    private offerService: OfferService
  ) {}

  jobOffers: any[] = [];


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
    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.application.candidate_id = userId;  // Assign to candidate_id
    } else {
      console.error('User ID not found in localStorage');
    }

    this.offerService.getAllOffers().subscribe(data => {
      this.jobOffers = data;
    });
    this.application.status = 'Pending';
    this.application.applied_at = new Date().toISOString();
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('application[job_offer_id]', this.application.job_offer_id);
    formData.append('application[candidate_id]', this.application.candidate_id);
    formData.append('application[status]', this.application.status);
    formData.append('application[applied_at]', this.application.applied_at);
          
    // Append the file to FormData
    if (this.selectedFile) {
      formData.append('application[cv_file]', this.selectedFile, this.selectedFile.name);
    }
      
    this.applicationService.createApplication(formData).subscribe(
      response => {
        this.typeAlert = 'success';
        this.error = "Your application has been submitted and recorded successfully."
        $('#alertModal').modal('show');
      },
      error => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while submitting your application. Please review your data or try again later.";
        $('#alertModal').modal('show');
      }
    );
    
  }

  ngAfterViewInit() {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }

}
