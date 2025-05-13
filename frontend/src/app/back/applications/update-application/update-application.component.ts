import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-update-application',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './update-application.component.html',
  styleUrl: './update-application.component.css'
})
export class UpdateApplicationComponent implements OnInit{
  applicationId!: number;
  application: any = {
    job_offer_id: '',
    candidate_id: '',
    cv_file: '',
    status: '',
    applied_at: ''
  };
  selectedFile: File | null = null;
  showAlert = false;
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private offerService: OfferService,
    private router: Router
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
    this.offerService.getAllOffers().subscribe(data => {
      this.jobOffers = data;
    });
    
    this.applicationId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.applicationId) {
      this.applicationService.getApplicationById(this.applicationId).subscribe({
        next: data => {
          this.application = data;
        },
        error: err => {
          console.error('Error fetching application', err);
        }
      });
    }
  }

  onSubmit() {
    this.showAlert = false;

    const formData = new FormData();
    formData.append('application[job_offer_id]', this.application.job_offer_id);
    formData.append('application[candidate_id]', this.application.candidate_id);
    formData.append('application[status]', this.application.status);
    formData.append('application[applied_at]', this.application.applied_at);
    
    // Append the file to FormData
    if (this.selectedFile) {
      formData.append('application[cv_file]', this.selectedFile, this.selectedFile.name);
    }

    this.applicationService.updateApplication(this.applicationId, formData).subscribe({
      next: res => {
        console.log('Application updated successfully:', res);
        this.typeAlert = 'success';
        this.showAlert = true;
        this.error = "The Application was successfully updated."
      },
      error: err => {
        console.error('Error updating application', err);
        this.typeAlert = 'danger';
        this.showAlert = true;
        this.error = "The Application's update was failed."
      }
    });
  }
}
