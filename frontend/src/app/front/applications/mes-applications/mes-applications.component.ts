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
    const confirmed = window.confirm(
      "⚠️ You're about to withdraw your application.\n\nThis action is irreversible. Do you want to continue?"
    );
    if (!confirmed) {
      return; // User canceled
    }
    this.applicationService.withdrawApplication(applicationId).subscribe(
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


  // Method to download the CV as PDF
  downloadCv(id:number,candidate_name:string) {
    this.applicationService.downloadPdf(id).subscribe(
      (response) => {
        // Create a link element to trigger the download
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Replace spaces with underscores and sanitize the filename if needed
        const safeName = candidate_name.trim().replace(/\s+/g, '_');
        link.download = `cv_${safeName}_${id}_HRProjectWorkFlow_2025.pdf`; // Default download name
        link.click();
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );
  }

}
