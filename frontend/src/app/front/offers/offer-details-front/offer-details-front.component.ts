import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.offerId) {
      this.offerService.getOfferById(this.offerId).subscribe({
        next: data => {
          this.offer = data;
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
