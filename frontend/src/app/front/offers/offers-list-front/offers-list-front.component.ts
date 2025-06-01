import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offers-list-front',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './offers-list-front.component.html',
  styleUrl: './offers-list-front.component.css'
})
export class OffersListFrontComponent implements OnInit{

  offers: any[] = [];
  filteredOffers: any[] = [];
  candidateId: string = '';

  // Filter fields
  filterText: string = '';
  selectedExperience: string = '';
  selectedSkill: string = '';
  availableSkills: string[] = [];

  constructor(private offerService: OfferService, private router: Router) {}

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.candidateId = userId;
    } else {
      this.candidateId = '';
      console.error('User ID not found in localStorage');
    }

    this.OffersList();
  }

  OffersList() {
    this.offerService.getAllOffers().subscribe(
      offers => {
        this.offers = offers.filter((offer: any) => offer.status === 'available');
        this.filteredOffers = [...this.offers]; // Initial state
        this.extractSkills();
      },
      error => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  extractSkills() {
    const skillsSet = new Set<string>();
    this.offers.forEach(offer => {
      if (offer.skills_required) {
        offer.skills_required.split(',').forEach((skill: string) => {
          skillsSet.add(skill.trim());
        });
      }
    });
    this.availableSkills = Array.from(skillsSet);
  }

  applyFilters() {
    this.filteredOffers = this.offers.filter(offer =>
      (this.filterText === '' ||
        offer.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        offer.skills_required.toLowerCase().includes(this.filterText.toLowerCase()) ||
        offer.company.toLowerCase().includes(this.filterText.toLowerCase()) ||
        offer.location.toLowerCase().includes(this.filterText.toLowerCase()) ||
        offer.experience_level.toLowerCase().includes(this.filterText.toLowerCase())
      ) &&
      (this.selectedExperience === '' || offer.experience_level === this.selectedExperience) &&
      (this.selectedSkill === '' || offer.skills_required.toLowerCase().includes(this.selectedSkill.toLowerCase()))
    );
  }

  resetFilters() {
    this.filterText = '';
    this.selectedExperience = '';
    this.selectedSkill = '';
    this.filteredOffers = [...this.offers];
  }
}
