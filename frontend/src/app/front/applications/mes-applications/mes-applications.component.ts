import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-applications',
  imports: [RouterModule, CommonModule],
  templateUrl: './mes-applications.component.html',
  styleUrl: './mes-applications.component.css'
})
export class MesApplicationsComponent implements OnInit{

  applications:any;

  constructor(
    private applicationService: ApplicationService, 
    private router : Router){

  }

  ngOnInit(){
    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.ApplicationsList(userId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }

  ApplicationsList(userId: string) {
    this.applicationService.getApplicationsByCandidatId(userId).subscribe(
      application => {
        this.applications = application;
        console.log(this.applications);
      },
      error => {
        console.error('Error fetching applications:', error);
      }
    );
  }


  withDrawApplication(applicationId: number) {
    const confirmed = window.confirm("Are you sure you want to withdraw your application ? (This action cannot be undone).");
    if (!confirmed) {
      return; // User canceled
    }
    this.applicationService.updateApplication(applicationId, { status: 'Withdrawn' }).subscribe(
      response => {
        console.log('Application withdrawn:', response);
        // Refresh the list after update
        const userId = localStorage.getItem('user_id');
        if (userId) {
          this.ApplicationsList(userId);
        }
      },
      error => {
        console.error('Error withdrawing application:', error);
      }
    );
  }

}
