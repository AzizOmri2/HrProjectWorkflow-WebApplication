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

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private offerService: OfferService,
    private router: Router
  ) {}

  jobOffers: any[] = [];

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
    this.applicationService.updateApplication(this.applicationId, this.application).subscribe({
      next: res => {
        alert('Application updated successfully!');
        this.router.navigate(['/back/applications']); // adjust route if needed
      },
      error: err => {
        console.error('Error updating application', err);
        alert('Failed to update application.');
      }
    });
  }
}
