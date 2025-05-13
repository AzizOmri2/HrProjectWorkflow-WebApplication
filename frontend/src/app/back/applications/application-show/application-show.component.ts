import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './application-show.component.html',
  styleUrl: './application-show.component.css'
})
export class ApplicationShowComponent implements OnInit{
  applicationId!: number;
  application: any = {
    job_offer_id: '',
    candidat_id: '',
    cv_file: '',
    status: '',
    applied_at: ''
  };

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.applicationId) {
      this.applicationService.getApplicationById(this.applicationId).subscribe({
        next: data => {
          this.application = data;
        },
        error: err => {
          console.error('Error fetching Application', err);
        }
      });
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
  
}
