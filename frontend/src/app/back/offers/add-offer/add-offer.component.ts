import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-offer',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './add-offer.component.html',
  styleUrl: './add-offer.component.css'
})
export class AddOfferComponent implements OnInit{
  userRole: string | null = null;
  offer: any = {
    title: '',
    department: '',
    skills_required: '',
    experience_level: null,
    deadline: '', 
    status: 0,
    created_by_id: '' ,
    description: '',
    company: '',
    location: ''
  };
  showAlert = false;
  typeAlert = '';
  error='';

  constructor(private offerService: OfferService, private router:Router) {}

  ngOnInit(): void {
    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('user_id');
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if (userId) {
      if(roleUser){
        this.userRole = roleUser;
      } else {
        console.error('User Role not found in localStorage');
      }
      this.offer.created_by_id = userId;  // Assign to created_by_id
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  onSubmit() {
    this.showAlert = false;
    // Ensure offer is valid before submission
    if (this.offer.title && this.offer.department && this.offer.skills_required && 
        this.offer.experience_level && this.offer.deadline && this.offer.description &&
        this.offer.company && this.offer.location) {
      
      this.offerService.createOffer(this.offer).subscribe(
        response => {
          console.log('Offer added successfully:', response);
          this.typeAlert = 'success';
          this.showAlert = true;
          this.error = "The Job Offer was successfully added."
        },
        error => {
          console.error('Error adding offer:', error);
          this.typeAlert = 'danger';
          this.showAlert = true;
          this.error = "The Job Offer's creation was failed."
        }
      );
    } else {
      this.typeAlert = 'danger';
      this.showAlert = true;
      this.error = "Please fill all required fields."
    }
  }

}
