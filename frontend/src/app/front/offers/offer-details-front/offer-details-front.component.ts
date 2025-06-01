import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-offer-details-front',
  imports: [CommonModule, RouterModule],
  templateUrl: './offer-details-front.component.html',
  styleUrl: './offer-details-front.component.css'
})
export class OfferDetailsFrontComponent implements OnInit{

  offerId!: number;
  offer: any = {
    title: '',
    department: '',
    skills_required: '',
    experience_level: '',
    deadline: '',
    status: '',
    created_by_id: ''
  };
  offers:any;
  candidateId: string = '';
  applications: any[] = [];
  hasApplied: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));

    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.candidateId = userId;
    } else {
      console.error('User ID not found in localStorage');
    }

    if (this.offerId) {
      this.offerService.getOfferById(this.offerId).subscribe({
        next: data => {
          this.offer = data;

          // Check if already applied AFTER offer is loaded
          this.applicationService.getApplicationsByCandidatId(this.candidateId).subscribe({
            next: apps => {
              this.applications = apps;
              this.hasApplied = this.applications.some(app => app.job_offer_id === this.offerId);
            },
            error: err => {
              console.error('Error loading applications:', err);
            }
          });
        },
        error: err => {
          console.error('Error fetching offer', err);
        }
      });
    }

    this.OffersList();
  }


  OffersList() {
    this.offerService.getAllOffers().subscribe(
      offers => {
        this.offers = offers.filter((offer: any) => offer.status === 'available');
        console.log(this.offers);
      },
      error => {
        console.error('Error fetching offers:', error);
      }
    );
  }
}
