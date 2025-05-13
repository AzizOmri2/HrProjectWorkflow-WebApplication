import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './offer-show.component.html',
  styleUrl: './offer-show.component.css'
})
export class OfferShowComponent implements OnInit{
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
  }

}
