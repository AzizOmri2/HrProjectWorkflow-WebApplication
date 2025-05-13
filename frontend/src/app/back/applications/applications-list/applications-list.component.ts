import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../filter.pipe';

@Component({
  selector: 'app-applications-list',
  imports: [RouterModule,CommonModule,FormsModule, FilterPipe],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.css'
})
export class ApplicationsListComponent implements OnInit{
  applications:any;
  actionText: string = 'Sort By';
  searchText: string = '';


  constructor(private applicationService: ApplicationService, private router : Router){

  }

  ngOnInit(){
    this.ApplicationsList()
  }

  ApplicationsList(){
    this.applications = this.applicationService.getAllApplications().subscribe(
      application => {
        this.applications = application
        console.log(this.applications);
      }
    )
  }

  // Delete application
  deleteApplication(id: number) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(id).subscribe(
        () => {
          // Refresh the application list after deletion
          this.ngOnInit();
        },
        error => {
          console.error('Error deleting application:', error);
        }
      );
    }
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

  setActionText(text: string) {
    this.actionText = text;
  }
}
