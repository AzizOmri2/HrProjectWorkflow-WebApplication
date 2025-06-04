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
  userRole: string | null = null;
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
  showAlert = false;
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the user Role from localStorage
    this.userRole = localStorage.getItem('user_role');

    if (!this.userRole) {
      console.error('User role not found in localStorage');
    }

    // Retrieve the offer Id from URL
    const idParam = this.route.snapshot.paramMap.get('id');
    this.offerId = Number(idParam);

    if (this.offerId) {
      this.loadOffer();
    }
  }

  loadOffer(): void {
    this.offerService.getOfferById(this.offerId).subscribe({
      next: data => {
        this.offer = data;
      },
      error: (err) => {
        console.error('Error fetching offer:', err);
      }
    });
  }

  onSubmit() {
    this.showAlert = false;

    this.offerService.updateOffer(this.offerId, this.offer).subscribe({
      next: () => {
        this.showAlert = true;
        this.typeAlert = 'success';
        this.error = 'The job offer was successfully updated.';
      },
      error: (err) => {
        console.error('Error updating offer:', err);
        this.showAlert = true;
        this.typeAlert = 'danger';
        this.error = "The job offer's update failed.";
      }
    });
  }

}
