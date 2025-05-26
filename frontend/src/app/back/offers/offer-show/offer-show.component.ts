import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-offer-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './offer-show.component.html',
  styleUrl: './offer-show.component.css'
})
export class OfferShowComponent{
  offer: any = {
    title: '',
    department: '',
    skills_required: '',
    experience_level: '',
    deadline: '',
    status: '',
    created_by_id: ''
  };

  applications: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  @Input() offerId!: number;

  ngOnChanges() {
    if (this.offerId) {
      this.offerService.getOfferById(this.offerId).subscribe({
        next: data => {
          this.offer = data;
        },
        error: err => {
          console.error('Error fetching offer', err);
        }
      });


      this.applicationService.getApplicationsByOfferId(this.offerId).subscribe({
        next: data => {
          this.applications = data as any[];
        },
        error: err => {
          console.error('Error fetching applications', err);
        }
      });
    }
  }

}
