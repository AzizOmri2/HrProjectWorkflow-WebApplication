import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferShowComponent } from '../offer-show/offer-show.component';


declare var $: any;


@Component({
  selector: 'app-offers-list',
  imports: [CommonModule,RouterModule,FormsModule,OfferShowComponent],
  templateUrl: './offers-list.component.html',
  styleUrl: './offers-list.component.css'
})


export class OffersListComponent implements OnInit{
  userRole: string | null = null;
  selectedOfferId: number | null = null;
  offers: any[] = [];
  filteredOffers: any[] = [];


  filterText: string = '';
  selectedExperience: string = '';
  selectedSkill: string = '';
  selectedStatus: string = '';
  availableSkills: string[] = [];
  showModal = false;

  offerIdToDelete: number | null = null;
  deleteMessage: string = 'Are you sure you want to delete this job offer?';
  typeAlert = '';
  alertMessage='';
  

  constructor(
    private offerService: OfferService
  ){}

  ngOnInit(){
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }

    this.OffersList()
  }

  openOfferInfo(offerId: number) {
    this.selectedOfferId = offerId;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeModal() {
    this.selectedOfferId = null;
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  OffersList(){
    this.offerService.getAllOffers().subscribe(
      offers => {
        this.offers = offers;
        this.filteredOffers = [...this.offers]; // Initial state
        this.extractSkills();
        console.log(offers);
      },
      error => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  // Called from UI (when user clicks Delete button)
  deleteOffer(id: number) {
    this.offerIdToDelete = id;
    this.deleteMessage = 'Are you sure you want to delete this job offer?';
    $('#confirmDeleteModal').modal('show');
  }

  // Called when user confirms deletion
  confirmDelete() {
    if (this.offerIdToDelete !== null) {
      this.offerService.deleteOffer(this.offerIdToDelete).subscribe(
        () => {
          this.OffersList();
          this.offerIdToDelete = null;

          // Show success modal
          this.typeAlert = 'success';
          this.alertMessage = "The selected job offer was deleted successfully. The list has been updated accordingly.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        },
        error => {
          this.typeAlert = 'danger';
          this.alertMessage = "The system encountered an issue while deleting the job offer. Please review your data or try again later.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        }
      );
    }
  }

  extractSkills() {
    const skillsSet = new Set<string>();
    this.offers.forEach((offer : any) => {
      if (offer.skills_required) {
        offer.skills_required.split(',').forEach((skill: string) => {
          skillsSet.add(skill.trim());
        });
      }
    });
    this.availableSkills = Array.from(skillsSet);
  }

  applyFilters() {
    this.filteredOffers = this.offers.filter((offer: any) =>
      (this.filterText === '' ||
        offer.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        offer.skills_required.toLowerCase().includes(this.filterText.toLowerCase()) ||
        offer.experience_level.toLowerCase().includes(this.filterText.toLowerCase()) ||
        offer.department.toLowerCase().includes(this.filterText.toLowerCase())
      ) &&
      (this.selectedExperience === '' || offer.experience_level === this.selectedExperience) &&
      (this.selectedSkill === '' || offer.skills_required.toLowerCase().includes(this.selectedSkill.toLowerCase())) &&
      (this.selectedStatus === '' || offer.status === this.selectedStatus)
    );
  }

  resetFilters() {
    this.filterText = '';
    this.selectedExperience = '';
    this.selectedSkill = '';
    this.selectedStatus = '';
    this.filteredOffers = [...this.offers];
  }

  ngAfterViewInit() {
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
  
}
