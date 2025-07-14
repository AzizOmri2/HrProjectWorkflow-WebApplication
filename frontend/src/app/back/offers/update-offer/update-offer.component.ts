import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfferService } from '../../../services/offer.service';


declare var $: any;

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
    experience_level: null,
    deadline: '', 
    status: 0,
    created_by_id: '' ,
    description: '',
    location: ''
  };
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService
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
    this.offerService.updateOffer(this.offerId, this.offer).subscribe({
      next: () => {
        this.typeAlert = 'success';
        this.error = 'Your changes to the job offer have been saved.';
        $('#alertModal').modal('show');
      },
      error: (err) => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while updating the job offer. Please review your data or try again later.";
        $('#alertModal').modal('show');
      }
    });
  }

  ngAfterViewInit() {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }

}
