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
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }
    
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
    this.showAlert = false;
    this.offerService.updateOffer(this.offerId, this.offer).subscribe({
      next: res => {
        console.log('Offer updated successfully:', res);
        this.typeAlert = 'success';
        this.showAlert = true;
        this.error = "The Job Offer was successfully updated."
      },
      error: err => {
        console.error('Error updating offer', err);
        this.typeAlert = 'danger';
        this.showAlert = true;
        this.error = "The Job Offer's update was failed."
      }
    });
  }

}
