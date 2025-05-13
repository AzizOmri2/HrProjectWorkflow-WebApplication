import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers-list-front',
  imports: [CommonModule,RouterModule],
  templateUrl: './offers-list-front.component.html',
  styleUrl: './offers-list-front.component.css'
})
export class OffersListFrontComponent implements OnInit{

  offers:any;

  constructor(private offerService: OfferService, private router : Router){

  }

  ngOnInit(){
    this.OffersList()
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
