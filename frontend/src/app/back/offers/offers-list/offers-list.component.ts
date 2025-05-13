import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offers-list',
  imports: [CommonModule,RouterModule,FilterPipe,FormsModule],
  templateUrl: './offers-list.component.html',
  styleUrl: './offers-list.component.css'
})
export class OffersListComponent implements OnInit{
  offers:any;
  actionText: string = 'Sort By';
  searchText: string = '';

  constructor(private offerService: OfferService, private router : Router){

  }

  ngOnInit(){
    this.OffersList()
  }

  OffersList(){
    this.offers = this.offerService.getAllOffers().subscribe(
      offer => {
        this.offers = offer
        console.log(this.offers);
      }
    )
  }

  // Delete offer
  deleteOffer(id: number) {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.offerService.deleteOffer(id).subscribe(
        () => {
          // Refresh the offer list after deletion
          this.ngOnInit();
        },
        error => {
          console.error('Error deleting offer:', error);
        }
      );
    }
  }

  setActionText(text: string) {
    this.actionText = text;
  }
  
}
