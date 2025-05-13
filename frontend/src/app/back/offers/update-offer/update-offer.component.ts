import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-update-offer',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './update-offer.component.html',
  styleUrl: './update-offer.component.css'
})
export class UpdateOfferComponent implements OnInit{
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

  onSubmit() {
    this.offerService.updateOffer(this.offerId, this.offer).subscribe({
      next: res => {
        alert('Job Offer updated successfully!');
        this.router.navigate(['/back/offers']); // adjust route if needed
      },
      error: err => {
        console.error('Error updating offer', err);
        alert('Failed to update offer.');
      }
    });
  }

}
